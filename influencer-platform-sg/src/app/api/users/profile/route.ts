import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function PATCH(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, company, phone, bio, city, languages, categories, handle } = body;

  const updated = await prisma.user.update({
    where: { id: user.userId },
    data: {
      ...(name && { name }),
      ...(company !== undefined && { company }),
      ...(phone !== undefined && { phone }),
    },
  });

  if (user.role === "creator") {
    const profile = await prisma.creatorProfile.findUnique({ where: { userId: user.userId } });
    if (profile) {
      await prisma.creatorProfile.update({
        where: { userId: user.userId },
        data: {
          ...(bio !== undefined && { bio }),
          ...(city !== undefined && { city }),
          ...(languages !== undefined && { languages }),
          ...(categories !== undefined && { categories }),
          ...(handle !== undefined && { handle }),
        },
      });
    }
  }

  return NextResponse.json({ success: true, user: updated });
}
