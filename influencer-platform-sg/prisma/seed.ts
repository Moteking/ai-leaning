// @ts-nocheck
const { PrismaClient } = require("../src/generated/prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
// better-sqlite3 not needed directly
const bcrypt = require("bcryptjs");
const path = require("path");

const dbPath = path.join(__dirname, "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const hash = await bcrypt.hash("password123", 12);

  const brand = await prisma.user.upsert({
    where: { email: "brand@castsg.com" },
    update: {},
    create: { email: "brand@castsg.com", passwordHash: hash, name: "Sarah Chen", role: "brand", company: "Glow Skincare Co." },
  });

  const creatorsData = [
    { email: "shermaine@castsg.com", name: "Shermaine Tan", handle: "@shermaine.sg", bio: "Lifestyle & beauty creator in SG. Love café hopping and trying new skincare.", city: "Singapore", languages: "English,Mandarin", categories: "Beauty,Lifestyle,F&B" },
    { email: "marcus@castsg.com", name: "Marcus Tan", handle: "@marcustan_eats", bio: "Your friendly neighbourhood food reviewer. Hawker centres, hidden gems.", city: "Singapore", languages: "English", categories: "F&B,Travel" },
    { email: "priya@castsg.com", name: "Priya Kaur", handle: "@priya.fitness", bio: "Certified personal trainer. Helping you find strength.", city: "Singapore", languages: "English,Hindi,Punjabi", categories: "Fitness,Wellness" },
    { email: "aisyah@castsg.com", name: "Aisyah Rahman", handle: "@aisyah.styles", bio: "Modest fashion + halal lifestyle in SG. EN/Malay.", city: "Singapore", languages: "English,Malay", categories: "Fashion,Lifestyle,Travel" },
    { email: "daniel@castsg.com", name: "Daniel Lim", handle: "@daniel.techreviews", bio: "Tech reviewer. Phones, laptops, gadgets — honest reviews.", city: "Singapore", languages: "English,Mandarin", categories: "Tech,Gadgets" },
  ];

  const creatorUsers = [];
  for (const c of creatorsData) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: { email: c.email, passwordHash: hash, name: c.name, role: "creator" },
    });
    creatorUsers.push(user);

    const existing = await prisma.creatorProfile.findUnique({ where: { userId: user.id } });
    if (!existing) {
      const profile = await prisma.creatorProfile.create({
        data: { userId: user.id, handle: c.handle, displayName: c.name, bio: c.bio, city: c.city, languages: c.languages, categories: c.categories, verified: true, completedCampaigns: 15 + Math.floor(Math.random() * 55), averageRating: 4.5 + Math.random() * 0.5 },
      });
      await prisma.creatorPlatform.createMany({
        data: [
          { creatorId: profile.id, platform: "instagram", handle: c.handle, followers: 50000 + Math.floor(Math.random() * 200000), url: `https://instagram.com/${c.handle.slice(1)}` },
          { creatorId: profile.id, platform: "tiktok", handle: c.handle, followers: 30000 + Math.floor(Math.random() * 300000), url: `https://tiktok.com/${c.handle}` },
        ],
      });
      await prisma.rateCard.create({
        data: { creatorId: profile.id, instagramPost: 600 + Math.floor(Math.random() * 1000), instagramReel: 900 + Math.floor(Math.random() * 1500), instagramStory: 200 + Math.floor(Math.random() * 300), tiktokVideo: 800 + Math.floor(Math.random() * 1500) },
      });
    }
  }

  const campaignsData = [
    { title: "New Vitamin C Serum Launch", description: "Launching our Vitamin C Serum. Looking for beauty creators.", briefMarkdown: "7-day trial, reel + stories.", productName: "Glow Vitamin C Serum", budgetSGD: 15000, paymentPerCreatorSGD: 1500, status: "open", categories: "Beauty,Skincare", platforms: "instagram,tiktok", applicationDeadline: "2026-04-25", contentDeadline: "2026-05-15", startDate: "2026-04-15", endDate: "2026-05-31" },
    { title: "Hawker Heritage Campaign", description: "Celebrating SG hawker culture with food creators.", briefMarkdown: "Visit stalls, create 2-3 min TikTok.", productName: "Hawker Heritage Month", budgetSGD: 25000, paymentPerCreatorSGD: 2500, status: "open", categories: "F&B", platforms: "tiktok,instagram", applicationDeadline: "2026-04-30", contentDeadline: "2026-05-30", startDate: "2026-04-20", endDate: "2026-06-15" },
    { title: "Smartphone Launch Review", description: "Honest reviews for new flagship phone.", briefMarkdown: "10+ min YouTube review. Camera & gaming test.", productName: "TechWave Pro 15", budgetSGD: 20000, paymentPerCreatorSGD: 5000, status: "in_progress", categories: "Tech,Gadgets", platforms: "youtube", applicationDeadline: "2026-04-10", contentDeadline: "2026-05-01", startDate: "2026-04-05", endDate: "2026-05-15" },
  ];

  for (const c of campaignsData) {
    const existing = await prisma.campaign.findFirst({ where: { title: c.title, brandId: brand.id } });
    if (!existing) {
      const camp = await prisma.campaign.create({ data: { brandId: brand.id, ...c } });
      await prisma.deliverable.create({ data: { campaignId: camp.id, type: "instagram_reel", quantity: 1, requirements: "60-90 second reel" } });

      if (c.status !== "draft") {
        await prisma.application.create({
          data: { campaignId: camp.id, creatorId: creatorUsers[0].id, message: "I'd love to work on this!", status: c.status === "in_progress" ? "accepted" : "pending" },
        });
      }
    }
  }

  const conv = await prisma.conversation.findFirst({ where: { participant1Id: brand.id, participant2Id: creatorUsers[0].id } });
  if (!conv) {
    const c = await prisma.conversation.create({ data: { participant1Id: brand.id, participant2Id: creatorUsers[0].id, campaignTitle: "New Vitamin C Serum Launch" } });
    await prisma.message.createMany({
      data: [
        { conversationId: c.id, senderId: brand.id, content: "Hi Shermaine! Thanks for your application!", read: true },
        { conversationId: c.id, senderId: creatorUsers[0].id, content: "Hi! So excited about this opportunity!", read: true },
        { conversationId: c.id, senderId: brand.id, content: "We'd like to move forward. Can you share some previous skincare reviews?", read: false },
      ],
    });
  }

  await prisma.notification.createMany({
    data: [
      { userId: creatorUsers[0].id, type: "campaign", title: "New campaign opportunity", body: "Glow Skincare Co. posted 'New Vitamin C Serum Launch'", link: "/dashboard/creator/campaigns" },
      { userId: creatorUsers[0].id, type: "message", title: "New message", body: "Glow Skincare Co. sent you a message", link: "/dashboard/creator/messages" },
      { userId: brand.id, type: "application", title: "New application", body: "Shermaine Tan applied to 'New Vitamin C Serum Launch'", link: "/dashboard/brand/campaigns" },
    ],
  });

  console.log("\nSeed complete!");
  console.log("\nDemo accounts:");
  console.log("  Brand:   brand@castsg.com / password123");
  console.log("  Creator: shermaine@castsg.com / password123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
