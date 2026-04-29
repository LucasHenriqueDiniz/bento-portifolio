export interface JobExperience {
  id: string;
  title: string;
  titleEn?: string;
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
  descriptionEn?: string;
  icon?: string; // lucide-react icon name or logo path
}

export const jobExperiences: JobExperience[] = [
  {
    id: "eng-futuro",
    title: "Desenvolvedor Full Stack",
    titleEn: "Full Stack Developer",
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
    descriptionEn: "Architected and implemented complete platform and landing page refactor, establishing design system and component guidelines. Built firmware installer using Web Serial API, automating flash process and serial communication directly in browser.",
  },
  {
    id: "eng-futuro-vol",
    title: "Desenvolvedor Voluntário",
    titleEn: "Volunteer Developer",
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
    descriptionEn: "Led technical Front-End workshop covering architecture and code patterns. Developed embedded firmware, web interface and backend API, integrating microcontroller hardware with fullstack application.",
  },
  {
    id: "bots-channel",
    title: "CTO & Co-Founder",
    titleEn: "CTO & Co-Founder",
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
    descriptionEn: "Architected serverless SaaS platform for multi-channel chatbot automation (WhatsApp, Telegram, Instagram). Implemented custom authentication system, JSON-based flow processing engine, and AWS Lambda infrastructure with PostgreSQL. Built no-code visual automation workflow builder.",
  },
  {
    id: "freelance-design",
    title: "Designer Freelancer",
    titleEn: "Freelance Graphic Designer",
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
    descriptionEn: "Managed end-to-end design projects for multiple clients, maintaining 98.7% satisfaction rate. Developed visual identities, promotional materials and motion graphics, coordinating deliveries and stakeholder communication.",
  },
  {
    id: "vix-logistica",
    title: "Auxiliar Administrativo (Menor Aprendiz)",
    titleEn: "Administrative Assistant (Apprentice)",
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
    descriptionEn: "Performed administrative and warehouse control duties, creating data spreadsheets and managing inventory, demonstrating organizational skills and attention to detail in a corporate setting.",
  },
  {
    id: "include-gurias-work",
    title: "Desenvolvedor - Bolsa de Pesquisa",
    titleEn: "Research Scholar - Developer",
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
    descriptionEn: "Architected fullstack institutional platform with custom headless CMS. Implemented authentication system, interactive chatbot, and admin dashboard with complete CRUD for educational content and member management.",
  },
  {
    id: "comunica-mulher-work",
    title: "Desenvolvedor - Bolsa de Pesquisa",
    titleEn: "Research Scholar - Developer",
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
    descriptionEn: "Built complaint management system with complete moderation workflow. Implemented intake pipeline with validation and sanitization, granular Supabase RLS policies, and admin dashboard with advanced filters. Security-focused architecture with complete audit trail.",
  },
];
