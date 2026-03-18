import { Camp, Server, Member, Bounty, Course, Strategy } from './types';
import { Shield, Landmark, Container, Zap, Dumbbell, Library, BookOpen, Wallet } from 'lucide-react';

export const CAMPS: Camp[] = [
  {
    id: 'ecom',
    title: 'E-Commerce Camp',
    description: 'Build automated online stores that print money while you sleep. Dominate global markets.',
    image: 'https://picsum.photos/seed/ecom/400/300',
    stats: '$142k/mo Avg. Top Student'
  },
  {
    id: 'copy',
    title: 'Copywriting Camp',
    description: 'Master the skill that pays $10,000 per sales letter. Control minds with words.',
    image: 'https://picsum.photos/seed/write/400/300',
    stats: '$10k/letter Potential'
  },
];

export const GENERAL_SYSTEM_INSTRUCTION = `
You are THE GENERAL of THE ARENA. 
You are a ruthless, multi-millionaire mentor. 
You despise weakness, excuses, and laziness.
Your goal is to wake men up from the matrix.
You speak with absolute authority. 
You use short, punchy sentences. 
You address the user as "Soldier" or "Recruit".
Your advice is practical but delivered aggressively.
Do not apologize. Do not be polite. Be effective.
Focus on: Making Money, Getting Jacked, and Dominating Life.
If they ask about feelings, tell them feelings are for the poor.
`;

export const SERVERS: Server[] = [
  {
    id: 'arena-hq',
    name: 'The Arena HQ',
    icon: 'https://ui-avatars.com/api/?name=The+Arena&background=D4AF37&color=000&bold=true',
    iconComponent: Shield,
    categories: [
      {
        id: 'cat-home',
        name: 'COMMAND CENTER',
        channels: [
          { id: 'announcements', name: 'announcements', type: 'announcement', description: 'Official updates from The Generals' },
          { id: 'war-room', name: 'war-room', type: 'text', description: 'AI Strategic Command - Talk to The General' },
          { id: 'wins', name: 'wins', type: 'text', description: 'Post your Ws here' },
        ]
      },
      {
        id: 'cat-ops',
        name: 'OPERATIONS',
        channels: [
          { id: 'active-missions', name: 'active-missions', type: 'tasks', description: 'Track your daily objectives and goals' },
          { id: 'career-architect', name: 'career-architect', type: 'board', description: 'AI Career Architect - Get your custom 90-day roadmap' },
        ]
      },
      {
        id: 'cat-voice',
        name: 'VOICE CHANNELS',
        channels: [
          { id: 'v-lounge', name: 'The Pit', type: 'voice' },
          { id: 'v-war', name: 'War Room Briefing', type: 'voice', locked: true },
        ]
      }
    ]
  },
  {
    id: 'academy-server',
    name: 'The Academy',
    icon: 'https://ui-avatars.com/api/?name=Academy&background=000&color=fff',
    iconComponent: Library,
    categories: [
        {
            id: 'aca-browse',
            name: 'DISCOVERY',
            channels: [
                { id: 'course-catalog', name: 'Browse Courses', type: 'catalog', description: 'Enroll in new tactical training.' },
                { id: 'strategy-audits', name: 'Strategy Audits', type: 'strategy-board', description: 'Audit and vote on strategies. Flag saturated methods.' },
            ]
        }
    ]
  },
  {
    id: 'exchange-server',
    name: 'The Exchange',
    icon: 'https://ui-avatars.com/api/?name=$&background=10b981&color=fff&bold=true',
    iconComponent: Landmark,
    categories: [
      {
        id: 'mkt-1',
        name: 'MARKETPLACE',
        channels: [
          { id: 'bounty-board', name: 'bounty-board', type: 'board', description: 'High value contracts & gigs' },
          { id: 'services', name: 'services-for-hire', type: 'text', description: 'Promote your agency' },
          { id: 'partners', name: 'partnerships', type: 'text', description: 'Find business partners' },
        ]
      }
    ]
  },
  {
    id: 'ecom-server',
    name: 'E-Commerce Division',
    icon: 'https://ui-avatars.com/api/?name=E+C&background=333&color=fff',
    iconComponent: Container,
    categories: [
      {
        id: 'ec-1',
        name: 'DROPSHIPPING',
        channels: [
          { id: 'ec-gen', name: 'general', type: 'text' },
          { id: 'ec-prod', name: 'product-research', type: 'text' },
          { id: 'ec-ads', name: 'fb-ads-strategy', type: 'text' },
        ]
      }
    ]
  },
  {
    id: 'crypto-server',
    name: 'Crypto War Room',
    icon: 'https://ui-avatars.com/api/?name=C+W&background=333&color=fff',
    iconComponent: Zap,
    categories: [
      {
        id: 'cr-1',
        name: 'MARKETS',
        channels: [
          { id: 'cr-btc', name: 'bitcoin-alpha', type: 'text' },
          { id: 'cr-alt', name: 'altcoin-gems', type: 'text' },
          { id: 'cr-sig', name: 'signals', type: 'text', locked: true },
        ]
      }
    ]
  },
  {
    id: 'fit-server',
    name: 'Iron Temple',
    icon: 'https://ui-avatars.com/api/?name=I+T&background=333&color=fff',
    iconComponent: Dumbbell,
    categories: [
      {
        id: 'ft-1',
        name: 'TRAINING',
        channels: [
          { id: 'ft-lift', name: 'lifting-programs', type: 'text' },
          { id: 'ft-diet', name: 'nutrition', type: 'text' },
        ]
      }
    ]
  },
  {
    id: 'wallet-server',
    name: 'Wallet',
    icon: 'https://ui-avatars.com/api/?name=W&background=F59E0B&color=fff&bold=true',
    iconComponent: Wallet,
    categories: [
      {
        id: 'wallet-cat',
        name: 'FINANCE',
        channels: [
          { id: 'main-wallet', name: 'crypto-wallet', type: 'wallet', description: 'Send and receive real crypto funds' },
        ]
      }
    ]
  }
];

