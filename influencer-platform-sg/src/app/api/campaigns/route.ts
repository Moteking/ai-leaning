import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const brandId = searchParams.get("brandId");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (brandId) where.brandId = brandId;
  if (category) where.categories = { contains: category };

  const campaigns = await prisma.campaign.findMany({
    where,
    include: {
      deliverables: true,
      applications: { include: { creator: { select: { id: true, name: true } } } },
      brand: { select: { id: true, name: true, company: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: campaigns, total: campaigns.length });
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "brand") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    title, description, briefMarkdown, productName,
    budgetSGD, paymentPerCreatorSGD, status,
    categories, platforms, targetCity,
    minFollowers, maxFollowers,
    applicationDeadline, contentDeadline, startDate, endDate,
    deliverables,
  } = body;

  if (!title || !description) {
    return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
  }

  const campaign = await prisma.campaign.create({
    data: {
      brandId: user.userId,
      title,
      description,
      briefMarkdown: briefMarkdown || "",
      productName: productName || "",
      budgetSGD: budgetSGD || 0,
      paymentPerCreatorSGD: paymentPerCreatorSGD || 0,
      status: status || "draft",
      categories: Array.isArray(categories) ? categories.join(",") : categories || "",
      platforms: Array.isArray(platforms) ? platforms.join(",") : platforms || "",
      targetCity: targetCity || "Singapore",
      minFollowers: minFollowers || 0,
      maxFollowers: maxFollowers || 0,
      applicationDeadline: applicationDeadline || "",
      contentDeadline: contentDeadline || "",
      startDate: startDate || "",
      endDate: endDate || "",
      deliverables: deliverables?.length
        ? {
            create: deliverables.map((d: { type: string; quantity: number; requirements: string }) => ({
              type: d.type,
              quantity: d.quantity,
              requirements: d.requirements || "",
            })),
          }
        : undefined,
    },
    include: { deliverables: true },
  });

  return NextResponse.json({ data: campaign }, { status: 201 });
}
