export interface JobExperience {
  id: string;
  title: string;
  titleEn?: string;
  institution: string;
  location?: string;
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
    id: "appmax",
    title: "Engenheiro de Software III",
    titleEn: "Software Engineer III",
    institution: "Appmax",
    url: "https://appmax.com.br/",
    startDate: "2026-08",
    endDate: null,
    showInTimeline: true,
    topTags: [
      { label: "Job" },
      { label: "Appmax" },
    ],
    tags: [
      { label: "Python" },
      { label: "TypeScript" },
      { label: "Go" },
      { label: "Dados" },
    ],
    description: "Time de Engenharia/Dados da Appmax, fintech de pagamentos.",
    descriptionEn: "Engineering/Data team at Appmax, a payments fintech.",
    icon: "/timeline/appmax.webp",
  },
  {
    id: "comunica-mulher-work",
    title: "Engenheiro Full-Stack — Bolsa de Pesquisa",
    titleEn: "Full-Stack Engineer — Research Fellowship",
    institution: "ComunicaMulher",
    url: "https://reclame-mulher.vercel.app/",
    startDate: "2025-12",
    endDate: null,
    showInTimeline: true,
    icon: "/timeline/comunicamulher.webp",
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
    description: "• Desenvolvi sistema de gestão de denúncias com fluxo completo de moderação\n• Implementei pipeline de recebimento com validação e sanitização dos dados\n• Modelei políticas RLS granulares no Supabase e painel administrativo com filtros avançados",
    descriptionEn: "• Built complaint management system with complete moderation workflow\n• Implemented intake pipeline with validation and sanitization\n• Designed granular Supabase RLS policies and admin dashboard with advanced filters",
  },
  {
    id: "policia-federal-it",
    title: "Estagiário de Tecnologia da Informação",
    titleEn: "Information Technology Intern",
    institution: "Polícia Federal",
    location: "Porto Alegre, Rio Grande do Sul, Brasil",
    startDate: "2026-05",
    endDate: "2026-08",
    showInTimeline: true,
    topTags: [
      { label: "Internship" },
      { label: "Policia Federal" },
    ],
    tags: [
      { label: "Automação" },
      { label: "IT Support" },
      { label: "Troubleshooting" },
      { label: "Documentation" },
    ],
    description: "• Automatizei fluxos administrativos e relacionados ao RH, reduzindo tarefas manuais repetitivas em rotinas internas\n• Desenvolvi e melhorei ferramentas e scripts internos para apoiar operações de TI, documentação e organização de processos\n• Apoiei troubleshooting, suporte a usuários, rotinas de sistemas e documentação técnica em ambiente institucional\n• Apliquei desenvolvimento de software, automação e análise de sistemas para melhorar a eficiência operacional",
    descriptionEn: "• Automated administrative and HR-related workflows, cutting repetitive manual work in internal routines\n• Built and improved internal tools and scripts supporting IT operations, documentation and process organization\n• Supported troubleshooting, user support, systems routines and technical documentation in an institutional environment\n• Applied software development, automation and systems analysis to improve operational efficiency",
    icon: "/timeline/policia-federal.png",
  },
  {
    id: "eng-futuro",
    title: "Engenheiro Full-Stack",
    titleEn: "Full-Stack Engineer",
    institution: "Engenharia do Futuro",
    location: "Porto Alegre, Rio Grande do Sul, Brasil",
    url: "https://engenhariadofuturo.com.br/",
    startDate: "2025-01",
    endDate: "2026-08",
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
      { label: "Flask" },
      { label: "PostgreSQL" },
      { label: "Web Serial API" },
    ],
    description: "• Liderei o refactor completo da plataforma e da landing page, melhorando estrutura, performance e experiência do usuário\n• Desenvolvi um instalador de firmware 100% web utilizando Web Serial (esptool-js), reduzindo o tempo de onboarding de ~35 minutos para ~5 minutos\n• Reestruturei a lógica do backend (Python/Flask + PostgreSQL), reduzindo requests redundantes e aumentando a eficiência do sistema em ~35%",
    descriptionEn: "• Led the complete refactor of the platform and landing page, improving structure, performance and user experience\n• Built a 100% web firmware installer using Web Serial (esptool-js), cutting device onboarding from ~35 minutes to ~5 minutes\n• Restructured the backend logic (Python/Flask + PostgreSQL), reducing redundant requests and improving system efficiency by ~35%",
  },
  {
    id: "bots-channel",
    title: "CTO & Co-Founder",
    titleEn: "CTO & Co-Founder",
    institution: "Bots Channel",
    location: "Porto Alegre, Rio Grande do Sul, Brasil",
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
      { label: "TypeScript" },
      { label: "React Flow" },
      { label: "PostgreSQL" },
      { label: "Supabase" },
      { label: "Node.js" },
    ],
    description: "• Desenvolvi uma plataforma full-stack para criação de chatbots com editor visual no-code baseado em fluxo\n• Implementei o frontend com React + TypeScript e React Flow para modelagem de lógica conversacional\n• Desenvolvi backend com APIs e persistência de estado (fluxos, usuários, execuções) utilizando PostgreSQL/Supabase\n• Integrei múltiplos canais (WhatsApp, Telegram, Instagram) via APIs externas\n• Estruturei autenticação e controle de acesso baseado em papéis (RBAC)\n• Lancei o MVP em poucas semanas, atingindo mais de 500 usuários no primeiro trimestre",
    descriptionEn: "• Built a full-stack platform for creating chatbots with a flow-based no-code visual editor\n• Implemented the frontend with React + TypeScript and React Flow for conversational logic modelling\n• Developed the backend with APIs and state persistence (flows, users, executions) on PostgreSQL/Supabase\n• Integrated multiple channels (WhatsApp, Telegram, Instagram) through external APIs\n• Structured authentication and role-based access control (RBAC)\n• Shipped the MVP in a few weeks, reaching over 500 users in the first quarter",
  },
  {
    id: "eng-futuro-vol",
    title: "Desenvolvedor de Software",
    titleEn: "Software Developer",
    institution: "Engenharia do Futuro",
    location: "Porto Alegre, Rio Grande do Sul, Brasil",
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
      { label: "TypeScript" },
      { label: "REST APIs" },
      { label: "Node.js" },
      { label: "Microcontrollers" },
    ],
    description: "• Desenvolvi dashboards com React + TypeScript para monitoramento e envio de comandos a dispositivos\n• Integrei APIs REST para comunicação em tempo real com hardware\n• Contribuí para a padronização de code review e melhoria do fluxo de desenvolvimento\n• Apoiei o onboarding de novos desenvolvedores com documentação e pair programming",
    descriptionEn: "• Built React + TypeScript dashboards for monitoring devices and sending them commands\n• Integrated REST APIs for real-time communication with hardware\n• Contributed to code review standardization and development workflow improvements\n• Supported onboarding of new developers through documentation and pair programming",
  },
  {
    id: "include-gurias-work",
    title: "Engenheiro Full-Stack — Bolsa de Pesquisa",
    titleEn: "Full-Stack Engineer — Research Fellowship",
    institution: "Include Gurias",
    location: "Porto Alegre, Rio Grande do Sul, Brasil",
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
      { label: "Next.js" },
      { label: "TypeScript" },
      { label: "Supabase" },
      { label: "SEO" },
      { label: "Figma" },
    ],
    description: "• Desenvolvi uma aplicação full-stack em Next.js + TypeScript transformando material pedagógico em experiência web interativa\n• Implementei visualização de conteúdo com carregamento otimizado e busca instantânea\n• Construí painel administrativo para gestão de conteúdo com Supabase\n• Otimizei performance, SEO e acessibilidade (Lighthouse >95)",
    descriptionEn: "• Built a full-stack Next.js + TypeScript application turning pedagogical material into an interactive web experience\n• Implemented content browsing with optimized loading and instant search\n• Built an admin dashboard for content management on Supabase\n• Optimized performance, SEO and accessibility (Lighthouse >95)",
  },
  {
    id: "freelance-design",
    title: "Designer Freelancer",
    titleEn: "Freelance Designer",
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
    description: "• Desenvolvi mais de 30 projetos de design e identidade visual\n• Mantive alta taxa de satisfação com entregas consistentes\n• Produzi materiais gráficos para web e impressão",
    descriptionEn: "• Delivered over 30 design and visual identity projects\n• Maintained a high satisfaction rate through consistent delivery\n• Produced graphic materials for both web and print",
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
];
