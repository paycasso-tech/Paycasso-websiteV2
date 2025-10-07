"use client";

import Image from "next/image";
import { PaperClipIcon } from "@heroicons/react/24/solid";
import { Send, X, Phone, Video } from "lucide-react";
import { useEffect, useMemo, useState, ChangeEvent } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { format, formatDistanceToNow } from "date-fns";
import { Message, Presence, ChatSidebarProps } from "./types";
import VideoCallModal from "./VideoCallModal";

export default function ChatSidebar({
  contractId,
  counterpartyId,
  counterpartyName,
  onClose,
}: ChatSidebarProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [presence, setPresence] = useState<Presence | null>(null);
  const [senderId, setSenderId] = useState<string>("");
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [audioOnly, setAudioOnly] = useState(false);

  // Generate unique room name based on contract
  const roomName = useMemo(() => {
    return `paycasso-escrow-${contractId || "chat"}-${Date.now()}`;
  }, [contractId]);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setSenderId(user.id);
      }
    };
    getCurrentUser();
  }, [supabase]);

  const formatMessageTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a");
  };

  // Update presence
  useEffect(() => {
    if (!senderId) return;

    const updatePresence = async () => {
      await supabase
        .from("presence")
        .upsert({
          user_id: senderId,
          last_seen_at: new Date().toISOString(),
          online: true,
        })
        .select()
        .single();
    };

    updatePresence();
    const interval = setInterval(updatePresence, 30000);

    return () => {
      clearInterval(interval);
      supabase.from("presence").upsert({
        user_id: senderId,
        last_seen_at: new Date().toISOString(),
        online: false,
      });
    };
  }, [senderId, supabase]);

  // Subscribe to counterparty presence
  useEffect(() => {
    const presenceChannel = supabase
      .channel("realtime:presence")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "presence",
          filter: `user_id=eq.${counterpartyId}`,
        },
        (payload) => {
          setPresence(payload.new as Presence);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [counterpartyId, supabase]);

  // Fetch initial presence
  useEffect(() => {
    const fetchPresence = async () => {
      const { data, error } = await supabase
        .from("presence")
        .select("*")
        .eq("user_id", counterpartyId)
        .single();

      if (!error) {
        setPresence(data);
      }
    };

    fetchPresence();
  }, [counterpartyId, supabase]);

  // Fetch messages
  useEffect(() => {
    if (!senderId) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(
            `and(sender.eq.${senderId},receiver.eq.${counterpartyId}),and(sender.eq.${counterpartyId},receiver.eq.${senderId})`
          )
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error fetching messages:", error);
        } else {
          setMessages(data || []);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel("realtime:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const msg = payload.new as Message;
          if (
            (msg.sender === senderId && msg.receiver === counterpartyId) ||
            (msg.sender === counterpartyId && msg.receiver === senderId)
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [senderId, counterpartyId, supabase]);

  const handleAttachment = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
    e.target.value = "";
  };

  const sendMessage = async () => {
    if (isSending) return;
    if (!input.trim() && !selectedFile) return;

    setIsSending(true);

    try {
      let messageType: "text" | "image" | "attachment" = "text";
      let fileUrl = "";
      let contentToSend = input.trim();

      if (selectedFile) {
        const fileName = `${Date.now()}_${selectedFile.name}`;
        const fileType = selectedFile.type;

        const { error: uploadError } = await supabase.storage
          .from("chat-media")
          .upload(fileName, selectedFile);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          alert("File upload failed");
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("chat-media")
          .getPublicUrl(fileName);

        fileUrl = publicUrlData?.publicUrl || "";

        if (fileType.startsWith("image")) {
          messageType = "image";
          contentToSend = contentToSend || "Image message";
        } else {
          messageType = "attachment";
          contentToSend = contentToSend || selectedFile.name;
        }
      }

      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender: senderId,
          receiver: counterpartyId,
          content: contentToSend,
          type: messageType,
          metadata: fileUrl
            ? {
                fileUrl,
                fileName: selectedFile?.name,
                fileType: selectedFile?.type,
              }
            : null,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setMessages((prev) => [...prev, data]);
        setInput("");
        setSelectedFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleVideoCall = () => {
    setAudioOnly(false);
    setShowVideoCall(true);
  };

  const handleVoiceCall = () => {
    setAudioOnly(true);
    setShowVideoCall(true);
  };

  const renderMessageContent = (msg: Message) => {
    switch (msg.type) {
      case "image":
        return (
          <div className="mt-1">
            <Image
              src={msg.metadata?.fileUrl ?? "/placeholder.png"}
              alt="Sent image"
              width={200}
              height={200}
              className="max-w-[200px] max-h-[200px] rounded-lg object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.png";
              }}
            />
            {msg.content && msg.content !== "Image message" && (
              <p className="mt-2">{msg.content}</p>
            )}
          </div>
        );
      case "attachment":
        return (
          <div className="mt-1">
            <a
              href={msg.metadata?.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 hover:underline"
            >
              <PaperClipIcon className="w-4 h-4" />
              {msg.content || msg.metadata?.fileName}
            </a>
          </div>
        );
      default:
        return <p className="break-words">{msg.content}</p>;
    }
  };

  const getStatusText = () => {
    if (!presence) return <span className="text-green-500">● Online</span>;

    if (presence.online) {
      return <span className="text-green-500">● Online</span>;
    } else if (presence.last_seen_at) {
      return `Last seen ${formatDistanceToNow(new Date(presence.last_seen_at), {
        addSuffix: true,
      })}`;
    }
    return "Offline";
  };

  

  return (
    <>
      <div className="flex flex-col h-full w-full bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-white/[0.02] backdrop-blur-2xl backdrop-saturate-150 border border-white/20 rounded-[36px] shadow-2xl overflow-hidden">
        {/* Enhanced Glass Layers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[36px]">
          <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/[0.15] via-white/[0.05] to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
        </div>
        <div className="absolute inset-0 rounded-[36px] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)]"></div>

        {/* Header with Video/Voice Buttons */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="text-sm text-gray-400">{getStatusText()}</div>
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold">{counterpartyName}</span>

            {/* Video/Voice Call Buttons */}
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={handleVoiceCall}
                className="p-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-xl transition-all"
                title="Voice Call"
              >
                <Phone className="w-4 h-4 text-green-400" />
              </button>
              <button
                onClick={handleVideoCall}
                className="p-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl transition-all"
                title="Video Call"
              >
                <Video className="w-4 h-4 text-blue-400" />
              </button>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="ml-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4 apple-scrollbar">
          {messages.map((msg) => {
            const isSender = msg.sender === senderId;
            const avatarUrl = isSender
              ? "https://i.pravatar.cc/40?img=2"
              : "https://i.pravatar.cc/40?img=1";

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${
                  isSender ? "justify-end" : ""
                }`}
              >
                {!isSender && (
                  <Image
                    src={avatarUrl}
                    alt="Avatar"
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full"
                  />
                )}
                <div
                  className={`text-sm px-4 py-3 rounded-2xl max-w-[70%] ${
                    isSender
                      ? "bg-indigo-600 text-white"
                      : "bg-white/10 backdrop-blur-md text-white"
                  }`}
                >
                  {renderMessageContent(msg)}
                  <div className="text-xs mt-1 text-gray-300 text-right">
                    {formatMessageTime(msg.created_at)}
                  </div>
                </div>
                {isSender && (
                  <Image
                    src={avatarUrl}
                    alt="Avatar"
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* File Preview */}
        {previewUrl && selectedFile && (
          <div className="relative z-10 px-6 py-3 border-t border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedFile.type.startsWith("image") ? (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 bg-white/10 rounded flex items-center justify-center">
                    <PaperClipIcon className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="text-sm text-white truncate max-w-[180px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                }}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="relative z-10 border-t border-white/10 px-6 py-4">
          <div className="flex items-center gap-3 border border-white/20 bg-white/5 backdrop-blur-md rounded-full px-4 py-2">
            <label className="cursor-pointer text-gray-400 hover:text-gray-200">
              <PaperClipIcon className="w-5 h-5" />
              <input
                type="file"
                className="hidden"
                onChange={handleAttachment}
                accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
              />
            </label>

            {/* <Image
              src="https://i.pravatar.cc/40?img=3"
              alt="Emoji"
              width={20}
              height={20}
              className="w-5 h-5 cursor-pointer"
            /> */}

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Start Conversation"
              className="flex-1 bg-transparent text-white text-sm px-2 py-1 outline-none placeholder-gray-500"
            />

            <button
              onClick={sendMessage}
              disabled={isSending}
              className="p-2 bg-white rounded-full hover:bg-gray-200 disabled:opacity-50 transition-all"
            >
              <Send className="h-4 w-4 text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Call Modal */}
      {showVideoCall && (
        <VideoCallModal
          roomName={roomName}
          displayName={counterpartyName}
          onClose={() => setShowVideoCall(false)}
          audioOnly={audioOnly}
        />
      )}
    </>
  );
}
