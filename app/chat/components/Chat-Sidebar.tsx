'use client'

import Image from 'next/image';
import { PaperClipIcon } from "@heroicons/react/24/solid";
import { Send } from 'lucide-react';
import { useEffect, useMemo, useState, ChangeEvent } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { format } from 'date-fns';
import { formatDistanceToNow } from 'date-fns';

type Message = {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  created_at: string;
  type: 'text' | 'image' | 'attachment' | 'link';
  metadata?: {
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
  };
};

type Presence = {
  user_id: string;
  last_seen_at: string;
  online: boolean;
};

export default function ChatSidebar() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [presence, setPresence] = useState<Presence | null>(null);
  const senderId = "user_123";  
  const receiverId = "oliver_elijah"; 

  const formatMessageTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  useEffect(() => {
    const updatePresence = async () => {
      await supabase
        .from('presence')
        .upsert({
          user_id: senderId,
          last_seen_at: new Date().toISOString(),
          online: true
        })
        .select()
        .single();
    };

    updatePresence();
    const interval = setInterval(updatePresence, 30000);

    return () => {
      clearInterval(interval);
      supabase
        .from('presence')
        .upsert({
          user_id: senderId,
          last_seen_at: new Date().toISOString(),
          online: false
        });
    };
  }, [senderId, supabase]);

  useEffect(() => {
    const presenceChannel = supabase
      .channel('realtime:presence')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'presence',
          filter: `user_id=eq.${receiverId}`
        },
        (payload) => {
          setPresence(payload.new as Presence);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [receiverId, supabase]);

  useEffect(() => {
    const fetchPresence = async () => {
      const { data, error } = await supabase
        .from('presence')
        .select('*')
        .eq('user_id', receiverId)
        .single();

      if (!error) {
        setPresence(data);
      }
    };

    fetchPresence();
  }, [receiverId, supabase]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(
            `and(sender.eq.${senderId},receiver.eq.${receiverId}),and(sender.eq.${receiverId},receiver.eq.${senderId})`
          )
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
        } else {
          setMessages(data || []);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel('realtime:messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const msg = payload.new as Message;
          if (
            (msg.sender === senderId && msg.receiver === receiverId) ||
            (msg.sender === receiverId && msg.receiver === senderId)
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [senderId, receiverId, supabase]);

  const handleAttachment = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
    e.target.value = '';
  };

  const sendMessage = async () => {
    if (isSending) return;
    if (!input.trim() && !selectedFile) return;

    setIsSending(true);

    try {
      let messageType: 'text' | 'image' | 'attachment' = 'text';
      let fileUrl = '';
      let contentToSend = input.trim();

      if (selectedFile) {
        const fileName = `${Date.now()}_${selectedFile.name}`;
        const fileType = selectedFile.type;

        const { error: uploadError } = await supabase.storage
          .from('chat-media')
          .upload(fileName, selectedFile);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          alert('File upload failed');
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('chat-media')
          .getPublicUrl(fileName);

        fileUrl = publicUrlData?.publicUrl || '';

        if (fileType.startsWith('image')) {
          messageType = 'image';
          contentToSend = contentToSend || 'Image message';
        } else {
          messageType = 'attachment';
          contentToSend = contentToSend || selectedFile.name;
        }
      }

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender: senderId,
          receiver: receiverId,
          content: contentToSend,
          type: messageType,
          metadata: fileUrl ? { 
            fileUrl,
            fileName: selectedFile?.name,
            fileType: selectedFile?.type
          } : null
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setMessages((prev) => [...prev, data]);
        setInput('');
        setSelectedFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMessageContent = (msg: Message) => {
    switch (msg.type) {
      case 'image':
        return (
          <div className="mt-1">
            <Image 
              src={msg.metadata?.fileUrl ?? '/image-error-placeholder.png'} 
              alt="Sent image" 
              className="max-w-[200px] max-h-[200px] rounded-lg object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/image-error-placeholder.png';
              }}
            />
            {msg.content && msg.content !== 'Image message' && (
              <p className="mt-2">{msg.content}</p>
            )}
          </div>
        );
      case 'attachment':
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
        return <p>{msg.content}</p>;
    }
  };

  const getStatusText = () => {
    if (!presence) return <span className="text-green-500">● Online</span>;
    
    if (presence.online) {
      return <span className="text-green-500">● Online</span>;
    } else if (presence.last_seen_at) {
      return `Last seen ${formatDistanceToNow(new Date(presence.last_seen_at))} ago`;
    }
    return 'Offline';
  };

  return (
    <div className="flex flex-col h-full w-full bg-black rounded-2xl shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800">
        <div className="text-sm text-gray-400">{getStatusText()}</div>
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">Oliver Elijah</span>
          <span className="text-green-500 text-sm">● Completed</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
        {messages.map((msg) => {
          const isSender = msg.sender === senderId;
          const avatarUrl = isSender 
            ? "https://i.pravatar.cc/40?img=2" 
            : "https://i.pravatar.cc/40?img=1";

          return (
            <div 
              key={msg.id} 
              className={`flex items-start gap-2 ${isSender ? 'justify-end' : ''}`}
            >
              {!isSender && (
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-6 h-6 rounded-full"
                />
              )}
              <div 
                className={`text-sm px-3 py-2 rounded-xl max-w-[70%] ${
                  isSender 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-neutral-800 text-white'
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
                  className="w-6 h-6 rounded-full"
                />
              )}
            </div>
          );
        })}
      </div>

      {previewUrl && selectedFile && (
        <div className="px-4 py-2 border-t border-gray-800 bg-neutral-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedFile.type.startsWith('image') ? (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  className="h-10 w-10 rounded object-cover"
                />
              ) : (
                <div className="h-10 w-10 bg-gray-700 rounded flex items-center justify-center">
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
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-gray-800 px-4 py-3">
        <div className="flex items-center gap-2 border border-white/20 bg-neutral-900 rounded-full px-3 py-2">
          <label className="cursor-pointer text-gray-400 hover:text-gray-200">
            <PaperClipIcon className="w-6 h-6 text-gray-500" />
            <input
              type="file"
              className="hidden"
              onChange={handleAttachment}
              accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
            />
          </label>

          <button className="p-2 rounded-full hover:bg-gray-100">
            <Image
              src="/GoogleMeet.png"
              alt="Google Meet"
              className="w-6 h-6"
            />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Start Conversation"
            className="flex-1 bg-transparent text-white text-sm px-3 py-2 outline-none"
          />

          <button 
            onClick={sendMessage}
            disabled={isSending}
            className="p-2 bg-gray-600 rounded-full hover:bg-gray-700 disabled:opacity-50"
          >
            <Send className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}