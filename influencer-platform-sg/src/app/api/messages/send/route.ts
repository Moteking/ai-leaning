import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { notifyNewMessage } from "@/lib/notifications";
import { sendMessageNotificationEmail } from "@/lib/email";
import { sseManager } from "@/lib/sse";

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { recipientId, content, campaignTitle } = body;

  if (!recipientId || !content) {
    return NextResponse.json({ error: "recipientId and content are required" }, { status: 400 });
  }

  let conversation = await prisma.conversation.findFirst({
    where: {
      OR: [
        { participant1Id: user.userId, participant2Id: recipientId },
        { participant1Id: recipientId, participant2Id: user.userId },
      ],
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        participant1Id: user.userId,
        participant2Id: recipientId,
        campaignTitle: campaignTitle || null,
      },
    });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: user.userId,
      content,
    },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date() },
  });

  const sender = await prisma.user.findUnique({ where: { id: user.userId } });
  const recipient = await prisma.user.findUnique({ where: { id: recipientId } });
  const senderName = sender?.company || sender?.name || "Someone";

  notifyNewMessage(recipientId, senderName, campaignTitle).catch(console.error);

  if (recipient) {
    sendMessageNotificationEmail(
      recipient.email,
      recipient.name,
      senderName,
      content.slice(0, 200)
    ).catch(console.error);
  }

  sseManager.send(recipientId, {
    type: "new_message",
    conversationId: conversation.id,
    message: {
      id: message.id,
      senderId: user.userId,
      senderName,
      content,
      createdAt: message.createdAt,
    },
  });

  return NextResponse.json({ data: message }, { status: 201 });
}
