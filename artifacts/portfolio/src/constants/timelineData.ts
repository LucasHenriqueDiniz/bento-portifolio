/**
 * Extended experience schema for TimelineCard component
 * Includes additional fields needed for interactive tooltip display
 */

export interface TimelineJobExperience {
  id: string;
  position: string; // Job title
  company: string;
  location: string;
  type: "Job" | "Volunteer" | "Internship" | "Freelance";
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
 * This is kept separate from the CV constants as TimelineCard has a different data structure
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
    url: "https://engenhariadofuturo.com.br/",
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
    url: "https://botschannel.com/",
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
    url: "https://engenhariadofuturo.com.br/",
  },
];

export const timelineAcademicExperiences: TimelineAcademicExperience[] = [
  {
    id: "uergs",
    degree: "Engenharia da Computação",
    field: "Computer Engineering",
    institution: "UERGS - Universidade Estadual do Rio Grande do Sul",
    location: "Rio de Janeiro, Brasil",
    startDate: "2023-02",
    endDate: "2025-01",
    description:
      "Participei de projetos acadêmicos focados em programação de baixo nível, desenvolvimento de algoritmos e sistemas embarcados. Experiência prática com microcontroladores e fundamentos de inteligência artificial.",
    highlights: [
      "Microcontroladores e Embedded Systems",
      "Algoritmos avançados",
      "Sistemas operacionais",
    ],
    url: "https://www.uergs.edu.br/",
  },
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
    url: "https://www.unicv.edu.br/",
  },
];
