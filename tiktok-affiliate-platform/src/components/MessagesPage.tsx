"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Send, Search, Paperclip, MoreVertical, Phone, Video as VideoIcon } from "lucide-react";
import { mockConversations, Conversation } from "@/lib/mock-messages";

export default function MessagesPage({ role }: { role: "advertiser" | "affiliate" }) {
  const [selectedConv, setSelectedConv] = useState<Conversation>(mockConversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const currentUserId = role === "affiliate" ? "u-001" : "adv-001";

  const filteredConversations = mockConversations.filter(
    (c) =>
      searchQuery === "" ||
      c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.campaignTitle && c.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role={role} />

      <main className="flex-1 flex">
        {/* Conversation List */}
        <div className="w-80 bg-white border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-lg mb-3">メッセージ</h2>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="検索..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-border text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={`w-full p-4 text-left border-b border-border hover:bg-surface transition-colors ${
                  selectedConv.id === conv.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {conv.participantAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">{conv.participantName}</span>
                      <span className="text-xs text-gray-400 flex-shrink-0">{conv.lastMessageTime}</span>
                    </div>
                    {conv.campaignTitle && (
                      <div className="text-xs text-primary truncate">{conv.campaignTitle}</div>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500 truncate">{conv.lastMessage}</span>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 gradient-bg rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="h-16 px-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                {selectedConv.participantAvatar}
              </div>
              <div>
                <div className="font-medium text-sm">{selectedConv.participantName}</div>
                {selectedConv.campaignTitle && (
                  <div className="text-xs text-gray-500">{selectedConv.campaignTitle}</div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-surface rounded-lg transition-colors">
                <Phone size={18} className="text-gray-400" />
              </button>
              <button className="p-2 hover:bg-surface rounded-lg transition-colors">
                <VideoIcon size={18} className="text-gray-400" />
              </button>
              <button className="p-2 hover:bg-surface rounded-lg transition-colors">
                <MoreVertical size={18} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {selectedConv.messages.map((message) => {
              const isMe =
                (role === "affiliate" && message.senderRole === "affiliate") ||
                (role === "advertiser" && message.senderRole === "advertiser");

              return (
                <div key={message.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-end gap-2 max-w-[70%] ${isMe ? "flex-row-reverse" : ""}`}>
                    {!isMe && (
                      <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {message.senderAvatar}
                      </div>
                    )}
                    <div>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isMe
                            ? "gradient-bg text-white rounded-br-md"
                            : "bg-surface text-gray-800 rounded-bl-md"
                        }`}
                      >
                        {message.content}
                      </div>
                      <div className={`text-xs text-gray-400 mt-1 ${isMe ? "text-right" : "text-left"}`}>
                        {message.timestamp.split(" ")[1]}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-surface rounded-lg transition-colors">
                <Paperclip size={20} className="text-gray-400" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="メッセージを入力..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newMessage.trim()) {
                    setNewMessage("");
                  }
                }}
              />
              <button
                className="p-2.5 gradient-bg rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                disabled={!newMessage.trim()}
              >
                <Send size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
