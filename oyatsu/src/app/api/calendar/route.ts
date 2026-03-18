import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEMO_EMAIL = "demo@oyatsu.jp";

async function getDemoUser() {
  return prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      email: DEMO_EMAIL,
      name: "デモユーザー",
    },
  });
}

export async function GET() {
  try {
    const user = await getDemoUser();
    const events = await prisma.calendarEvent.findMany({
      where: { userId: user.id },
      orderBy: { date: "asc" },
    });
    return NextResponse.json({ events });
  } catch (error) {
    console.error("Failed to fetch calendar events:", error);
    return NextResponse.json(
      { error: "イベントの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, date, type, parentRelation, reminder, reminderDays, notes } = body;

    if (!title || !date || !type) {
      return NextResponse.json(
        { error: "タイトル、日付、種類は必須です" },
        { status: 400 }
      );
    }

    const user = await getDemoUser();

    const event = await prisma.calendarEvent.create({
      data: {
        userId: user.id,
        title,
        date,
        type,
        parentRelation: parentRelation || null,
        reminder: reminder !== false,
        reminderDays: reminderDays ? Number(reminderDays) : 14,
        notes: notes || null,
      },
    });

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Failed to create calendar event:", error);
    return NextResponse.json(
      { error: "イベントの作成に失敗しました" },
      { status: 500 }
    );
  }
}