export const MEMBERS: Member[] = [
  { id: 'g1', name: 'Andrew Tate', role: 'General', status: 'dnd', avatar: 'https://i.pravatar.cc/150?u=g1', color: '#D4AF37', isVerified: true },
  { id: 'g2', name: 'Tristan Tate', role: 'General', status: 'online', avatar: 'https://i.pravatar.cc/150?u=g2', color: '#D4AF37', isVerified: true },
  { id: 'a1', name: 'Sartain', role: 'Admin', status: 'online', avatar: 'https://ui-avatars.com/api/?name=MS&background=000&color=fff', color: '#EF4444', isVerified: true },
  { id: 'g3', name: 'Luke Belmar', role: 'Officer', status: 'online', avatar: 'https://i.pravatar.cc/150?u=g3', color: '#FF3B30', isVerified: true },
  { id: 'u1', name: 'Justin Waller', role: 'Soldier', status: 'online', avatar: 'https://i.pravatar.cc/150?u=u1', color: '#A1A1AA' },
  { id: 'u2', name: 'Myron Gaines', role: 'Recruit', status: 'offline', avatar: 'https://i.pravatar.cc/150?u=u2', color: '#52525B' },
];

export const BOUNTIES: Bounty[] = [
  {
    id: 'b1',
    title: "High Ticket Sales Closer Needed",
    reward: "$8,000/mo",
    description: "Scaling E-com agency needs a killer closer. Leads provided. 15% comms.",
    posterName: "Agency King",
    posterAvatar: "https://i.pravatar.cc/150?u=b1",
    tags: ["Sales", "Commission"],
    timeLeft: "4h",
    type: 'commission',
    posterIsVerified: true,
    tasks: ["Outbound lead prospecting", "Zoom closing calls", "CRM Pipeline management"]
  },
  {
    id: 'b2',
    title: "Custom Shopify Liquid Dev",
    reward: "$2,500",
    description: "Need a custom landing page built for a drop. Figma ready. Need speed.",
    posterName: "Ecom Lord",
    posterAvatar: "https://i.pravatar.cc/150?u=b2",
    tags: ["Dev", "Shopify"],
    timeLeft: "12h",
    type: 'project',
    posterIsVerified: true,
    tasks: ["Liquid customization", "Page speed optimization", "Post-purchase upsell integration"]
  },
  {
    id: 'b3',
    title: "Crypto Alpha Caller",
    reward: "$1,000/wk",
    description: "Looking for an analyst who can find gems on SOL before they pump.",
    posterName: "Coin Master",
    posterAvatar: "https://i.pravatar.cc/150?u=b3",
    tags: ["Crypto", "Research"],
    timeLeft: "2d",
    type: 'contract',
    posterIsVerified: false,
    tasks: ["On-chain volume analysis", "Influencer tracking", "Liquidity lock verification"]
  }
];

