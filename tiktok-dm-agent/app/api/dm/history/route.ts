import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const affiliatorId = searchParams.get("affiliatorId");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {};
  if (affiliatorId) where.affiliatorId = affiliatorId;

  const dms = await prisma.dM.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      affiliator: {
        select: { name: true, tiktokHandle: true },
      },
    },
  });

  return Response.json({ dms });
}

export async function PUT(request: NextRequest) {
  const { id, status, content } = await request.json();

  const data: Record<string, unknown> = {};
  if (status) data.status = status;
  if (content) data.content = content;
  if (status === "sent") data.sentAt = new Date();

  const dm = await prisma.dM.update({
    where: { id },
    data,
  });

  // Update affiliator status if DM is sent
  if (status === "sent") {
    const affiliator = await prisma.affiliator.findUnique({
      where: { id: dm.affiliatorId },
    });
    if (affiliator && affiliator.status === "new") {
      await prisma.affiliator.update({
        where: { id: dm.affiliatorId },
        data: { status: "contacted" },
      });
    }
  }

  return Response.json(dm);
}
