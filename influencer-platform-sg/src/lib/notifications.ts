import { prisma } from "./db";

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  body: string,
  link?: string
) {
  return prisma.notification.create({
    data: { userId, type, title, body, link },
  });
}

export async function notifyNewMessage(
  recipientId: string,
  senderName: string,
  campaignTitle?: string
) {
  return createNotification(
    recipientId,
    "message",
    "New message",
    `${senderName} sent you a message${campaignTitle ? ` about "${campaignTitle}"` : ""}`,
    "/dashboard/creator/messages"
  );
}

export async function notifyApplicationReceived(
  brandUserId: string,
  creatorHandle: string,
  campaignTitle: string
) {
  return createNotification(
    brandUserId,
    "application",
    "New application",
    `${creatorHandle} applied to "${campaignTitle}"`,
    "/dashboard/brand/campaigns"
  );
}

export async function notifyApplicationStatusChanged(
  creatorUserId: string,
  campaignTitle: string,
  status: string
) {
  const label = status === "accepted" ? "accepted" : status === "shortlisted" ? "shortlisted" : "not selected";
  return createNotification(
    creatorUserId,
    "application",
    `Application ${label}`,
    `Your application for "${campaignTitle}" has been ${label}`,
    "/dashboard/creator/my-campaigns"
  );
}

export async function notifyNewCampaign(
  creatorUserId: string,
  campaignTitle: string,
  brandName: string
) {
  return createNotification(
    creatorUserId,
    "campaign",
    "New campaign opportunity",
    `${brandName} posted "${campaignTitle}" — check if it matches your profile`,
    "/dashboard/creator/campaigns"
  );
}