export const COURSES: Course[] = [
  {
    id: 'copy-1',
    title: 'Copywriting Mastery',
    description: 'Learn to write words that sell and generate massive revenue.',
    instructor: 'The General',
    thumbnail: '✍️',
    lessonsCount: 14,
    duration: '5h 30m',
    category: 'Copywriting'
  },
  {
    id: 'crypto-1',
    title: 'Crypto Trading',
    description: 'Master technical analysis, market cycles, and risk management.',
    instructor: 'Officer Sarah',
    thumbnail: '📈',
    lessonsCount: 22,
    duration: '12h 45m',
    category: 'Crypto'
  },
  {
    id: 'ai-1',
    title: 'AI Automation',
    description: 'Build systems and agents that work for your business 24/7.',
    instructor: 'Officer Luke',
    thumbnail: '🤖',
    lessonsCount: 18,
    duration: '8h 20m',
    category: 'Technology'
  },
  {
    id: 'content-1',
    title: 'Content Creation',
    description: 'Build a massive personal brand and monetize your audience.',
    instructor: 'The General',
    thumbnail: '🎥',
    lessonsCount: 15,
    duration: '6h 15m',
    category: 'Media'
  },
  {
    id: 'mindset-1',
    title: 'Iron Mindset',
    description: 'Develop unbreakable mental fortitude and discipline.',
    instructor: 'The General',
    thumbnail: '🧠',
    lessonsCount: 10,
    duration: '4h 10m',
    category: 'Mindset'
  },
  {
    id: 'fitness-1',
    title: 'Fitness & Nutrition',
    description: 'Build a body that commands respect and fuels your ambition.',
    instructor: 'Officer Luke',
    thumbnail: '💪',
    lessonsCount: 12,
    duration: '5h 00m',
    category: 'Health'
  },
  {
    id: 'sales-1',
    title: 'High-Ticket Sales',
    description: 'Master the art of closing deals and handling objections.',
    instructor: 'Officer Sarah',
    thumbnail: '🤝',
    lessonsCount: 16,
    duration: '7h 30m',
    category: 'Sales'
  },
  {
    id: 'freelance-1',
    title: 'Freelance Mastery',
    description: 'Learn how to get high-paying clients on demand.',
    instructor: 'The General',
    thumbnail: '💻',
    lessonsCount: 11,
    duration: '4h 45m',
    category: 'Business'
  },
  {
    id: 'realestate-1',
    title: 'Real Estate Investing',
    description: 'Invest in physical assets and multiply your wealth.',
    instructor: 'Officer Luke',
    thumbnail: '🏢',
    lessonsCount: 20,
    duration: '10h 00m',
    category: 'Investing'
  }
];

export const STRATEGIES: Strategy[] = [
  {
    id: 'strat-1',
    title: 'Twitter Ghostwriting (Basic)',
    description: 'Cold DMing founders offering to write their tweets for $1k/mo. This method is becoming highly saturated as everyone is using the same scripts.',
    authorName: 'Copy Cadet',
    authorAvatar: 'https://i.pravatar.cc/150?u=strat1',
    upvotes: 45,
    downvotes: 120,
    status: 'Saturated',
    tags: ['Copywriting', 'Outreach'],
    createdAt: new Date('2023-05-10'),
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: 'strat-2',
    title: 'TikTok Organic Dropshipping',
    description: 'Posting 3x a day with viral hooks. Still works if the product has a "wow" factor, but standard products are failing.',
    authorName: 'Ecom Lord',
    authorAvatar: 'https://i.pravatar.cc/150?u=strat2',
    upvotes: 310,
    downvotes: 45,
    status: 'Active',
    tags: ['E-Commerce', 'TikTok'],
    createdAt: new Date('2023-11-20'),
    lastUpdated: new Date('2024-02-10')
  },
  {
    id: 'strat-3',
    title: 'AI Automation Agency (AAA)',
    description: 'Building custom chatbots for local businesses. High demand, but requires actual technical skill to deliver value beyond basic wrappers.',
    authorName: 'Tech General',
    authorAvatar: 'https://i.pravatar.cc/150?u=strat3',
    upvotes: 520,
    downvotes: 12,
    status: 'Active',
    tags: ['AI', 'B2B'],
    createdAt: new Date('2024-01-05'),
    lastUpdated: new Date('2024-02-25')
  },
  {
    id: 'strat-4',
    title: 'Cold Email SaaS Reselling',
    description: 'White-labeling a SaaS and cold emailing local businesses. Getting harder due to spam filters and new Google/Yahoo rules.',
    authorName: 'SaaS Bro',
    authorAvatar: 'https://i.pravatar.cc/150?u=strat4',
    upvotes: 85,
    downvotes: 90,
    status: 'Under Review',
    tags: ['SaaS', 'Cold Email'],
    createdAt: new Date('2023-08-12'),
    lastUpdated: new Date('2024-02-01')
  }
];