import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const niche = searchParams.get("niche");
  const status = searchParams.get("status");
  const minFollowers = searchParams.get("minFollowers");
  const maxFollowers = searchParams.get("maxFollowers");
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {};
  if (niche) where.niche = niche;
  if (status) where.status = status;
  if (minFollowers || maxFollowers) {
    where.followers = {
      ...(minFollowers ? { gte: parseInt(minFollowers) } : {}),
      ...(maxFollowers ? { lte: parseInt(maxFollowers) } : {}),
    };
  }

  const [affiliators, total] = await Promise.all([
    prisma.affiliator.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: { dms: { select: { id: true, status: true } } },
    }),
    prisma.affiliator.count({ where }),
  ]);

  return Response.json({ affiliators, total, page, limit });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Support bulk import
  if (Array.isArray(body)) {
    const results = [];
    for (const item of body) {
      try {
        const affiliator = await prisma.affiliator.create({ data: item });
        results.push({ success: true, affiliator });
      } catch (error) {
        results.push({
          success: false,
          handle: item.tiktokHandle,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
    return Response.json({ results }, { status: 201 });
  }

  const affiliator = await prisma.affiliator.create({ data: body });
  return Response.json(affiliator, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, ...data } = body;

  const affiliator = await prisma.affiliator.update({
    where: { id },
    data,
  });

  return Response.json(affiliator);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  await prisma.dM.deleteMany({ where: { affiliatorId: id } });
  await prisma.affiliator.delete({ where: { id } });

  return Response.json({ success: true });
}
