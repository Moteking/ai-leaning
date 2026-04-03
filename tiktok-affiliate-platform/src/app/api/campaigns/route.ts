import { NextRequest, NextResponse } from "next/server";
import { mockCampaigns } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const category = searchParams.get("category");

  let results = [...mockCampaigns];

  if (status) {
    results = results.filter((c) => c.status === status);
  }

  if (category) {
    results = results.filter((c) => c.categories.includes(category));
  }

  return NextResponse.json({
    data: results,
    total: results.length,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const newCampaign = {
    id: `c-${Date.now()}`,
    advertiserId: "adv-001",
    ...body,
    spent: 0,
    status: "draft",
    applicants: [],
    createdAt: new Date().toISOString().split("T")[0],
  };

  return NextResponse.json({ data: newCampaign }, { status: 201 });
}
