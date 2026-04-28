/**
 * Job Experience data structure
 * @interface JobExperience
 * @property {string} id - Unique identifier
 * @property {string} company - Company name
 * @property {string} position - Job title/position
 * @property {string} startDate - Start date (e.g., "2023-01")
 * @property {string | null} endDate - End date or null if current
 * @property {string} location - Job location
 * @property {string} type - Employment type (full-time, part-time, contract, freelance, volunteer)
 * @property {string} description - Job description
 * @property {string[]} technologies - Technologies used
 * @property {boolean} showInTimeline - Whether to show in timeline (hide low-value experiences)
 * @property {string} [url] - Optional company URL
 * @property {string} [logo] - Optional company logo URL
 */
export interface JobExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  location: string;
  type: "full-time" | "part-time" | "contract" | "freelance" | "volunteer";
  description: string;
  technologies: string[];
  showInTimeline: boolean;
  url?: string;
  logo?: string;
}

/**
 * List of job experiences
 */
export const jobExperiences: JobExperience[] = [
  {
    id: "eng-futuro",
    company: "Engenharia do Futuro",
    position: "Desenvolvedor Full Stack",
    startDate: "2025-04",
    endDate: null, // Current
    location: "Remote",
    type: "full-time",
    description: "Arquitetei e implementei refatoração completa da plataforma e landing page, estabelecendo design system e guidelines. Desenvolvi sistema de instalação de firmware via Web Serial API, automatizando processo de flash e comunicação serial diretamente no navegador.",
    technologies: ["React", "TypeScript", "Python", "Microcontrollers"],
    showInTimeline: true,
    url: "https://engenhariadofuturo.com.br/",
    logo: "/timeline/seu-iot-logo.jpg",
  },
  {
    id: "bots-channel",
    company: "Bots Channel",
    position: "CTO & Co-Founder",
    startDate: "2024-01",
    endDate: "2024-12",
    location: "Remote",
    type: "full-time",
    description: "Arquitetei plataforma SaaS serverless para automação de chatbots multi-canal (WhatsApp, Telegram, Instagram). Implementei sistema de autenticação customizado, engine de processamento de fluxos JSON-based, e infraestrutura AWS Lambda com PostgreSQL. Desenvolvi interface no-code para construção visual de automações.",
    technologies: ["React", "Node.js", "AWS", "Prisma", "Zustand", "TypeScript"],
    showInTimeline: true,
    url: "https://botschannel.com/",
    logo: "/timeline/botschanell-logo.webp",
  },
  {
    id: "eng-futuro-vol",
    company: "Engenharia do Futuro",
    position: "Desenvolvedor Voluntário",
    startDate: "2023-05",
    endDate: "2024-02",
    location: "Remote",
    type: "volunteer",
    description: "Conduzi workshop técnico de Front-End para a equipe, cobrindo arquitetura e padrões de código. Desenvolvi firmware embarcado, interface web e API backend, integrando hardware com aplicação fullstack.",
    technologies: ["React", "Node.js", "Microcontrollers", "TypeScript", "Python", "C", "ViteJS"],
    showInTimeline: true,
    url: "https://engenhariadofuturo.com.br/",
    logo: "/timeline/seu-iot-logo.jpg",
  },
  {
    id: "freelance-design",
    company: "Autônomo",
    position: "Designer Freelancer",
    startDate: "2019-01",
    endDate: "2020-12",
    location: "Remote",
    type: "freelance",
    description: "Gerenciei projetos de design end-to-end para múltiplos clientes, mantendo 98.7% de satisfação. Desenvolvi identidades visuais, materiais promocionais e motion graphics, coordenando entregas e comunicação com stakeholders.",
    technologies: ["Photoshop", "Illustrator", "After Effects", "Design Gráfico"],
    showInTimeline: true,
    url: "https://www.linkedin.com/in/lucas-diniz-ostroski/",
    logo: "/timeline/linkedin_logo.webp",
  },
  {
    id: "vix-logistica",
    company: "Vix Logística",
    position: "Auxiliar Administrativo (Menor Aprendiz)",
    startDate: "2017-02",
    endDate: "2019-02",
    location: "On-site",
    type: "part-time",
    description: "Exerci funções administrativas e de controle de almoxarifado, desenvolvendo planilhas de dados e gestão de estoque, demonstrando habilidades organizacionais e atenção a detalhes em ambiente corporativo.",
    technologies: ["Excel", "Gestão de Estoque", "Administração"],
    showInTimeline: false, // Hide low-value experience
    url: "https://www.linkedin.com/company/vix-logistica/",
  },
];
