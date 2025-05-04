
import { 
  TelegramAccount, 
  GroupTarget, 
  MessageTemplate, 
  CampaignSchedule, 
  DeliveryLog, 
  Subscription,
  User
} from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    active: true
  },
  {
    id: '2',
    username: 'user1',
    password: 'user123',
    role: 'user',
    active: true
  }
];

export const mockTelegramAccounts: TelegramAccount[] = [
  {
    id: '1',
    phoneNumber: '+62812345678',
    username: 'promo_account1',
    apiId: '12345678',
    apiHash: 'a1b2c3d4e5f6g7h8i9j0',
    connected: true,
    lastActive: new Date().toISOString(),
    premiumStatus: true
  },
  {
    id: '2',
    phoneNumber: '+62812345679',
    username: 'promo_account2',
    apiId: '87654321',
    apiHash: '0j9i8h7g6f5e4d3c2b1a',
    connected: false,
    lastActive: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    premiumStatus: false
  }
];

export const mockGroupTargets: GroupTarget[] = [
  {
    id: '1',
    name: 'Digital Marketing Indonesia',
    username: 'digitalmarketingid',
    memberCount: 5420,
    lastMessageSent: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    isChannel: false,
    status: 'sent'
  },
  {
    id: '2',
    name: 'Bisnis Online Group',
    username: 'bisnisol',
    memberCount: 3250,
    lastMessageSent: null,
    isChannel: false,
    status: 'pending'
  },
  {
    id: '3',
    name: 'Promosi Produk Channel',
    username: 'promosiproduk',
    memberCount: 8760,
    lastMessageSent: null,
    isChannel: true,
    status: 'scheduled'
  },
  {
    id: '4',
    name: 'Jual Beli Indonesia',
    username: 'jualbeli_id',
    memberCount: 12500,
    lastMessageSent: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    isChannel: false,
    status: 'failed'
  }
];

export const mockMessageTemplates: MessageTemplate[] = [
  {
    id: '1',
    title: 'Promo Weekend',
    content: '🔥 PROMO WEEKEND SPECIAL! 🔥\n\nDiskon 50% untuk semua produk kami!\nHanya sampai hari Minggu.\n\nKunjungi: https://toko.example.com',
    hasEmojis: true,
    hasMedia: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: '2',
    title: 'Launch Product Baru',
    content: '✨ LAUNCHING PRODUK BARU ✨\n\nPerkenalkan inovasi terbaru kami:\n- Fitur canggih\n- Kualitas premium\n- Harga terjangkau\n\nOrder sekarang: wa.me/6281234567890',
    hasEmojis: true,
    hasMedia: true,
    mediaUrl: '/placeholder.svg',
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  }
];

export const mockSchedules: CampaignSchedule[] = [
  {
    id: '1',
    name: 'Regular Schedule',
    minDelay: 60, // 60 seconds minimum delay
    maxDelay: 180, // 180 seconds maximum delay
    startTime: '09:00',
    endTime: '18:00',
    activeDays: [1, 2, 3, 4, 5], // Monday to Friday
    active: true
  },
  {
    id: '2',
    name: 'Weekend Campaign',
    minDelay: 120,
    maxDelay: 300,
    startTime: '10:00',
    endTime: '20:00',
    activeDays: [0, 6], // Sunday and Saturday
    active: false
  }
];

export const generateMockLogs = (): DeliveryLog[] => {
  const logs: DeliveryLog[] = [];
  const now = Date.now();
  
  // Generate 20 random logs from the past 24 hours
  for (let i = 0; i < 20; i++) {
    const randomTime = now - Math.floor(Math.random() * 86400000); // Random time in the last 24 hours
    const randomTarget = mockGroupTargets[Math.floor(Math.random() * mockGroupTargets.length)];
    const randomAccount = mockTelegramAccounts[Math.floor(Math.random() * mockTelegramAccounts.length)];
    const randomStatus = Math.random() > 0.2 ? 'success' : 'failed';
    
    logs.push({
      id: `log-${i}`,
      timestamp: new Date(randomTime).toISOString(),
      accountId: randomAccount.id,
      targetId: randomTarget.id,
      targetName: randomTarget.name,
      messageId: mockMessageTemplates[Math.floor(Math.random() * mockMessageTemplates.length)].id,
      status: randomStatus,
      errorMessage: randomStatus === 'failed' ? 'Failed to send message: Rate limit exceeded' : undefined
    });
  }
  
  // Sort logs by timestamp (newest first)
  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return logs;
};

export const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    userId: '2', // user1
    plan: 'basic',
    startDate: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    endDate: new Date(Date.now() + 2592000000).toISOString(), // 30 days from now
    active: true,
    allowedAccounts: 2,
    allowedMessages: 100,
    remainingMessages: 78,
    features: {
      premiumEmojis: false,
      mediaMessages: false,
      watermarkRemoval: false,
      prioritySupport: false
    }
  }
];

export const mockDeliveryLogs = generateMockLogs();
