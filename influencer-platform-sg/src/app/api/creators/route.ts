import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const platform = searchParams.get("platform");
  const q = searchParams.get("q");

  const profiles = await prisma.creatorProfile.findMany({
    where: {
      ...(category && category !== "All" ? { categories: { contains: category } } : {}),
      ...(q
        ? {
            OR: [
              { handle: { contains: q } },
              { displayName: { contains: q } },
              { bio: { contains: q } },
            ],
          }
        : {}),
    },
    include: {
      user: { select: { id: true, email: true, name: true } },
      platforms: true,
      rateCard: true,
    },
    orderBy: { completedCampaigns: "desc" },
  });

  let results = profiles;

  if (platform && platform !== "all") {
    results = results.filter((p) =>
      p.platforms.some((pl) => pl.platform === platform)
    );
  }

  return NextResponse.json({ data: results, total: results.length });
}
