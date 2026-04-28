/**
 * Academic Experience data structure
 * @interface AcademicExperience
 * @property {string} id - Unique identifier
 * @property {string} institution - Name of the educational institution
 * @property {string} degree - Degree or certification obtained
 * @property {string} field - Field of study
 * @property {string} startDate - Start date (e.g., "2020-03")
 * @property {string | null} endDate - End date or null if ongoing
 * @property {string} location - Location of the institution
 * @property {string} description - Description of studies
 * @property {string[]} highlights - List of key subjects or achievements
 * @property {boolean} showInTimeline - Whether to show in timeline (hide low-value experiences)
 * @property {string} [url] - Optional institution URL
 * @property {string} [logo] - Optional institution logo URL
 */
export interface AcademicExperience {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  location: string;
  description: string;
  highlights: string[];
  showInTimeline: boolean;
  url?: string;
  logo?: string;
}

/**
 * List of academic experiences
 */
export const academicExperiences: AcademicExperience[] = [
  {
    id: "unicv",
    institution: "UNICV",
    degree: "Bachelor's Degree",
    field: "Engenharia de Software",
    startDate: "2025-02",
    endDate: null, // Ongoing
    location: "Porto Alegre, Brazil",
    description: "Foco em arquitetura de sistemas robustos, desenvolvimento escalável e implementação de metodologias ágeis. Aprofundamento em padrões de design e engenharia de software moderna.",
    highlights: [
      "Software Architecture",
      "Web Development",
      "Agile Methods",
      "Database Design",
    ],
    showInTimeline: true,
    url: "https://www.unicv.edu.br/",
    logo: "/timeline/unicive.webp",
  },
  {
    id: "comunica-mulher-bolsa",
    institution: "ComunicaMulher",
    degree: "Scholarship",
    field: "Full Stack Development",
    startDate: "2025-08",
    endDate: null, // Ongoing
    location: "Remote",
    description: "Desenvolvi sistema de gestão de reclamações com workflow de moderação completo. Implementei pipeline de intake com validações e sanitização, políticas RLS granulares no Supabase, e painel administrativo com filtros avançados.",
    highlights: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Social Impact",
    ],
    showInTimeline: true,
    url: "https://reclame-mulher.vercel.app/",
    logo: "/timeline/hubspot_academy_logo.webp", // Using HubSpot as placeholder for ComunicaMulher
  },
  {
    id: "uergs",
    institution: "UERGS - Universidade Estadual do Rio Grande do Sul",
    degree: "Bachelor's Degree",
    field: "Engenharia da Computação",
    startDate: "2023-02",
    endDate: "2025-01",
    location: "Porto Alegre, Brazil",
    description: "Participei de projetos acadêmicos focados em programação de baixo nível, desenvolvimento de algoritmos e sistemas embarcados. Experiência prática com microcontroladores e fundamentos de inteligência artificial.",
    highlights: [
      "C Programming",
      "Python",
      "Microcontrollers",
      "Assembly",
    ],
    showInTimeline: true,
    url: "https://www.uergs.edu.br/",
    logo: "/timeline/uergs.webp",
  },
  {
    id: "include-gurias-bolsa",
    institution: "UERGS",
    degree: "Scholarship",
    field: "Include Gurias Project",
    startDate: "2023-06",
    endDate: "2024-01",
    location: "Remote",
    description: "Arquitetei plataforma institucional fullstack com CMS headless customizado. Implementei sistema de autenticação, chatbot interativo, e painel administrativo com CRUD completo para gestão de conteúdo educativo e membros.",
    highlights: [
      "Figma",
      "Web Development",
      "AWS",
      "Inclusion",
    ],
    showInTimeline: true,
    url: "https://www.uergs.edu.br/",
    logo: "/timeline/include-gurias.webp",
  },
  {
    id: "uniritter",
    institution: "UniRitter",
    degree: "Incomplete",
    field: "Medicina Veterinária",
    startDate: "2020-02",
    endDate: "2023-12",
    location: "Porto Alegre, Brazil",
    description: "Formação sólida em ciências biológicas e desenvolvimento de competências analíticas. Experiência que fortaleceu disciplina, resiliência e pensamento crítico aplicado à resolução de problemas.",
    highlights: [
      "Biological Sciences",
      "Analytical Skills",
      "Critical Thinking",
    ],
    showInTimeline: false, // Hide low-value experience
    url: "https://www.uniritter.edu.br/",
    logo: "/timeline/uniritter.webp",
  },
];
