import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { sseManager } from "@/lib/sse";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const stream = new ReadableStream({
    start(controller) {
      sseManager.addClient(user.userId, controller);

      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`));

      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keepalive\n\n"));
        } catch {
          clearInterval(keepAlive);
          sseManager.removeClient(controller);
        }
      }, 30000);

      request.signal.addEventListener("abort", () => {
        clearInterval(keepAlive);
        sseManager.removeClient(controller);
        try {
          controller.close();
        } catch {
          // already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
