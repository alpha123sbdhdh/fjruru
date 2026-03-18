
export interface Camp {
  id: string;
  title: string;
  description: string;
  image: string;
  stats: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  thumbnail?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
  senderName?: string;
  senderAvatar?: string;
  senderRole?: string;
  reactions?: Reaction[];
  audioUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  replyingTo?: {
    id: string;
    senderName: string;
    text: string;
    senderAvatar?: string;
  };
}

export type ViewState = 'landing' | 'login' | 'signup' | 'forgot-password' | 'dashboard';

export interface GeneralAdviceConfig {
  systemInstruction: string;
}

export interface Strategy {
  id: string;
  title: string;
  description: string;
  authorName: string;
  authorAvatar: string;
  upvotes: number;
  downvotes: number;
  status: 'Active' | 'Under Review' | 'Saturated';
  tags: string[];
  createdAt: Date;
  lastUpdated: Date;
}

// Chat App Types
export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'announcement' | 'board' | 'video' | 'tasks' | 'catalog' | 'strategy-board' | 'dm' | 'group' | 'wallet';
  locked?: boolean;
  description?: string;
  lessons?: Lesson[]; // Added for video channels
  courseId?: string; // Link to a course
  recipientId?: string; // For DMs
  members?: string[]; // For Group chats
}

export interface ChannelCategory {
  id: string;
  name: string;
  channels: Channel[];
}

export interface Server {
  id: string;
  name: string;
  icon: string; // URL or initials fallback
  iconComponent?: any; // Lucide Icon Component
  categories: ChannelCategory[];
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: 'General' | 'Admin' | 'Co-Admin' | 'Officer' | 'Soldier' | 'Recruit';
  status: 'online' | 'idle' | 'dnd' | 'offline';
  color?: string;
  isVerified?: boolean;
}

export interface Bounty {
  id: string;
  title: string;
  reward: string;
  description: string;
  posterName: string;
  posterAvatar: string;
  tags: string[];
  timeLeft: string;
  type: 'project' | 'contract' | 'commission';
  posterIsVerified?: boolean;
  tasks?: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  lessonsCount: number;
  duration: string;
  category: string;
  isEnrolled?: boolean;
}
