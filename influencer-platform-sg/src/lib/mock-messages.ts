export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: "brand" | "creator";
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  participantRole: "brand" | "creator";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  campaignTitle?: string;
  messages: Message[];
}

export const mockConversations: Conversation[] = [
  {
    id: "conv-01",
    participantName: "Glow Skincare Co.",
    participantAvatar: "G",
    participantRole: "brand",
    lastMessage: "We've shortlisted you for the campaign! Looking forward to working together.",
    lastMessageTime: "14:32",
    unreadCount: 2,
    campaignTitle: "New Vitamin C Serum Launch",
    messages: [
      { id: "m1", senderId: "b1", senderName: "Glow Skincare Co.", senderAvatar: "G", senderRole: "brand", content: "Hi Shermaine! Thanks for your application.", timestamp: "10:00", read: true },
      { id: "m2", senderId: "c1", senderName: "@shermaine.sg", senderAvatar: "S", senderRole: "creator", content: "Hi! Thanks for reaching out. Excited to potentially work together.", timestamp: "10:15", read: true },
      { id: "m3", senderId: "b1", senderName: "Glow Skincare Co.", senderAvatar: "G", senderRole: "brand", content: "We loved your Instagram content. Could you share some previous skincare reviews?", timestamp: "11:30", read: true },
      { id: "m4", senderId: "c1", senderName: "@shermaine.sg", senderAvatar: "S", senderRole: "creator", content: "Sure, sending links shortly!", timestamp: "12:00", read: true },
      { id: "m5", senderId: "b1", senderName: "Glow Skincare Co.", senderAvatar: "G", senderRole: "brand", content: "Perfect, these look great.", timestamp: "13:20", read: true },
      { id: "m6", senderId: "b1", senderName: "Glow Skincare Co.", senderAvatar: "G", senderRole: "brand", content: "We've shortlisted you for the campaign! Looking forward to working together.", timestamp: "14:32", read: false },
    ],
  },
  {
    id: "conv-02",
    participantName: "Hawker Heritage",
    participantAvatar: "H",
    participantRole: "brand",
    lastMessage: "Here's the stall list for next week.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    campaignTitle: "Hawker Heritage Campaign",
    messages: [
      { id: "m10", senderId: "b2", senderName: "Hawker Heritage", senderAvatar: "H", senderRole: "brand", content: "Campaign kickoff this Friday at 10am!", timestamp: "Apr 8", read: true },
      { id: "m11", senderId: "b2", senderName: "Hawker Heritage", senderAvatar: "H", senderRole: "brand", content: "Here's the stall list for next week.", timestamp: "Apr 10", read: true },
    ],
  },
  {
    id: "conv-03",
    participantName: "TechWave SG",
    participantAvatar: "T",
    participantRole: "brand",
    lastMessage: "Phone will arrive tomorrow. Excited for your review!",
    lastMessageTime: "2d ago",
    unreadCount: 1,
    campaignTitle: "TechWave Pro 15 Review",
    messages: [
      { id: "m20", senderId: "b3", senderName: "TechWave SG", senderAvatar: "T", senderRole: "brand", content: "Phone will arrive tomorrow. Excited for your review!", timestamp: "Apr 5", read: false },
    ],
  },
];
