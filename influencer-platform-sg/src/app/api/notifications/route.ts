import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = await prisma.notification.count({
    where: { userId: user.userId, read: false },
  });

  return NextResponse.json({ data: notifications, unreadCount });
}

export async function PATCH(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { notificationId, markAllRead } = body;

  if (markAllRead) {
    await prisma.notification.updateMany({
      where: { userId: user.userId, read: false },
      data: { read: true },
    });
    return NextResponse.json({ success: true });
  }

  if (notificationId) {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "notificationId or markAllRead required" }, { status: 400 });
}
