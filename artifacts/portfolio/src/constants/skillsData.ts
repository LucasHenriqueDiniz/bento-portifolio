export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'integration'
  | 'automation'
  | 'ai'
  | 'mobile'
  | 'desktop'
  | 'devops'
  | 'database'
  | 'design'
  | 'tools'
  | 'other';

export interface SkillDataType {
  name: string;
  category: SkillCategory;
  featured?: boolean;
  order?: number;
}

export const skillsData: SkillDataType[] = [
  // Frontend
  { name: 'TypeScript', category: 'frontend', featured: true, order: 1 },
  { name: 'React', category: 'frontend', featured: true, order: 2 },
  { name: 'Next.js', category: 'frontend', featured: true, order: 3 },
  { name: 'Tailwind CSS', category: 'frontend', order: 4 },
  { name: 'Framer Motion', category: 'frontend', order: 5 },
  { name: 'Zustand', category: 'frontend', order: 6 },
  { name: 'Expo', category: 'frontend', order: 7 },

  // Backend
  { name: 'Node.js', category: 'backend', featured: true, order: 8 },
  { name: 'Python', category: 'backend', order: 9 },
  { name: 'Go', category: 'backend', order: 10 },
  { name: 'Prisma', category: 'backend', order: 11 },
  { name: 'NestJS', category: 'backend', order: 12 },

  // Integration
  { name: 'REST APIs', category: 'integration', featured: true, order: 13 },
  { name: 'WebSockets', category: 'integration', order: 14 },
  { name: 'Webhooks', category: 'integration', order: 15 },
  { name: 'Web Serial API', category: 'integration', order: 16 },

  // Automation
  { name: 'GitHub Actions', category: 'automation', featured: true, order: 17 },
  { name: 'Workflow Automation', category: 'automation', order: 18 },
  { name: 'Playwright', category: 'automation', order: 19 },

  // AI
  { name: 'LLM Integration', category: 'ai', featured: true, order: 20 },
  { name: 'Ollama', category: 'ai', order: 21 },

  // Database
  { name: 'PostgreSQL', category: 'database', featured: true, order: 22 },
  { name: 'Supabase', category: 'database', order: 23 },
  { name: 'Redis', category: 'database', order: 24 },

  // DevOps
  { name: 'Vercel', category: 'devops', order: 25 },
  { name: 'Docker', category: 'devops', order: 26 },
  { name: 'Vite', category: 'devops', order: 27 },
  { name: 'AWS Lambda', category: 'devops', order: 28 },

  // Design
  { name: 'Figma', category: 'design', order: 29 },
  { name: 'SEO', category: 'design', order: 30 },

  // Desktop
  { name: 'Electron', category: 'desktop', order: 31 },

  // Mobile
  { name: 'React Native', category: 'mobile', order: 32 },
];

export const currentlyLearning: SkillDataType[] = [
  { name: 'Go', category: 'backend', order: 1 },
  { name: 'Rust', category: 'backend', order: 2 },
  { name: 'Framer Motion', category: 'frontend', order: 3 },
];
