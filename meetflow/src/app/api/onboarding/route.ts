import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { homeForRole } from "@/lib/roles";

const bodySchema = z.object({
  // PLATFORM_ADMIN cannot be self-assigned; it is promoted manually in Clerk.
  role: z.enum(["CANDIDATE", "COMPANY_ADMIN", "HIRING_MANAGER"]),
  consented: z.literal(true),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "入力が不正です。" }, { status: 400 });
  }

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);
  const primaryEmail =
    clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress;

  if (!primaryEmail) {
    return NextResponse.json({ error: "メールアドレスを取得できませんでした。" }, { status: 400 });
  }

  // Upsert the local User record keyed by Clerk id.
  await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email: primaryEmail, role: parsed.data.role },
    create: { clerkId: userId, email: primaryEmail, role: parsed.data.role },
  });

  // Mirror the role into Clerk public metadata so the middleware can read it
  // directly from the session claims without a DB roundtrip.
  await client.users.updateUser(userId, {
    publicMetadata: { ...clerkUser.publicMetadata, role: parsed.data.role },
  });

  // [COMPLIANCE] Record the consent moment in the audit log.
  await prisma.auditLog.create({
    data: {
      actorId: userId,
      action: "ONBOARDING_COMPLETED",
      targetType: "User",
      targetId: userId,
      metadata: { role: parsed.data.role, consented: true, consentedAt: new Date().toISOString() },
    },
  });

  return NextResponse.json({ redirectTo: homeForRole(parsed.data.role) });
}
