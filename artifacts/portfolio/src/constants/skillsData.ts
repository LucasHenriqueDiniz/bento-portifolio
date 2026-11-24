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

/**
 * The single list of skills. The resume shows it by category on the page and as text
 * lines in the ATS block and the PDF (see resumeSkillLines); the home Tech Stack card
 * shows the `featured` ones. Mark a skill featured to put it on the card.
 */
export interface SkillDataType {
  name: string;
  category: SkillCategory;
  featured?: boolean;
  /** A programming language: the resume lists these on a line of their own. */
  language?: boolean;
  order?: number;
}

export const skillsData: SkillDataType[] = [
  // Frontend
  { name: 'TypeScript', category: 'frontend', featured: true, language: true, order: 1 },
  { name: 'React', category: 'frontend', featured: true, order: 2 },
  { name: 'Next.js', category: 'frontend', featured: true, order: 3 },
  { name: 'Tailwind CSS', category: 'frontend', featured: true, order: 4 },
  { name: 'Astro', category: 'frontend', featured: true, order: 4.5 },
  { name: 'Framer Motion', category: 'frontend', order: 5 },
  { name: 'Zustand', category: 'frontend', order: 6 },
  { name: 'Expo', category: 'frontend', order: 7 },
  { name: 'JavaScript', category: 'frontend', language: true, order: 1.2 },

  // Backend
  { name: 'Node.js', category: 'backend', featured: true, order: 8 },
  { name: 'Python', category: 'backend', featured: true, language: true, order: 9 },
  { name: 'Go', category: 'backend', featured: true, language: true, order: 10 },
  { name: 'FastAPI', category: 'backend', featured: true, order: 10.5 },
  { name: 'Prisma', category: 'backend', order: 11 },
  { name: 'NestJS', category: 'backend', order: 12 },
  { name: 'Flask', category: 'backend', order: 13 },

  // Integration
  { name: 'REST APIs', category: 'integration', featured: true, order: 14 },
  { name: 'WebSockets', category: 'integration', order: 15 },
  { name: 'Webhooks', category: 'integration', order: 16 },
  { name: 'Web Serial API', category: 'integration', order: 17 },

  // Automation
  { name: 'GitHub Actions', category: 'automation', featured: true, order: 18 },
  { name: 'Workflow Automation', category: 'automation', order: 19 },
  { name: 'Playwright', category: 'automation', order: 20 },

  // AI
  { name: 'LLM Integration', category: 'ai', featured: true, order: 21 },
  { name: 'Ollama', category: 'ai', order: 22 },

  // Database
  { name: 'PostgreSQL', category: 'database', featured: true, order: 23 },
  { name: 'Supabase', category: 'database', featured: true, order: 24 },
  { name: 'Redis', category: 'database', order: 25 },
  { name: 'SQL', category: 'database', language: true, order: 22.9 },

  // DevOps
  { name: 'Vercel', category: 'devops', order: 26 },
  { name: 'Docker', category: 'devops', order: 27 },
  { name: 'Vite', category: 'devops', order: 28 },
  { name: 'AWS Lambda', category: 'devops', featured: true, order: 29 },
  { name: 'Cloudflare', category: 'devops', featured: true, order: 25.5 },

  // Design
  { name: 'Figma', category: 'design', order: 31 },
  { name: 'SEO', category: 'design', order: 32 },

  // Desktop
  { name: 'Electron', category: 'desktop', order: 33 },

  // Mobile
  { name: 'React Native', category: 'mobile', order: 34 },
];

export const currentlyLearning: SkillDataType[] = [
  { name: 'Rust', category: 'backend', order: 1 },
  { name: 'Framer Motion', category: 'frontend', order: 2 },
];
