import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  if (action === "login") {
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: "メールアドレスとパスワードは必須です" }, { status: 400 });
    }

    // Mock authentication
    return NextResponse.json({
      data: {
        id: "u-001",
        email,
        name: "テストユーザー",
        role: "advertiser",
        token: "mock-jwt-token",
      },
    });
  }

  if (action === "register") {
    const { email, password, name, role } = body;
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "すべての項目を入力してください" }, { status: 400 });
    }

    return NextResponse.json(
      {
        data: {
          id: `u-${Date.now()}`,
          email,
          name,
          role,
          token: "mock-jwt-token",
        },
      },
      { status: 201 }
    );
  }

  return NextResponse.json({ error: "不正なアクションです" }, { status: 400 });
}
