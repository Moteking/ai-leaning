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
    const parents = await prisma.parent.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ parents });
  } catch (error) {
    console.error("Failed to fetch parent profiles:", error);
    return NextResponse.json(
      { error: "親プロフィールの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { relation, name, age, livingAlone, healthStatus, hobbies, region, birthday, notes } = body;

    if (!relation || !name || !age || !healthStatus || !region) {
      return NextResponse.json(
        { error: "必須項目を入力してください" },
        { status: 400 }
      );
    }

    const user = await getDemoUser();

    // Check if user already has 2 parents
    const existingParents = await prisma.parent.findMany({
      where: { userId: user.id },
    });

    if (existingParents.length >= 2) {
      return NextResponse.json(
        { error: "登録できる親は最大2名までです" },
        { status: 400 }
      );
    }

    // Check if same relation already exists
    const sameRelation = existingParents.find((p) => p.relation === relation);
    if (sameRelation) {
      // Update existing
      const updated = await prisma.parent.update({
        where: { id: sameRelation.id },
        data: {
          name,
          age: Number(age),
          livingAlone: Boolean(livingAlone),
          healthStatus,
          hobbies: JSON.stringify(hobbies || []),
          region,
          birthday: birthday || null,
          notes: notes || null,
        },
      });
      return NextResponse.json({ parent: updated, updated: true });
    }

    const parent = await prisma.parent.create({
      data: {
        userId: user.id,
        relation,
        name,
        age: Number(age),
        livingAlone: Boolean(livingAlone),
        healthStatus,
        hobbies: JSON.stringify(hobbies || []),
        region,
        birthday: birthday || null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ parent, updated: false });
  } catch (error) {
    console.error("Failed to save parent profile:", error);
    return NextResponse.json(
      { error: "親プロフィールの保存に失敗しました" },
      { status: 500 }
    );
  }
}
