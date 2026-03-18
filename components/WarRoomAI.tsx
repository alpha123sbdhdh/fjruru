import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Smile, Plus, Search, X, Trash2, Check, Pin, Bell, Volume2, MessageSquare, ArrowRight, BellOff, Link as LinkIcon, Edit2, Crown, Mic, Paperclip, Menu, ArrowUp, AudioLines, LayoutGrid, Pause, StopCircle, Play, Lock, Reply, ArrowDown, ShieldAlert, UserX, MicOff, AlertTriangle, ShieldCheck } from 'lucide-react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { supabase } from '../services/supabase';
import { encryptMessage, decryptMessage } from '../services/encryption';
import { ChatMessage } from '../types';
import VerifiedBadge from './VerifiedBadge';

const PRESET_EMOJIS = ['🔥', '💪', '🚀', '💀', '💯'];

interface ExtendedChatMessage extends ChatMessage {
  isPinned?: boolean;
  replies?: ExtendedChatMessage[];
  parentId?: string;
  isEdited?: boolean;
  senderId?: string;
  senderIsVerified?: boolean;
}

interface WarRoomAIProps {
  channelId?: string;
  channelName?: string;
  channelDescription?: string;
  initialMessages?: ExtendedChatMessage[];
  onMessagesUpdate?: (messages: ExtendedChatMessage[]) => void;
  onToggleMobileMenu?: () => void;
  onReadUpdate?: () => void;
  notifySettings?: { alerts: boolean; mentions: boolean; sound: boolean; muted: boolean };
  videoBackground?: string;
  channelType?: 'text' | 'voice' | 'announcement' | 'board' | 'video' | 'tasks' | 'catalog' | 'strategy-board' | 'dm' | 'group';
}

