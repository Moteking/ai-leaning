export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: "advertiser" | "affiliate" | "system";
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: "advertiser" | "affiliate";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  campaignTitle?: string;
  messages: Message[];
}

export const mockConversations: Conversation[] = [
  {
    id: "conv-001",
    participantId: "adv-001",
    participantName: "グロウコスメ株式会社",
    participantAvatar: "G",
    participantRole: "advertiser",
    lastMessage: "商品サンプルを本日発送しましたので、到着をお待ちください。",
    lastMessageTime: "14:30",
    unreadCount: 2,
    campaignTitle: "新作リップティント プロモーション",
    messages: [
      {
        id: "m-001",
        senderId: "adv-001",
        senderName: "グロウコスメ株式会社",
        senderAvatar: "G",
        senderRole: "advertiser",
        content: "@beauty_mika さん、この度はキャンペーンへのご応募ありがとうございます！ぜひご一緒させてください。",
        timestamp: "2026-03-28 10:00",
        read: true,
      },
      {
        id: "m-002",
        senderId: "u-001",
        senderName: "@beauty_mika",
        senderAvatar: "M",
        senderRole: "affiliate",
        content: "ありがとうございます！新作リップティント、とても楽しみです。商品の発送はいつ頃になりますか？",
        timestamp: "2026-03-28 10:15",
        read: true,
      },
      {
        id: "m-003",
        senderId: "adv-001",
        senderName: "グロウコスメ株式会社",
        senderAvatar: "G",
        senderRole: "advertiser",
        content: "明日中に発送予定です。カラーは春色コレクション全5色をお送りしますので、お好きなカラーでレビューをお願いします。",
        timestamp: "2026-03-28 11:30",
        read: true,
      },
      {
        id: "m-004",
        senderId: "u-001",
        senderName: "@beauty_mika",
        senderAvatar: "M",
        senderRole: "affiliate",
        content: "全色レビューできるのは嬉しいです！比較動画も作れそうですね。投稿のガイドラインなどはありますか？",
        timestamp: "2026-03-28 12:00",
        read: true,
      },
      {
        id: "m-005",
        senderId: "adv-001",
        senderName: "グロウコスメ株式会社",
        senderAvatar: "G",
        senderRole: "advertiser",
        content: "ガイドラインをPDFでお送りします。基本的に自由に制作いただいてOKです。ハッシュタグ #グロウリップ と #PR を必ずつけてください。",
        timestamp: "2026-03-29 09:00",
        read: true,
      },
      {
        id: "m-006",
        senderId: "adv-001",
        senderName: "グロウコスメ株式会社",
        senderAvatar: "G",
        senderRole: "advertiser",
        content: "商品サンプルを本日発送しましたので、到着をお待ちください。",
        timestamp: "2026-03-30 14:30",
        read: false,
      },
    ],
  },
  {
    id: "conv-002",
    participantId: "adv-002",
    participantName: "テックサウンド株式会社",
    participantAvatar: "T",
    participantRole: "advertiser",
    lastMessage: "レビュー動画のクオリティ、とても素晴らしかったです！",
    lastMessageTime: "昨日",
    unreadCount: 0,
    campaignTitle: "ワイヤレスイヤホン レビューキャンペーン",
    messages: [
      {
        id: "m-007",
        senderId: "adv-002",
        senderName: "テックサウンド株式会社",
        senderAvatar: "T",
        senderRole: "advertiser",
        content: "こんにちは。ワイヤレスイヤホンのレビューキャンペーンにご応募いただきありがとうございます。",
        timestamp: "2026-03-29 10:00",
        read: true,
      },
      {
        id: "m-008",
        senderId: "u-001",
        senderName: "@beauty_mika",
        senderAvatar: "M",
        senderRole: "affiliate",
        content: "よろしくお願いします。ガジェットレビューも最近始めたので、ぜひ協力させてください。",
        timestamp: "2026-03-29 10:30",
        read: true,
      },
      {
        id: "m-009",
        senderId: "adv-002",
        senderName: "テックサウンド株式会社",
        senderAvatar: "T",
        senderRole: "advertiser",
        content: "レビュー動画のクオリティ、とても素晴らしかったです！",
        timestamp: "2026-04-02 16:00",
        read: true,
      },
    ],
  },
  {
    id: "conv-003",
    participantId: "adv-003",
    participantName: "ナチュラルビューティー株式会社",
    participantAvatar: "N",
    participantRole: "advertiser",
    lastMessage: "次のキャンペーンもぜひご参加いただければ嬉しいです。",
    lastMessageTime: "3/25",
    unreadCount: 1,
    campaignTitle: "オーガニックシャンプー レビュー",
    messages: [
      {
        id: "m-010",
        senderId: "adv-003",
        senderName: "ナチュラルビューティー株式会社",
        senderAvatar: "N",
        senderRole: "advertiser",
        content: "前回のキャンペーンではお世話になりました。おかげさまで売上が大幅にアップしました。",
        timestamp: "2026-03-25 11:00",
        read: true,
      },
      {
        id: "m-011",
        senderId: "adv-003",
        senderName: "ナチュラルビューティー株式会社",
        senderAvatar: "N",
        senderRole: "advertiser",
        content: "次のキャンペーンもぜひご参加いただければ嬉しいです。",
        timestamp: "2026-03-25 11:05",
        read: false,
      },
    ],
  },
];
