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
    description: "Architected and implemented complete platform and landing page refactor, establishing design system and guidelines. Built firmware installation system using Web Serial API, automating flash process and serial communication directly in browser.",
  },
  {
    id: "eng-futuro-vol",
    title: "Desenvolvedor Voluntário",
    institution: "Engenharia do Futuro",
    url: "https://engenhariadofuturo.com.br/",
    startDate: "2023-05",
    endDate: "2024-02",
    showInTimeline: true,
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
    description: "Led technical Front-End workshop covering architecture and code patterns. Developed embedded firmware, web interface, and backend API, integrating hardware with fullstack application.",
  },
  {
    id: "bots-channel",
    title: "CTO & Co-Founder",
    institution: "Bots Channel",
    url: "https://botschannel.com/",
    startDate: "2024-01",
    endDate: "2024-12",
    showInTimeline: true,
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
    description: "Architected serverless SaaS platform for multi-channel chatbot automation (WhatsApp, Telegram, Instagram). Implemented custom authentication system, JSON-based flow processing engine, and AWS Lambda infrastructure with PostgreSQL. Built no-code interface for visual automation workflows.",
  },
  {
    id: "freelance-design",
    title: "Designer Freelancer",
    institution: "Autônomo",
    url: "https://www.linkedin.com/in/lucas-diniz-ostroski/",
    startDate: "2019-01",
    endDate: "2020-12",
    showInTimeline: true,
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
    description: "Managed end-to-end design projects for multiple clients, maintaining 98.7% satisfaction rate. Developed visual identities, promotional materials, and motion graphics, coordinating deliveries and stakeholder communication.",
  },
  {
    id: "vix-logistica",
    title: "Auxiliar Administrativo (Menor Aprendiz)",
    institution: "Vix Logística",
    url: "https://www.linkedin.com/company/vix-logistica/",
    startDate: "2017-02",
    endDate: "2019-02",
    showInTimeline: false,
    topTags: [
      { label: "Job" },
      { label: "Vix Logistics" },
    ],
    tags: [
      { label: "Warehouse" },
      { label: "Data Sheets" },
    ],
    description: "Performed administrative and warehouse control duties, creating data spreadsheets and managing inventory, demonstrating organizational skills and attention to detail in a corporate setting.",
  },
];
