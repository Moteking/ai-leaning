import { NextRequest, NextResponse } from "next/server";

type Recipient = "mother" | "father" | "both";
type Occasion = "birthday" | "mothers_day" | "fathers_day" | "respect_day" | "none";

const recipientLabels: Record<Recipient, string> = {
  mother: "お母さん",
  father: "お父さん",
  both: "お父さん、お母さん",
};

const recipientSalutations: Record<Recipient, string> = {
  mother: "お母さんへ",
  father: "お父さんへ",
  both: "お父さん、お母さんへ",
};

const occasionGreetings: Record<Occasion, string> = {
  birthday: "お誕生日おめでとうございます。",
  mothers_day: "母の日に、日頃の感謝を込めて贈ります。",
  fathers_day: "父の日に、日頃の感謝を込めて贈ります。",
  respect_day: "敬老の日のお祝いを申し上げます。",
  none: "",
};

const occasionClosings: Record<Occasion, string> = {
  birthday: "素敵な一年になりますように。",
  mothers_day: "いつまでも元気で、笑顔でいてください。",
  fathers_day: "いつまでも元気で、頼りにしています。",
  respect_day: "これからもお元気で長生きしてくださいね。",
  none: "どうかお体に気をつけて、元気でいてください。",
};

// Template fragments that get mixed and matched based on user feelings
const gratitudeTemplates = [
  "いつも温かく見守ってくれて、本当にありがとうございます。",
  "子どもの頃から変わらない愛情に、心から感謝しています。",
  "普段はなかなか言えないけれど、感謝の気持ちでいっぱいです。",
];

const apologyTemplates = [
  "なかなか会いに行けず、申し訳ない気持ちでいます。",
  "忙しさを言い訳にして、連絡が少なくなってしまってごめんなさい。",
  "もっと頻繁に顔を見せに行きたいと、いつも思っています。",
];

const healthTemplates = [
  "くれぐれもお体を大切にしてくださいね。",
  "無理をせず、ゆっくり過ごしてほしいと願っています。",
  "健康が何よりの宝です。お体に気をつけてください。",
];

const loveTemplates = [
  "離れていても、いつも{recipient}のことを想っています。",
  "{recipient}がいてくれるから、私は頑張れています。",
  "{recipient}の笑顔が、私の一番の幸せです。",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectThemes(feelings: string): string[] {
  const themes: string[] = [];
  const lower = feelings.toLowerCase();

  if (
    lower.includes("ありがとう") ||
    lower.includes("感謝") ||
    lower.includes("ありがたい") ||
    lower.includes("お世話")
  ) {
    themes.push("gratitude");
  }

  if (
    lower.includes("申し訳") ||
    lower.includes("ごめん") ||
    lower.includes("帰省") ||
    lower.includes("会えて") ||
    lower.includes("行けて") ||
    lower.includes("帰れ")
  ) {
    themes.push("apology");
  }

  if (
    lower.includes("体") ||
    lower.includes("健康") ||
    lower.includes("元気") ||
    lower.includes("心配") ||
    lower.includes("無理")
  ) {
    themes.push("health");
  }

  if (
    lower.includes("好き") ||
    lower.includes("大切") ||
    lower.includes("愛") ||
    lower.includes("想") ||
    lower.includes("幸せ")
  ) {
    themes.push("love");
  }

  // Default to gratitude + love if nothing detected
  if (themes.length === 0) {
    themes.push("gratitude", "love");
  }

  return themes;
}

function generateLetter(
  feelings: string,
  recipient: Recipient,
  occasion: Occasion
): string {
  const themes = detectThemes(feelings);
  const salutation = recipientSalutations[recipient];
  const label = recipientLabels[recipient];
  const occasionGreeting = occasionGreetings[occasion];
  const occasionClosing = occasionClosings[occasion];

  const bodyParts: string[] = [];

  // Add occasion greeting
  if (occasionGreeting) {
    bodyParts.push(occasionGreeting);
  }

  // Build body based on detected themes
  if (themes.includes("apology")) {
    bodyParts.push(pickRandom(apologyTemplates));
  }

  if (themes.includes("gratitude")) {
    bodyParts.push(pickRandom(gratitudeTemplates));
  }

  // Incorporate the user's own feelings naturally
  bodyParts.push(
    `「${feelings.trim()}」という気持ちを、どうしても伝えたくて手紙を書きました。`
  );

  if (themes.includes("love")) {
    bodyParts.push(pickRandom(loveTemplates).replace("{recipient}", label));
  }

  if (themes.includes("health")) {
    bodyParts.push(pickRandom(healthTemplates));
  }

  // Add occasion-specific closing
  bodyParts.push(occasionClosing);

  // Add a warm sign-off
  bodyParts.push("また会える日を楽しみにしています。");

  const letter = `${salutation}\n\n${bodyParts.join("\n\n")}\n\n心を込めて`;

  return letter;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feelings, recipient, occasion } = body as {
      feelings: string;
      recipient: Recipient;
      occasion: Occasion;
    };

    if (!feelings || !feelings.trim()) {
      return NextResponse.json(
        { error: "気持ちを入力してください" },
        { status: 400 }
      );
    }

    if (!recipientLabels[recipient]) {
      return NextResponse.json(
        { error: "宛先を選択してください" },
        { status: 400 }
      );
    }

    // Simulate a brief delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    const letter = generateLetter(feelings, recipient, occasion);

    return NextResponse.json({ letter });
  } catch {
    return NextResponse.json(
      { error: "手紙の生成に失敗しました" },
      { status: 500 }
    );
  }
}
