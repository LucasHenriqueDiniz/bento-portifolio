export interface JobExperience {
  id: string;
  title: string;
  institution: string;
  url?: string;
  startDate: string; // YYYY-MM
  endDate?: string | null; // YYYY-MM or null for current
  showInTimeline: boolean;
  tags: {
    label: string;
    value?: string;
  }[];
  topTags: {
    label: string;
    value?: string;
  }[];
  description: string;
  icon?: string; // lucide-react icon name or logo path
}

export const jobExperiences: JobExperience[] = [
  {
    id: "eng-futuro",
    title: "Desenvolvedor Full Stack",
    institution: "Engenharia do Futuro",
    url: "https://engenhariadofuturo.com.br/",
    startDate: "2025-04",
    endDate: null,
    showInTimeline: true,
    icon: "/timeline/seu-iot-logo.jpg",
    topTags: [
      { label: "Job" },
      { label: "Engenharia do Futuro" },
    ],
    tags: [
      { label: "React" },
      { label: "TypeScript" },
      { label: "Python" },
      { label: "Microcontrollers" },
    ],
    description: "Arquitetei e implementei refator completo da plataforma e landing page, estabelecendo design system e guidelines. Construí sistema de instalação de firmware usando Web Serial API, automatizando processo de flash e comunicação serial diretamente no navegador.",
  },
  {
    id: "eng-futuro-vol",
    title: "Desenvolvedor Voluntário",
    institution: "Engenharia do Futuro",
    url: "https://engenhariadofuturo.com.br/",
    startDate: "2023-05",
    endDate: "2024-02",
    showInTimeline: true,
    icon: "/timeline/seu-iot-logo.jpg",
    topTags: [
      { label: "Volunteer" },
      { label: "Engenharia do Futuro" },
    ],
    tags: [
      { label: "React" },
      { label: "Node.js" },
      { label: "Microcontrollers" },
      { label: "TypeScript" },
      { label: "Python" },
      { label: "C" },
      { label: "ViteJS" },
    ],
    description: "Lideiei workshop técnico de Front-End cobrindo arquitetura e padrões de código. Desenvolvi firmware embarcado, interface web e API backend, integrando hardware com aplicação fullstack.",
  },
  {
    id: "bots-channel",
    title: "CTO & Co-Founder",
    institution: "Bots Channel",
    url: "https://botschannel.com/",
    startDate: "2024-01",
    endDate: "2024-12",
    showInTimeline: true,
    icon: "/timeline/botschanell-logo.webp",
    topTags: [
      { label: "Job" },
      { label: "Bots Channel" },
    ],
    tags: [
      { label: "React" },
      { label: "Node.js" },
      { label: "AWS" },
      { label: "Prisma" },
      { label: "Zustand" },
      { label: "TypeScript" },
    ],
    description: "Arquitetei plataforma SaaS serverless para automação de chatbots multi-canal (WhatsApp, Telegram, Instagram). Implementei sistema de autenticação customizado, mecanismo de processamento JSON, e infraestrutura AWS Lambda com PostgreSQL. Construí interface no-code para fluxos de automação visuais.",
  },
  {
    id: "freelance-design",
    title: "Designer Freelancer",
    institution: "Autônomo",
    url: "https://www.linkedin.com/in/lucas-diniz-ostroski/",
    startDate: "2019-01",
    endDate: "2020-12",
    showInTimeline: true,
    icon: "Palette",
    topTags: [
      { label: "Freelance" },
      { label: "Graphic Design" },
    ],
    tags: [
      { label: "Photoshop" },
      { label: "Illustrator" },
      { label: "After Effects" },
      { label: "Graphic Design" },
    ],
    description: "Gerenciei projetos de design end-to-end para múltiplos clientes, mantendo 98.7% de taxa de satisfação. Desenvolvi identidades visuais, materiais promocionais e motion graphics, coordenando entregas e comunicação com stakeholders.",
  },
  {
    id: "vix-logistica",
    title: "Auxiliar Administrativo (Menor Aprendiz)",
    institution: "Vix Logística",
    url: "https://www.linkedin.com/company/vix-logistica/",
    startDate: "2017-02",
    endDate: "2019-02",
    showInTimeline: false,
    icon: "Warehouse",
    topTags: [
      { label: "Job" },
      { label: "Vix Logistics" },
    ],
    tags: [
      { label: "Warehouse" },
      { label: "Data Sheets" },
    ],
    description: "Realizei tarefas administrativas e de controle de warehouse, criando planilhas de dados e gerenciando inventário, demonstrando habilidades organizacionais e atenção aos detalhes em ambiente corporativo.",
  },
  {
    id: "include-gurias-work",
    title: "Desenvolvedor - Bolsa de Pesquisa",
    institution: "Include Gurias",
    url: "https://includegurias.com/",
    startDate: "2023-06",
    endDate: "2024-01",
    showInTimeline: true,
    icon: "/timeline/include-gurias.webp",
    topTags: [
      { label: "Bolsa" },
      { label: "Include Gurias" },
    ],
    tags: [
      { label: "React" },
      { label: "TypeScript" },
      { label: "Node.js" },
      { label: "AWS" },
      { label: "Figma" },
    ],
    description: "Arquitetei plataforma institucional fullstack com CMS headless customizado. Implementei sistema de autenticação, chatbot interativo, e dashboard administrativo com CRUD completo para gerenciamento de conteúdo educacional e membros.",
  },
  {
    id: "comunica-mulher-work",
    title: "Desenvolvedor - Bolsa de Pesquisa",
    institution: "ComunicaMulher",
    url: "https://reclame-mulher.vercel.app/",
    startDate: "2026-01",
    endDate: null,
    showInTimeline: true,
    icon: "MessageSquare",
    topTags: [
      { label: "Bolsa" },
      { label: "ComunicaMulher" },
    ],
    tags: [
      { label: "Next.js" },
      { label: "TypeScript" },
      { label: "Supabase" },
      { label: "PostgreSQL" },
      { label: "Impacto Social" },
    ],
    description: "Construí sistema de gestão de denúncias com fluxo de moderação completo. Implementei pipeline de recebimento com validação e sanitização, políticas granulares de RLS no Supabase, e dashboard administrativo com filtros avançados. Arquitetura focada em segurança com auditoria completa.",
  },
];
