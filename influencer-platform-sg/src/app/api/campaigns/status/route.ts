import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { notifyApplicationStatusChanged } from "@/lib/notifications";

export async function PATCH(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { applicationId, status } = body;

  if (!applicationId || !status) {
    return NextResponse.json({ error: "applicationId and status are required" }, { status: 400 });
  }

  if (!["pending", "shortlisted", "accepted", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { campaign: true },
  });

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  if (application.campaign.brandId !== user.userId) {
    return NextResponse.json({ error: "Not your campaign" }, { status: 403 });
  }

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });

  notifyApplicationStatusChanged(
    application.creatorId,
    application.campaign.title,
    status
  ).catch(console.error);

  return NextResponse.json({ data: updated });
}
