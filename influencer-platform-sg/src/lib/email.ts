import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

const FROM = process.env.EMAIL_FROM || "CastSG <noreply@castsg.com>";

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_USER) {
    console.log(`[Email] Would send to ${to}: ${subject}`);
    return;
  }

  await transporter.sendMail({ from: FROM, to, subject, html });
}

export async function sendWelcomeEmail(to: string, name: string, role: string) {
  const dashboardUrl = role === "brand" ? "/dashboard/brand" : "/dashboard/creator";

  await sendEmail(
    to,
    "Welcome to CastSG!",
    `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #6366f1;">Welcome to CastSG, ${name}! 🎉</h1>
      <p>Your account has been created successfully.</p>
      <p>${role === "brand"
        ? "Start by posting your first campaign or browsing our verified creators."
        : "Complete your profile and start browsing campaign opportunities."
      }</p>
      <a href="https://castsg.com${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #ec4899); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Go to Dashboard
      </a>
    </div>
    `
  );
}

export async function sendMessageNotificationEmail(
  to: string,
  recipientName: string,
  senderName: string,
  messagePreview: string
) {
  await sendEmail(
    to,
    `New message from ${senderName} on CastSG`,
    `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6366f1;">New message</h2>
      <p>Hi ${recipientName},</p>
      <p><strong>${senderName}</strong> sent you a message:</p>
      <div style="background: #f8fafc; border-left: 4px solid #6366f1; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        ${messagePreview}
      </div>
      <a href="https://castsg.com/dashboard/creator/messages" style="display: inline-block; background: #6366f1; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
        Reply now
      </a>
    </div>
    `
  );
}

export async function sendApplicationNotificationEmail(
  to: string,
  brandName: string,
  creatorHandle: string,
  campaignTitle: string
) {
  await sendEmail(
    to,
    `New application for "${campaignTitle}"`,
    `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6366f1;">New Campaign Application</h2>
      <p>Hi ${brandName},</p>
      <p><strong>${creatorHandle}</strong> has applied to your campaign <strong>"${campaignTitle}"</strong>.</p>
      <a href="https://castsg.com/dashboard/brand/campaigns" style="display: inline-block; background: #6366f1; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
        Review application
      </a>
    </div>
    `
  );
}
