import { NextRequest, NextResponse } from "next/server";
import { mockAffiliates } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const minFollowers = searchParams.get("minFollowers");
  const sortBy = searchParams.get("sortBy") || "score";
  const query = searchParams.get("q");

  let results = [...mockAffiliates];

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (a) =>
        a.tiktokHandle.toLowerCase().includes(q) ||
        a.bio.toLowerCase().includes(q) ||
        a.categories.some((c) => c.toLowerCase().includes(q))
    );
  }

  if (category && category !== "すべて") {
    results = results.filter((a) => a.categories.includes(category));
  }

  if (minFollowers) {
    const min = parseInt(minFollowers);
    results = results.filter((a) => a.followers >= min);
  }

  switch (sortBy) {
    case "followers":
      results.sort((a, b) => b.followers - a.followers);
      break;
    case "gmv":
      results.sort((a, b) => b.monthlyGmv - a.monthlyGmv);
      break;
    case "engagement":
      results.sort((a, b) => b.engagementRate - a.engagementRate);
      break;
    default:
      results.sort((a, b) => b.affiliateScore - a.affiliateScore);
  }

  return NextResponse.json({
    data: results,
    total: results.length,
  });
}
