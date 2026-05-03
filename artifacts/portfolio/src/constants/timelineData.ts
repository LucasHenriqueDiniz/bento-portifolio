/**
 * Extended experience schema for TimelineCard component
 * Includes additional fields needed for interactive tooltip display
 */

export interface TimelineJobExperience {
  id: string;
  position: string; // Job title
  company: string;
  location: string;
  type: "Job" | "Volunteer" | "Internship" | "Freelance" | "Bolsa";
  startDate: string; // YYYY-MM
  endDate: string | null; // YYYY-MM or null for current
  description: string;
  technologies: string[]; // Top 4 tech stack items
  logo?: string; // Company logo URL
  url?: string;
}

export interface TimelineAcademicExperience {
  id: string;
  degree: string; // Course/degree name
  field: string; // Field of study
  institution: string;
  location: string;
  startDate: string; // YYYY-MM
  endDate: string | null; // YYYY-MM or null for current
  description: string;
  highlights: string[]; // Key achievements
  logo?: string; // Institution logo URL
  url?: string;
}

/**
 * Timeline data for home card display
 * Sincronizado com os dados do resume (/resume)
 */
export const timelineJobExperiences: TimelineJobExperience[] = [
  {
    id: "eng-futuro",
    position: "Desenvolvedor Full Stack",
    company: "Engenharia do Futuro",
    location: "São Paulo, Brasil",
    type: "Job",
    startDate: "2025-04",
    endDate: null,
    description:
      "Arquitetei e implementei refatoração completa da plataforma e landing page, estabelecendo design system e guidelines. Desenvolvi sistema de instalação de firmware via Web Serial API.",
    technologies: ["React", "TypeScript", "Python", "Microcontroladores"],
    logo: "/timeline/seu-iot-logo.jpg",
    url: "https://engenhariadofuturo.com.br/",
  },
  {
    id: "comunica-mulher-work",
    position: "Desenvolvedor - Bolsa de Pesquisa",
    company: "ComunicaMulher",
    location: "São Paulo, Brasil",
    type: "Bolsa",
    startDate: "2026-01",
    endDate: null,
    description:
      "Built complaint management system with complete moderation workflow. Implemented intake pipeline with validation and sanitization. Designed granular Supabase RLS policies and admin dashboard with advanced filters.",
    technologies: ["Next.js", "TypeScript", "Supabase", "PostgreSQL"],
    logo: "/timeline/comunicamulher.webp",
    url: "https://reclame-mulher.vercel.app/",
  },
  {
    id: "bots-channel",
    position: "CTO & Co-Founder",
    company: "Bots Channel",
    location: "São Paulo, Brasil",
    type: "Job",
    startDate: "2024-01",
    endDate: "2024-12",
    description:
      "Arquitetei plataforma SaaS serverless para automação de chatbots multi-canal (WhatsApp, Telegram, Instagram). Implementei sistema de autenticação customizado e engine de processamento de fluxos JSON-based.",
    technologies: ["React", "Node.js", "AWS", "Prisma"],
    logo: "/timeline/botschanell-logo.webp",
    url: "https://botschannel.com/",
  },
  {
    id: "include-gurias-work",
    position: "Desenvolvedor - Bolsa de Pesquisa",
    company: "Include Gurias",
    location: "São Paulo, Brasil",
    type: "Bolsa",
    startDate: "2023-06",
    endDate: "2024-01",
    description:
      "Arquitetei plataforma institucional fullstack com CMS headless customizado. Implementei sistema de autenticação e chatbot interativo. Construí dashboard admin com CRUD completo para conteúdo educacional e gestão de membros.",
    technologies: ["React", "TypeScript", "Node.js", "AWS"],
    logo: "/timeline/include-gurias.webp",
    url: "https://includegurias.com/",
  },
  {
    id: "eng-futuro-vol",
    position: "Desenvolvedor Voluntário",
    company: "Engenharia do Futuro",
    location: "São Paulo, Brasil",
    type: "Volunteer",
    startDate: "2023-05",
    endDate: "2024-02",
    description:
      "Conduzi workshop técnico de Front-End para a equipe, cobrindo arquitetura e padrões de código. Desenvolvi firmware embarcado, interface web e API backend.",
    technologies: ["React", "Node.js", "Arduino", "TypeScript"],
    logo: "/timeline/seu-iot-logo.jpg",
    url: "https://engenhariadofuturo.com.br/",
  },
  {
    id: "freelance-design",
    position: "Designer Freelancer",
    company: "Autônomo",
    location: "São Paulo, Brasil",
    type: "Freelance",
    startDate: "2019-01",
    endDate: "2020-12",
    description:
      "Gerenciei projetos de design end-to-end para múltiplos clientes com 98.7% de satisfação. Desenvolvi identidades visuais, materiais promocionais e motion graphics.",
    technologies: ["Photoshop", "Illustrator", "After Effects"],
    url: "https://www.linkedin.com/in/lucas-diniz-ostroski/",
  },
];

export const timelineAcademicExperiences: TimelineAcademicExperience[] = [
  {
    id: "unicv",
    degree: "Engenharia de Software",
    field: "Software Engineering",
    institution: "UNICV",
    location: "Rio de Janeiro, Brasil",
    startDate: "2025-02",
    endDate: null,
    description:
      "Foco em arquitetura de sistemas robustos, desenvolvimento escalável e implementação de metodologias ágeis. Aprofundamento em padrões de design e engenharia de software moderna.",
    highlights: [
      "Arquitetura de Software",
      "Metodologias Ágeis",
      "Padrões de Design",
    ],
    logo: "/timeline/unicive.webp",
    url: "https://www.unicv.edu.br/",
  },
  {
    id: "uergs",
    degree: "Engenharia da Computação",
    field: "Computer Engineering",
    institution: "UERGS",
    location: "Rio Grande do Sul, Brasil",
    startDate: "2023-02",
    endDate: "2025-01",
    description:
      "Participei de projetos acadêmicos focados em programação de baixo nível, desenvolvimento de algoritmos e sistemas embarcados. Experiência prática com microcontroladores e fundamentos de inteligência artificial.",
    highlights: [
      "Microcontroladores e Embedded Systems",
      "Algoritmos avançados",
      "Sistemas operacionais",
    ],
    logo: "/timeline/uergs.webp",
    url: "https://www.uergs.edu.br/",
  },
];
