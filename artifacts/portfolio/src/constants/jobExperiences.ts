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
    description: "• Refactored platform and landing page, establishing design system and component guidelines\n• Built Web Serial firmware installer for browser-based flashing and serial communication\n• Automated IoT device onboarding pipeline reducing setup time by 60%",
    descriptionEn: "• Refactored platform and landing page, establishing design system and component guidelines\n• Built Web Serial firmware installer for browser-based flashing and serial communication\n• Automated IoT device onboarding pipeline reducing setup time by 60%",
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
    description: "• Led technical Front-End workshops covering architecture and code patterns\n• Developed embedded firmware, web interface and backend API\n• Integrated microcontroller hardware with fullstack application",
    descriptionEn: "• Led technical Front-End workshops covering architecture and code patterns\n• Developed embedded firmware, web interface and backend API\n• Integrated microcontroller hardware with fullstack application",
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
    description: "• Architected serverless SaaS for multi-channel chatbot automation (WhatsApp, Telegram, Instagram)\n• Implemented custom auth system and JSON-based flow processing engine\n• Built AWS Lambda infrastructure with PostgreSQL and no-code visual workflow builder",
    descriptionEn: "• Architected serverless SaaS for multi-channel chatbot automation (WhatsApp, Telegram, Instagram)\n• Implemented custom auth system and JSON-based flow processing engine\n• Built AWS Lambda infrastructure with PostgreSQL and no-code visual workflow builder",
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
    description: "• Managed end-to-end design projects for multiple clients with 98.7% satisfaction rate\n• Developed visual identities, promotional materials and motion graphics\n• Coordinated deliveries and stakeholder communication",
    descriptionEn: "• Managed end-to-end design projects for multiple clients with 98.7% satisfaction rate\n• Developed visual identities, promotional materials and motion graphics\n• Coordinated deliveries and stakeholder communication",
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
    description: "• Architected fullstack institutional platform with custom headless CMS\n• Implemented authentication system and interactive chatbot\n• Built admin dashboard with full CRUD for educational content and member management",
    descriptionEn: "• Architected fullstack institutional platform with custom headless CMS\n• Implemented authentication system and interactive chatbot\n• Built admin dashboard with full CRUD for educational content and member management",
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
    description: "• Built complaint management system with complete moderation workflow\n• Implemented intake pipeline with validation and sanitization\n• Designed granular Supabase RLS policies and admin dashboard with advanced filters",
    descriptionEn: "• Built complaint management system with complete moderation workflow\n• Implemented intake pipeline with validation and sanitization\n• Designed granular Supabase RLS policies and admin dashboard with advanced filters",
  },
];
