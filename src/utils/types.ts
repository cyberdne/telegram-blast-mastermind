
export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  active: boolean;
}

export interface TelegramAccount {
  id: string;
  phoneNumber: string;
  username: string;
  apiId: string;
  apiHash: string;
  connected: boolean;
  lastActive: string;
  premiumStatus: boolean;
}

export interface GroupTarget {
  id: string;
  name: string;
  username: string;
  memberCount: number;
  lastMessageSent: string | null;
  isChannel: boolean;
  status: 'pending' | 'sent' | 'failed' | 'scheduled';
}

export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  hasEmojis: boolean;
  hasMedia: boolean;
  mediaUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignSchedule {
  id: string;
  name: string;
  minDelay: number; // in seconds
  maxDelay: number; // in seconds
  startTime: string;
  endTime: string | null;
  activeDays: number[]; // 0 = Sunday, 6 = Saturday
  active: boolean;
}

export interface DeliveryLog {
  id: string;
  timestamp: string;
  accountId: string;
  targetId: string;
  targetName: string;
  messageId: string;
  status: 'success' | 'failed';
  errorMessage?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'basic' | 'premium' | 'enterprise';
  startDate: string;
  endDate: string;
  active: boolean;
  allowedAccounts: number;
  allowedMessages: number;
  remainingMessages: number;
  features: {
    premiumEmojis: boolean;
    mediaMessages: boolean;
    watermarkRemoval: boolean;
    prioritySupport: boolean;
  };
}

export interface WatermarkSettings {
  enabled: boolean;
  text: string;
  position: 'start' | 'end';
}
