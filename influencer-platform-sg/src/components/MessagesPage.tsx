"use client";

import { useState, useEffect, useRef } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Send, Search, Paperclip, MoreVertical, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { useSSE } from "@/lib/useSSE";

interface Message {
  id: string;
  senderId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

interface Conversation {
  id: string;
  participant: { id: string; name: string; company?: string; role: string };
  campaignTitle?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export default function MessagesPage({ role }: { role: "brand" | "creator" }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
    loadCurrentUser();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConv?.messages]);

  const loadCurrentUser = async () => {
    try {
      const user = (await api.auth.me()) as { id: string };
      setCurrentUserId(user.id);
    } catch {
      // not logged in
    }
  };

  const loadConversations = async () => {
    try {
      const res = (await api.messages.list()) as { data: Conversation[] };
      setConversations(res.data);
      if (res.data.length > 0 && !selectedConv) {
        setSelectedConv(res.data[0]);
      }
    } catch {
      // use empty state
    } finally {
      setLoading(false);
    }
  };

  useSSE((msg) => {
    if (msg.type === "new_message") {
      loadConversations();
    }
  });

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConv || sending) return;
    setSending(true);

    try {
      await api.messages.send({
        recipientId: selectedConv.participant.id,
        content: newMessage.trim(),
        campaignTitle: selectedConv.campaignTitle,
      });
      setNewMessage("");
      await loadConversations();
      const updated = conversations.find((c) => c.id === selectedConv.id);
      if (updated) setSelectedConv(updated);
      else await loadConversations();
    } catch {
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filtered = conversations.filter(
    (c) =>
      searchQuery === "" ||
      c.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.campaignTitle && c.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-surface">
        <DashboardSidebar role={role} />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role={role} />

      <main className="flex-1 flex">
        <div className="w-80 bg-white border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-lg mb-3">Messages</h2>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-border text-sm outline-none focus:border-primary" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="p-6 text-center text-sm text-gray-500">
                No conversations yet. Start by messaging a {role === "brand" ? "creator" : "brand"}.
              </div>
            )}
            {filtered.map((conv) => (
              <button key={conv.id} onClick={() => setSelectedConv(conv)}
                className={`w-full p-4 text-left border-b border-border hover:bg-surface transition-colors ${
                  selectedConv?.id === conv.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                }`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {conv.participant.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">{conv.participant.company || conv.participant.name}</span>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(conv.lastMessageTime).toLocaleDateString("en-SG", { month: "short", day: "numeric" })}
                      </span>
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

        <div className="flex-1 flex flex-col bg-white">
          {selectedConv ? (
            <>
              <div className="h-16 px-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {selectedConv.participant.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{selectedConv.participant.company || selectedConv.participant.name}</div>
                    {selectedConv.campaignTitle && (
                      <div className="text-xs text-gray-500">{selectedConv.campaignTitle}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedConv.messages.map((message) => {
                  const isMe = message.senderId === currentUserId;
                  return (
                    <div key={message.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`flex items-end gap-2 max-w-[70%] ${isMe ? "flex-row-reverse" : ""}`}>
                        {!isMe && (
                          <div className="w-7 h-7 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {selectedConv.participant.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMe ? "gradient-bg text-white rounded-br-md" : "bg-surface text-gray-800 rounded-bl-md"
                          }`}>
                            {message.content}
                          </div>
                          <div className={`text-xs text-gray-400 mt-1 ${isMe ? "text-right" : "text-left"}`}>
                            {new Date(message.createdAt).toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary" />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="p-2.5 gradient-bg rounded-xl hover:opacity-90 disabled:opacity-50"
                  >
                    {sending ? <Loader2 size={18} className="text-white animate-spin" /> : <Send size={18} className="text-white" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">💬</div>
                <div className="text-sm">Select a conversation or start a new one</div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