const WarRoomAI: React.FC<WarRoomAIProps> = ({ 
  channelId = 'ch-1',
  channelName = "Network Feed", 
  channelDescription = "2,453 members online",
  initialMessages,
  onMessagesUpdate,
  onReadUpdate,
  onToggleMobileMenu,
  notifySettings = { alerts: true, mentions: true, sound: false, muted: false },
  videoBackground,
  channelType = 'text'
}) => {
  const [localMessages, setLocalMessages] = useState<ExtendedChatMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [lastReadTimestamp, setLastReadTimestamp] = useState<number>(0);
  const [sessionStartLastRead, setSessionStartLastRead] = useState<number>(0);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [moderationStatus, setModerationStatus] = useState<{ isMuted: boolean, isKicked: boolean, warnings: any[] }>({ isMuted: false, isKicked: false, warnings: [] });
  const [selectedUserForMod, setSelectedUserForMod] = useState<{ id: string, username: string, avatar: string, role: string } | null>(null);
  const [showModModal, setShowModModal] = useState(false);
  const [modReason, setModReason] = useState('');

  const currentUserRef = useRef<any>(null);
  const processedMessageIds = useRef<Set<string>>(new Set());
  const messagesRef = useRef<ExtendedChatMessage[]>([]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    messagesRef.current = localMessages;
  }, [localMessages]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const sendNotification = (title: string, body: string) => {
    if (notifySettings.muted) return;

    const isMention = body.includes(`@${currentUserRef.current?.username}`);
    const shouldNotify = notifySettings.alerts || (notifySettings.mentions && isMention);

    if (!shouldNotify) return;

    if ((document.hidden || !document.hasFocus()) && Notification.permission === "granted") {
      new Notification(title, { body, icon: '/vite.svg' });
    }
    if (notifySettings.sound && !notifySettings.muted) {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.error("Audio play failed", e));
    }
  };
  
  // Use local messages if Supabase is active, otherwise fallback to props
  const messages = supabase ? localMessages : (initialMessages !== undefined ? initialMessages : localMessages);
  
  const onMessagesUpdateRef = useRef(onMessagesUpdate);

  useEffect(() => {
    onMessagesUpdateRef.current = onMessagesUpdate;
  }, [onMessagesUpdate]);

  const updateMessages = useCallback((newMessages: ExtendedChatMessage[] | ((prev: ExtendedChatMessage[]) => ExtendedChatMessage[])) => {
      if (onMessagesUpdateRef.current && !supabase) {
          // Only update parent if NOT using Supabase (legacy mode)
          if (typeof newMessages === 'function') {
             setLocalMessages(prev => {
                 const updated = newMessages(prev);
                 onMessagesUpdateRef.current!(updated);
                 return updated;
             });
          } else {
             onMessagesUpdateRef.current(newMessages);
             setLocalMessages(newMessages);
          }
      } else {
          setLocalMessages(newMessages);
      }
  }, []);

  useEffect(() => {
    // Fetch current user
    const initUser = async () => {
      let userStr = localStorage.getItem('user');
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      } else {
        // Default user if not logged in
        const defaultUser = { id: 'user-' + Date.now(), username: 'Recruit', avatar: 'https://ui-avatars.com/api/?name=Recruit&background=333&color=fff' };
        localStorage.setItem('user', JSON.stringify(defaultUser));
        setCurrentUser(defaultUser);
      }
    };
    initUser();

    // Fetch moderation status
    const fetchModStatus = async () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      try {
        const res = await fetch(`/api/moderation/status/${channelId}/${user.id}`);
        const data = await res.json();
        setModerationStatus(data);
      } catch (err) {
        console.error("Failed to fetch moderation status", err);
      }
    };
    fetchModStatus();

    // Initialize read state
    const saved = localStorage.getItem(`lastRead_${channelId}`);
    const ts = saved ? parseInt(saved) : 0;
    setLastReadTimestamp(ts);
    setSessionStartLastRead(ts);

    if (!supabase) return;

    // Fetch initial messages from Supabase
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('channel_id', channelId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data) {
          // First pass: decrypt texts
          const rawMessages = await Promise.all(
            data.map(async (msg: any) => {
              const decryptedText = await decryptMessage(channelId, msg.content);
              return { ...msg, decryptedText };
            })
          );

          // Create map for reply lookups
          const msgMap = new Map(rawMessages.map(m => [m.id, m]));

          const decryptedMessages: ExtendedChatMessage[] = rawMessages.map(msg => {
              let replyingTo = undefined;
              if (msg.reply_to_id) {
                  const parent = msgMap.get(msg.reply_to_id);
                  if (parent) {
                      replyingTo = {
                          id: parent.id,
                          senderName: parent.username,
                          text: parent.decryptedText,
                          senderAvatar: parent.avatar
                      };
                  }
              }

              return {
                id: msg.id,
                role: msg.role === 'ai' ? 'model' : 'user',
                text: msg.decryptedText,
                timestamp: new Date(msg.created_at),
                senderId: msg.user_id,
                senderName: msg.username,
                senderRole: msg.role === 'ai' ? 'General' : 'Recruit',
                senderAvatar: msg.avatar,
                senderIsVerified: msg.role === 'ai',
                reactions: [],
                replyingTo
              };
          });
          
          setLocalMessages(decryptedMessages);
        }
      } catch (err) {
        console.error("Failed to fetch messages from Supabase", err);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`room:${channelId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel_id=eq.${channelId}` }, async (payload) => {
        const msg = payload.new;
        if (processedMessageIds.current.has(msg.id)) return;
        
        const decryptedText = await decryptMessage(channelId, msg.content);
        
        let replyingTo = undefined;
        if (msg.reply_to_id) {
            const parent = messagesRef.current.find(m => m.id === msg.reply_to_id);
            if (parent) {
                replyingTo = {
                    id: parent.id,
                    senderName: parent.senderName,
                    text: parent.text,
                    senderAvatar: parent.senderAvatar
                };
            }
        }

        const newMessage: ExtendedChatMessage = {
            id: msg.id,
            role: msg.role === 'ai' ? 'model' : 'user',
            text: decryptedText,
            timestamp: new Date(msg.created_at),
            senderId: msg.user_id,
            senderName: msg.username,
            senderRole: msg.role === 'ai' ? 'General' : 'Recruit',
            senderAvatar: msg.avatar,
            senderIsVerified: msg.role === 'ai',
            reactions: [],
            replyingTo
        };
        
        setLocalMessages(prev => [...prev, newMessage]);

        // Mark as read immediately if at bottom
        if (shouldAutoScrollRef.current) {
          const ts = new Date(newMessage.timestamp).getTime();
          setLastReadTimestamp(prev => {
            if (ts > prev) {
              localStorage.setItem(`lastRead_${channelId}`, ts.toString());
              if (onReadUpdate) onReadUpdate();
              return ts;
            }
            return prev;
          });
        }

        // Send notification if not from me
        if (newMessage.senderName !== currentUserRef.current?.username) {
            sendNotification(`New message from ${newMessage.senderName}`, newMessage.text || 'Sent a file');
        }
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages', filter: `channel_id=eq.${channelId}` }, (payload) => {
          setLocalMessages(prev => prev.filter(m => m.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredReaction, setHoveredReaction] = useState<{ msgId: string, emoji: string } | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingToMessage, setReplyingToMessage] = useState<ExtendedChatMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [emojiPickerMessageId, setEmojiPickerMessageId] = useState<string | null>(null);

  const unreadCount = messages.filter(m => 
    m.senderName !== currentUser?.username && 
    new Date(m.timestamp).getTime() > lastReadTimestamp
  ).length;

  const handleDeleteClick = (msgId: string) => {
    setMessageToDelete(msgId);
  };

  const confirmDelete = async () => {
    if (messageToDelete) {
      if (supabase) {
          try {
              const { error } = await supabase.from('messages').delete().eq('id', messageToDelete);
              if (error) throw error;
              // Optimistic update handled by subscription or we can do it here too
          } catch (err) {
              console.error("Failed to delete message", err);
              alert("Failed to delete message");
          }
      } else {
          updateMessages(prev => prev.filter(m => m.id !== messageToDelete));
      }
      setMessageToDelete(null);
    }
  };

  // Unified Typing Indicators State
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<any>(null);

  // Voice Message State
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'paused' | 'recorded'>('idle');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        setIsAtBottom(true);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const atBottom = scrollHeight - scrollTop - clientHeight < 100;
      setIsAtBottom(atBottom);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    if (!scrollContainerRef.current || messages.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const timestamp = entry.target.getAttribute('data-timestamp');
            if (timestamp) {
              const ts = parseInt(timestamp);
              setLastReadTimestamp(prev => {
                if (ts > prev) {
                  localStorage.setItem(`lastRead_${channelId}`, ts.toString());
                  if (onReadUpdate) onReadUpdate();
                  return ts;
                }
                return prev;
              });
            }
          }
        });
      },
      { 
        threshold: 0.1, 
        root: scrollContainerRef.current,
        rootMargin: '0px 0px -5% 0px'
      }
    );

    const messageElements = scrollContainerRef.current.querySelectorAll('[data-msg-id]');
    messageElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [messages, channelId]);

  const scrollToMessage = (msgId: string) => {
    const el = document.getElementById(`msg-${msgId}`);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('bg-white/5');
        setTimeout(() => el.classList.remove('bg-white/5'), 1000);
    }
  };

  useEffect(() => {
     shouldAutoScrollRef.current = true;
     if (messages.length > 0) {
         scrollToBottom();
     }
  }, [channelName]);

  useEffect(() => {
    if (shouldAutoScrollRef.current && !searchQuery) {
      scrollToBottom();
    }
  }, [messages, searchQuery, isLoading]);
  
  useEffect(() => {
    if (replyingToMessage) {
        inputRef.current?.focus();
    }
  }, [replyingToMessage]);

  useEffect(() => {
    return () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
        }
        if (recordedAudioUrl) {
            URL.revokeObjectURL(recordedAudioUrl);
        }
    };
  }, [recordedAudioUrl]);

  const handleTyping = () => {
    if (!typingUsers.includes('Recruit')) {
        setTypingUsers(prev => [...prev, 'Recruit']);
    }
    
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u !== 'Recruit'));
    }, 2500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      if (val.length > 2000) return; // Character limit
      
      setInput(val);
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
      
      if (val.trim().length > 0) {
        handleTyping();
      } else {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        setTypingUsers(prev => prev.filter(u => u !== 'Recruit'));
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendText();
      }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const result = event.target?.result as string;
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');

        const mediaMessage: ExtendedChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: '',
            timestamp: new Date(),
            reactions: [],
            senderName: 'Recruit',
            senderRole: 'Recruit',
            senderAvatar: 'https://ui-avatars.com/api/?name=You&background=333&color=fff',
            senderIsVerified: false,
            imageUrl: isImage ? result : undefined,
            videoUrl: isVideo ? result : undefined,
        };

        updateMessages([...messages, mediaMessage]);
    };
    reader.readAsDataURL(file);
  };

  const handleSendText = async () => {
    if (!input.trim() || isLoading || !currentUser) return;
    if (moderationStatus.isMuted) {
      alert("You are muted in this channel.");
      return;
    }
    shouldAutoScrollRef.current = true;
    
    // Generate a UUID for the message to ensure consistency between local and server state
    const tempId = crypto.randomUUID();
    processedMessageIds.current.add(tempId);
    
    const userMessage: ExtendedChatMessage = {
      id: tempId,
      role: 'user',
      text: input,
      timestamp: new Date(),
      reactions: [],
      senderId: currentUser.id,
      senderName: currentUser.username,
      senderRole: 'Recruit',
      senderAvatar: currentUser.avatar,
      replyingTo: replyingToMessage ? {
        id: replyingToMessage.id,
        senderName: replyingToMessage.senderName || 'Unknown',
        text: replyingToMessage.text || 'Media message',
        senderAvatar: replyingToMessage.senderAvatar
      } : undefined,
    };

    // Optimistic update
    updateMessages(prev => [...prev, userMessage]);
    
    // Mark as read for self
    const ts = new Date(userMessage.timestamp).getTime();
    setLastReadTimestamp(prev => {
      if (ts > prev) {
        localStorage.setItem(`lastRead_${channelId}`, ts.toString());
        if (onReadUpdate) onReadUpdate();
        return ts;
      }
      return prev;
    });
    
    const messageText = input;
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    setReplyingToMessage(null);
    setIsLoading(true);

    try {
      // Encrypt and send to server
      const encryptedContent = await encryptMessage(channelId, messageText);
      
      if (supabase) {
          const { error } = await supabase.from('messages').insert({
              id: tempId, // Explicitly set the ID
              channel_id: channelId,
              user_id: currentUser.id,
              username: currentUser.username,
              avatar: currentUser.avatar,
              content: encryptedContent,
              role: 'user',
              created_at: new Date().toISOString(),
              reply_to_id: replyingToMessage?.id || null
          });
          
          if (error) throw error;
      } else {
          console.warn("Supabase not configured, message not sent to backend.");
      }

    } catch (error) {
      console.error('Error:', error);
      // Optionally remove the optimistic message on error
      updateMessages(prev => prev.filter(m => m.id !== tempId));
      alert("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  // Voice Functionality
  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = event => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setRecordedAudioUrl(audioUrl);
            setRecordingState('recorded');
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setRecordingState('recording');
        setRecordingDuration(0);
        
        recordingTimerRef.current = window.setInterval(() => {
            setRecordingDuration(prev => prev + 1);
        }, 1000);

    } catch (err) {
        console.error("Microphone access denied:", err);
        alert("Microphone access required for tactical briefings.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.pause();
        setRecordingState('paused');
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
        mediaRecorderRef.current.resume();
        setRecordingState('recording');
        recordingTimerRef.current = window.setInterval(() => {
            setRecordingDuration(prev => prev + 1);
        }, 1000);
    }
  };

  const discardRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
    
    setRecordingState('idle');
    setRecordingDuration(0);
    setRecordedAudioUrl(null);
    audioChunksRef.current = [];
  };

  const sendRecording = () => {
    if (!recordedAudioUrl) return;
    const voiceMessage: ExtendedChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: '',
        audioUrl: recordedAudioUrl,
        timestamp: new Date(),
        reactions: [],
        senderName: 'Recruit',
        senderRole: 'Recruit',
        senderAvatar: 'https://ui-avatars.com/api/?name=You&background=333&color=fff',
    };
    updateMessages([...messages, voiceMessage]);
    
    setRecordingState('idle');
    setRecordingDuration(0);
    setRecordedAudioUrl(null);
    audioChunksRef.current = [];
    setReplyingToMessage(null);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleReaction = (msgId: string, emoji: string) => {
    const newMessages = messages.map(msg => {
      if (msg.id === msgId) {
        const existing = msg.reactions?.find(r => r.emoji === emoji);
        let newReactions = msg.reactions || [];
        if (existing) {
          if (existing.userReacted) {
             newReactions = newReactions.map(r => r.emoji === emoji ? { ...r, count: r.count - 1, userReacted: false } : r).filter(r => r.count > 0);
          } else {
             newReactions = newReactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1, userReacted: true } : r);
          }
        } else {
          newReactions = [...newReactions, { emoji, count: 1, userReacted: true }];
        }
        return { ...msg, reactions: newReactions };
      }
      return msg;
    });
    updateMessages(newMessages);
  };

  const isAdmin = currentUser && ['Admin', 'General', 'Officer'].includes(currentUser.role);

  const handleUserClick = (user: { id: string, username: string, avatar: string, role: string }) => {
    if (!isAdmin || user.id === currentUser.id) return;
    setSelectedUserForMod(user);
    setShowModModal(true);
  };

  const handleMute = async (duration?: string) => {
    if (!selectedUserForMod || !currentUser) return;
    try {
      const expiresAt = duration ? new Date(Date.now() + parseInt(duration) * 60000).toISOString() : null;
      await fetch('/api/admin/mute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: currentUser.id,
          userId: selectedUserForMod.id,
          channelId,
          expiresAt
        })
      });
      alert(`User ${selectedUserForMod.username} muted.`);
      setShowModModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleKick = async () => {
    if (!selectedUserForMod || !currentUser) return;
    if (!confirm(`Are you sure you want to kick ${selectedUserForMod.username} from this channel?`)) return;
    try {
      await fetch('/api/admin/kick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: currentUser.id,
          userId: selectedUserForMod.id,
          channelId
        })
      });
      alert(`User ${selectedUserForMod.username} kicked.`);
      setShowModModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWarn = async () => {
    if (!selectedUserForMod || !currentUser || !modReason.trim()) return;
    try {
      await fetch('/api/admin/warn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: currentUser.id,
          userId: selectedUserForMod.id,
          reason: modReason
        })
      });
      alert(`Warning issued to ${selectedUserForMod.username}.`);
      setModReason('');
      setShowModModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (moderationStatus.isKicked) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#09090b] text-center p-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <UserX size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">Access Revoked</h2>
        <p className="text-gray-400 max-w-md">You have been kicked from this channel by an administrator for rule violations.</p>
        <button onClick={onToggleMobileMenu} className="mt-8 px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors uppercase text-sm tracking-widest">Return to Base</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#09090b] relative overflow-hidden">
      
      {videoBackground && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video 
            src={videoBackground} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#09090b] via-[#09090b]/40 to-[#09090b]"></div>
        </div>
      )}

      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,video/*" className="hidden" />

      {/* Header */}
      <div className="h-[60px] flex items-center justify-between px-4 md:px-6 shrink-0 border-b border-white/5 bg-[#18181b]/80 backdrop-blur-md shadow-sm relative z-20">
          <div className="flex items-center gap-4 min-w-0">
              <button onClick={onToggleMobileMenu} className="md:hidden text-gray-400 hover:text-white transition-colors p-1 shrink-0">
                <LayoutGrid size={24} />
              </button>
              <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {channelType === 'dm' && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>}
                    <h2 className="text-white font-bold text-base tracking-wide uppercase truncate">{channelName}</h2>
                    <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider" title="End-to-End Encrypted">
                      <Lock size={10} />
                      <span>E2EE</span>
                    </div>
                  </div>
                  <div className="h-[18px] flex items-center">
                    {typingUsers.length > 0 ? (
                        <span className="text-[#D4AF37] font-semibold text-[11px] flex items-center gap-1.5 animate-fade-in-up transition-all whitespace-nowrap overflow-hidden">
                             <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse-fast shrink-0"></span>
                             <span className="truncate">
                                {typingUsers.length > 1 ? `${typingUsers[0]} and ${typingUsers.length - 1} more are typing...` : `${typingUsers[0]} is typing...`}
                             </span>
                        </span>
                    ) : (
                        <p className="text-[12px] text-gray-400 truncate animate-fade-in-up">
                            {channelType === 'dm' ? 'Secure Direct Line' : channelType === 'group' ? 'Tactical Group Comms' : channelDescription}
                        </p>
                    )}
                  </div>
              </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
             {isSearchOpen ? (
                 <div className="flex items-center bg-[#27272a] rounded-full px-3 py-1.5 animate-fade-in-up">
                    <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="bg-transparent border-none outline-none text-sm text-white w-24 md:w-40 placeholder-gray-500"/>
                    <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="ml-2 text-gray-500 hover:text-white"><X size={14} /></button>
                 </div>
             ) : (
                 <button onClick={() => setIsSearchOpen(true)} className="text-gray-400 hover:text-white transition-colors"><Search size={20} /></button>
             )}
          </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 px-4 md:px-8 lg:px-16 py-4 space-y-6 relative overflow-x-hidden">
        {messages.filter(m => (m.text || '').toLowerCase().includes(searchQuery.toLowerCase())).map((msg, index, filteredMessages) => {
            const isMe = msg.role === 'user';
            const msgTs = new Date(msg.timestamp).getTime();
            const isFirstUnread = msgTs > sessionStartLastRead && 
                                 (index === 0 || new Date(filteredMessages[index-1].timestamp).getTime() <= sessionStartLastRead);
            
            return (
              <React.Fragment key={msg.id}>
                {isFirstUnread && (
                  <div className="flex items-center gap-4 my-8 animate-fade-in">
                    <div className="flex-1 h-[1px] bg-red-500/30"></div>
                    <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded flex items-center gap-2">
                      <Bell size={10} />
                      New Messages
                    </span>
                    <div className="flex-1 h-[1px] bg-red-500/30"></div>
                  </div>
                )}
                <div 
                  id={`msg-${msg.id}`} 
                  key={msg.id} 
                  data-msg-id={msg.id}
                  data-timestamp={msgTs}
                  className={`relative flex gap-3 max-w-3xl mx-auto w-full group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                <div className="shrink-0 mt-auto">
                    {!isMe ? (
                      <button onClick={() => handleUserClick({ id: msg.senderId || '', username: msg.senderName || '', avatar: msg.senderAvatar || '', role: msg.senderRole || '' })}>
                        <img src={msg.senderAvatar} className="w-9 h-9 rounded-full bg-[#27272a] hover:ring-2 hover:ring-[#D4AF37] transition-all" alt={msg.senderName} />
                      </button>
                    ) : (
                      <img 
                        src={msg.senderAvatar || `https://ui-avatars.com/api/?name=ME&background=D4AF37&color=000`} 
                        className="w-9 h-9 rounded-full object-cover bg-[#D4AF37] border border-white/10" 
                        alt="Me" 
                      />
                    )}
                </div>
                <div className={`relative min-w-[200px] max-w-[85%] rounded-2xl shadow-sm border border-transparent mb-4 ${isMe ? 'bg-[#27272a] rounded-br-none' : 'bg-[#121212] rounded-bl-none'}`}> 
                    {/* Reaction Pop-up */}
                    <div className={`absolute -top-5 ${isMe ? 'left-4' : 'right-4'} opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 bg-[#27272a] border border-white/10 rounded-full px-2 py-1 shadow-xl z-20`}>
                        {PRESET_EMOJIS.map(emoji => {
                            const hasReacted = msg.reactions?.find(r => r.emoji === emoji)?.userReacted;
                            return (
                                <button 
                                    key={emoji}
                                    onClick={() => toggleReaction(msg.id, emoji)}
                                    className={`hover:scale-125 transition-transform w-7 h-7 flex items-center justify-center rounded-full ${hasReacted ? 'bg-[#D4AF37]/20' : 'hover:bg-white/5'} text-sm`}
                                >
                                    {emoji}
                                </button>
                            );
                        })}
                        <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                        <button 
                            onClick={() => setEmojiPickerMessageId(emojiPickerMessageId === msg.id ? null : msg.id)}
                            className={`w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors ${emojiPickerMessageId === msg.id ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-gray-400'}`}
                            title="Add Reaction"
                        >
                            <Plus size={13} />
                        </button>
                        <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setReplyingToMessage(msg); }}
                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/5 text-gray-400 hover:text-[#D4AF37] transition-colors"
                            title="Reply"
                        >
                            <Reply size={13} />
                        </button>
                    </div>

                    {isMe && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteClick(msg.id); }}
                            className="absolute -top-5 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-7 h-7 flex items-center justify-center rounded-full bg-[#27272a] border border-white/10 text-gray-400 hover:text-red-500 hover:bg-red-500/10 shadow-xl z-20"
                            title="Delete"
                        >
                            <Trash2 size={13} />
                        </button>
                    )}

                    {emojiPickerMessageId === msg.id && (
                        <div className={`absolute z-[100] ${isMe ? 'right-0' : 'left-0'} top-full mt-2 shadow-2xl animate-fade-in-up`}>
                            <div className="fixed inset-0 z-[-1]" onClick={() => setEmojiPickerMessageId(null)}></div>
                            <EmojiPicker 
                                onEmojiClick={(emojiData: EmojiClickData) => {
                                    toggleReaction(msg.id, emojiData.emoji);
                                    setEmojiPickerMessageId(null);
                                }}
                                theme={Theme.DARK}
                                lazyLoadEmojis={true}
                                searchPlaceholder="Search tactical emojis..."
                                width={300}
                                height={400}
                                skinTonesDisabled
                            />
                        </div>
                    )}

                    {!isMe && (
                        <div className="px-3 pt-2 pb-0 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span className={`text-[13px] font-bold ${msg.senderRole === 'General' ? 'text-[#D4AF37]' : 'text-[#ec407a]'}`}>{msg.senderName}</span>
                                {msg.senderIsVerified && <VerifiedBadge size="sm" />}
                            </div>
                        </div>
                    )}

                    {msg.replyingTo && (
                        <div 
                            className="mx-3 mt-2 mb-1 pl-3 border-l-2 border-[#D4AF37]/50 text-xs text-gray-400 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors bg-black/20" 
                            onClick={() => scrollToMessage(msg.replyingTo!.id)}
                        >
                            <div className="font-bold text-[#D4AF37] flex items-center gap-1">
                                <Reply size={10} />
                                {msg.replyingTo.senderName}
                            </div>
                            <div className="truncate opacity-80">{msg.replyingTo.text}</div>
                        </div>
                    )}

                    {msg.audioUrl ? (
                         <div className="p-3">
                             <div className="flex items-center gap-3 bg-black/30 rounded-xl p-3 border border-white/5">
                                 <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                                     <Volume2 size={16} className="text-[#D4AF37]" />
                                 </div>
                                 <audio controls src={msg.audioUrl} className="h-8 w-full accent-[#D4AF37]" />
                             </div>
                         </div>
                    ) : msg.imageUrl ? (
                        <div className="p-2">
                             <img src={msg.imageUrl} className="rounded-xl w-full h-auto max-h-[300px] object-cover" />
                        </div>
                    ) : (
                         <div className={`px-3 py-2 text-[15px] leading-relaxed text-white whitespace-pre-wrap ${!isMe && !msg.senderName ? 'pt-2' : ''}`}>
                            {msg.text}
                         </div>
                    )}
                    
                    <div className="px-3 pb-2 flex items-center justify-end gap-1 select-none">
                         <span className={`text-[11px] ${isMe ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                         {isMe && (
                           <div className="flex -space-x-1">
                             <Check size={12} className="text-[#D4AF37]" />
                             {msgTs <= lastReadTimestamp && <Check size={12} className="text-[#D4AF37]" />}
                           </div>
                         )}
                    </div>
                    
                    {msg.reactions && msg.reactions.length > 0 && (
                        <div className="absolute -bottom-3 left-2 flex gap-1 z-10">
                             {msg.reactions.map((r, i) => (
                                 <div key={i} onClick={() => toggleReaction(msg.id, r.emoji)} className={`bg-[#18181b] border ${r.userReacted ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/5'} rounded-full px-1.5 py-0.5 text-[10px] flex items-center gap-1 shadow-sm cursor-pointer hover:scale-105 transition-transform`}>
                                     <span>{r.emoji}</span>
                                     <span className={`${r.userReacted ? 'text-[#D4AF37]' : 'text-gray-400'} font-bold`}>{r.count}</span>
                                 </div>
                             ))}
                        </div>
                    )}
                </div>
                </div>
              </React.Fragment>
            );
        })}
      </div>

      {!isAtBottom && unreadCount > 0 && (
        <button 
          onClick={scrollToBottom}
          className="absolute bottom-24 right-8 z-50 bg-[#D4AF37] text-black px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce font-bold text-sm hover:scale-105 transition-transform active:scale-95"
        >
          <ArrowDown size={16} />
          {unreadCount} New {unreadCount === 1 ? 'Message' : 'Messages'}
        </button>
      )}

      {/* Message Input with Recording Controls */}
      <div className="p-3 bg-[#18181b] relative z-40 border-t border-black/10 flex flex-col justify-center shrink-0">
        {replyingToMessage && (
            <div className="flex items-center justify-between px-4 py-2 bg-[#27272a] rounded-t-xl border-b border-black/10 text-sm mb-2 mx-auto max-w-3xl w-full animate-fade-in-up">
                <div className="flex items-center gap-2 overflow-hidden">
                    <Reply size={14} className="text-[#D4AF37]" />
                    <span className="text-gray-400 whitespace-nowrap">Replying to <span className="text-[#D4AF37] font-bold">{replyingToMessage.senderName}</span>:</span>
                    <span className="text-gray-500 truncate max-w-[200px] md:max-w-md">{replyingToMessage.text || 'Media message'}</span>
                </div>
                <button onClick={() => setReplyingToMessage(null)} className="text-gray-500 hover:text-white transition-colors">
                    <X size={16} />
                </button>
            </div>
        )}
        <div className="max-w-3xl w-full flex items-end gap-2 mx-auto">
            {recordingState === 'idle' ? (
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 hover:text-white transition-colors h-11 w-11 flex items-center justify-center rounded-full hover:bg-white/5"
                    title="Upload Media"
                >
                    <Paperclip size={20} />
                </button>
            ) : (
                <button 
                    onClick={discardRecording}
                    className="p-2 text-red-500 hover:text-red-400 transition-colors h-11 w-11 flex items-center justify-center rounded-full hover:bg-red-500/10"
                    title="Discard Briefing"
                >
                    <Trash2 size={20} />
                </button>
            )}
            
            <div className={`flex-1 bg-[#09090b] rounded-2xl px-4 py-2.5 border border-transparent focus-within:border-[#D4AF37]/30 transition-all shadow-inner flex flex-col min-h-[44px]`}>
                {recordingState === 'idle' && (
                    <>
                        <textarea 
                            ref={inputRef} 
                            value={input} 
                            onChange={handleInputChange} 
                            onKeyDown={handleKeyDown} 
                            placeholder={`Message ${channelName}...`} 
                            rows={1} 
                            className="w-full bg-transparent border-none outline-none text-white text-[15px] placeholder-gray-500 font-normal max-h-40 overflow-y-auto resize-none block" 
                            style={{ minHeight: '24px' }}
                        />
                        {input.length > 0 && (
                            <div className="flex justify-end mt-1 select-none pointer-events-none">
                                <span className={`text-[9px] font-mono tracking-tighter ${input.length > 1800 ? 'text-red-500' : 'text-gray-600'}`}>
                                    {input.length} / 2000
                                </span>
                            </div>
                        )}
                    </>
                )}
                
                {(recordingState === 'recording' || recordingState === 'paused') && (
                    <div className="w-full flex items-center gap-4 animate-fade-in-up">
                        <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${recordingState === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-red-900'}`}></div>
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                {recordingState === 'recording' ? 'Live Briefing' : 'Paused'}
                             </span>
                        </div>
                        
                        {/* Soundwave Animation */}
                        <div className="flex items-center gap-[2px] h-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div 
                                    key={i} 
                                    className={`w-[2px] bg-[#D4AF37] rounded-full transition-all duration-300 ${recordingState === 'recording' ? 'animate-pulse' : 'h-1'}`}
                                    style={{ 
                                        height: recordingState === 'recording' ? `${Math.random() * 100}%` : '4px',
                                        animationDelay: `${i * 0.1}s` 
                                    }}
                                />
                            ))}
                        </div>

                        <span className="ml-auto font-mono text-white text-sm tabular-nums">{formatDuration(recordingDuration)}</span>
                        
                        <div className="flex items-center gap-1">
                            {recordingState === 'recording' ? (
                                <button onClick={pauseRecording} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"><Pause size={18} /></button>
                            ) : (
                                <button onClick={resumeRecording} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"><Mic size={18} /></button>
                            )}
                        </div>
                    </div>
                )}

                {recordingState === 'recorded' && recordedAudioUrl && (
                    <div className="w-full animate-fade-in-up flex items-center gap-3">
                        <AudioLines size={18} className="text-[#D4AF37]" />
                        <audio controls src={recordedAudioUrl} className="h-8 w-full accent-[#D4AF37]" />
                    </div>
                )}
            </div>

            <button 
                onClick={
                    input.trim() ? handleSendText : 
                    recordingState === 'idle' ? startRecording :
                    recordingState === 'recorded' ? sendRecording : stopRecording
                }
                disabled={isLoading}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 shadow-lg
                    ${(input.trim() || recordingState === 'recorded') ? 'bg-[#D4AF37] text-black hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 
                    recordingState !== 'idle' ? 'bg-red-600 text-white animate-pulse' :
                    'bg-[#27272a] text-gray-500 hover:bg-[#3f3f46]'}`}
            >
                {input.trim() || recordingState === 'recorded' ? <ArrowUp size={22} strokeWidth={3} /> :
                 recordingState === 'recording' || recordingState === 'paused' ? <StopCircle size={22} /> :
                 <Mic size={22} />}
            </button>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {messageToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMessageToDelete(null)}></div>
            <div className="relative w-full max-w-sm bg-[#18181b] border border-white/10 rounded-2xl p-6 shadow-2xl animate-fade-in-up">
                <h3 className="text-lg font-bold text-white mb-2">Delete Transmission?</h3>
                <p className="text-sm text-gray-400 mb-6">This message will be permanently erased from the secure log. This action cannot be undone.</p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setMessageToDelete(null)}
                        className="flex-1 py-2.5 rounded-xl bg-[#27272a] text-white font-medium hover:bg-[#3f3f46] transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmDelete}
                        className="flex-1 py-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-medium hover:bg-red-500 hover:text-white transition-all"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
      )}
      {/* Moderation Modal */}
      {showModModal && selectedUserForMod && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#18181b] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldAlert className="text-[#D4AF37]" size={20} />
                <h3 className="text-white font-bold uppercase tracking-widest">Moderation: {selectedUserForMod.username}</h3>
              </div>
              <button onClick={() => setShowModModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <img src={selectedUserForMod.avatar} className="w-12 h-12 rounded-full" alt="" />
                <div>
                  <div className="text-white font-bold">{selectedUserForMod.username}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">{selectedUserForMod.role}</div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Quick Actions</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleMute('10')} className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm font-medium transition-colors">
                    <MicOff size={16} />
                    Mute 10m
                  </button>
                  <button onClick={() => handleMute()} className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm font-medium transition-colors">
                    <MicOff size={16} />
                    Perm Mute
                  </button>
                  <button onClick={handleKick} className="flex items-center justify-center gap-2 p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-500 text-sm font-medium transition-colors">
                    <UserX size={16} />
                    Kick
                  </button>
                  <button onClick={() => handleMute('0')} className="flex items-center justify-center gap-2 p-3 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl text-emerald-500 text-sm font-medium transition-colors">
                    <ShieldCheck size={16} />
                    Unmute
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Issue Warning</label>
                <div className="space-y-2">
                  <textarea 
                    value={modReason}
                    onChange={(e) => setModReason(e.target.value)}
                    placeholder="Reason for warning..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] min-h-[80px]"
                  />
                  <button 
                    onClick={handleWarn}
                    disabled={!modReason.trim()}
                    className="w-full py-3 bg-[#D4AF37] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl flex items-center justify-center gap-2 uppercase text-xs tracking-widest hover:bg-[#b8962f] transition-colors"
                  >
                    <AlertTriangle size={16} />
                    Send Warning
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning Notification Overlay (for current user) */}
      {moderationStatus.warnings.length > 0 && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[90] w-full max-w-md animate-bounce-in">
          <div className="mx-4 bg-red-500 border border-red-600 rounded-xl p-4 shadow-2xl flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <AlertTriangle size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-black uppercase tracking-tighter text-sm">Official Warning</h4>
              <p className="text-white/90 text-xs mt-1">You have received a warning: "{moderationStatus.warnings[moderationStatus.warnings.length - 1].reason}"</p>
            </div>
            <button 
              onClick={() => setModerationStatus(prev => ({ ...prev, warnings: [] }))}
              className="text-white/50 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarRoomAI;
