import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { participant1Id: user.userId },
        { participant2Id: user.userId },
      ],
    },
    include: {
      participant1: { select: { id: true, name: true, company: true, role: true } },
      participant2: { select: { id: true, name: true, company: true, role: true } },
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const formatted = conversations.map((conv) => {
    const otherParticipant =
      conv.participant1Id === user.userId ? conv.participant2 : conv.participant1;
    const lastMessage = conv.messages[conv.messages.length - 1];
    const unreadCount = conv.messages.filter(
      (m) => m.senderId !== user.userId && !m.read
    ).length;

    return {
      id: conv.id,
      participant: otherParticipant,
      campaignTitle: conv.campaignTitle,
      lastMessage: lastMessage?.content || "",
      lastMessageTime: lastMessage?.createdAt || conv.createdAt,
      unreadCount,
      messages: conv.messages.map((m) => ({
        id: m.id,
        senderId: m.senderId,
        content: m.content,
        read: m.read,
        createdAt: m.createdAt,
      })),
    };
  });

  return NextResponse.json({ data: formatted });
}
