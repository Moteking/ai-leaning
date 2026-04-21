import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { notifyApplicationReceived } from "@/lib/notifications";
import { sendApplicationNotificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "creator") {
    return NextResponse.json({ error: "Only creators can apply" }, { status: 403 });
  }

  const body = await request.json();
  const { campaignId, message, proposedRate } = body;

  if (!campaignId) {
    return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });
  }

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { brand: true },
  });

  if (!campaign || campaign.status !== "open") {
    return NextResponse.json({ error: "Campaign not found or not accepting applications" }, { status: 404 });
  }

  const existing = await prisma.application.findFirst({
    where: { campaignId, creatorId: user.userId },
  });

  if (existing) {
    return NextResponse.json({ error: "Already applied" }, { status: 409 });
  }

  const application = await prisma.application.create({
    data: {
      campaignId,
      creatorId: user.userId,
      message: message || "",
      proposedRate: proposedRate || null,
    },
  });

  const creator = await prisma.user.findUnique({ where: { id: user.userId } });
  const creatorHandle = creator?.name || "A creator";

  notifyApplicationReceived(campaign.brandId, creatorHandle, campaign.title).catch(console.error);
  sendApplicationNotificationEmail(
    campaign.brand.email,
    campaign.brand.company || campaign.brand.name,
    creatorHandle,
    campaign.title
  ).catch(console.error);

  return NextResponse.json({ data: application }, { status: 201 });
}
