export interface Certificate {
  title: string;
  issuer: string;
  issueDate: string; // YYYY-MM
  url?: string;
  skills: string[];
}

export interface AcademicExperience {
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

export const academicExperiences: AcademicExperience[] = [
  {
    id: "uergs",
    title: "Engenharia da Computação",
    titleEn: "Computer Engineering",
    institution: "UERGS - Universidade Estadual do Rio Grande do Sul",
    url: "https://www.uergs.edu.br/",
    startDate: "2023-02",
    endDate: "2025-01",
    showInTimeline: true,
    icon: "/timeline/uergs.webp",
    topTags: [
      { label: "Academic" },
      { label: "UERGS" },
    ],
    tags: [
      { label: "C" },
      { label: "Python" },
      { label: "Microcontrollers" },
      { label: "Assembly" },
    ],
    description: "Participei de projetos acadêmicos focados em programação de baixo nível, desenvolvimento de algoritmos e sistemas embarcados. Experiência prática com microcontroladores e fundamentos de IA.",
    descriptionEn: "Participated in academic projects focused on low-level programming, algorithm development and embedded systems. Hands-on experience with microcontrollers and AI fundamentals.",
  },
  {
    id: "unicv",
    title: "Engenharia de Software",
    titleEn: "Software Engineering",
    institution: "UNICV",
    url: "https://www.unicv.edu.br/",
    startDate: "2025-02",
    endDate: null,
    showInTimeline: true,
    icon: "/timeline/unicive.webp",
    topTags: [
      { label: "Academic" },
      { label: "UNICV" },
    ],
    tags: [
      { label: "Software Engineering" },
      { label: "Web Development" },
      { label: "Agile Methods" },
      { label: "Databases" },
      { label: "Software Architecture" },
    ],
    description: "Foco em arquitetura robusta de sistemas, desenvolvimento escalável e implementação de metodologia ágil. Imersão profunda em padrões de design e engenharia de software moderna.",
    descriptionEn: "Focus on robust system architecture, scalable development and agile methodology implementation. Deep dive into design patterns and modern software engineering.",
  },
  {
    id: "belart-estetica",
    title: "Ensino Técnico, Massoterapia",
    institution: "Belart Escola de Estética",
    url: "",
    startDate: "2021-01",
    endDate: "2022-12",
    showInTimeline: false,
    icon: "GraduationCap",
    topTags: [
      { label: "Academic" },
      { label: "Technical" },
    ],
    tags: [
      { label: "Therapeutic massage" },
      { label: "Client relations" },
    ],
    description: "Treinamento técnico em terapia de massagem focando em técnicas terapêuticas e relação com cliente.",
  },
  {
    id: "jovem-profissional-necropsia",
    title: "Auxiliar Necropsia",
    institution: "Escola Técnica e Faculdade Jovem Profissional Porto Alegre",
    url: "",
    startDate: "2020-01",
    endDate: "2022-12",
    showInTimeline: false,
    icon: "GraduationCap",
    topTags: [
      { label: "Academic" },
      { label: "Technical" },
    ],
    tags: [
      { label: "Forensics" },
      { label: "Human anatomy" },
      { label: "Technical presentations" },
    ],
    description: "Treinamento técnico como auxiliar de necropsia com conhecimento em perícia, anatomia humana e apresentações técnicas.",
  },
  {
    id: "uniritter",
    title: "Medicina Veterinária",
    institution: "UniRitter",
    url: "https://www.uniritter.edu.br/",
    startDate: "2020-02",
    endDate: "2023-12",
    showInTimeline: false,
    icon: "/timeline/uniritter.webp",
    topTags: [
      { label: "Academic" },
      { label: "UniRitter" },
    ],
    tags: [
      { label: "Veterinary" },
    ],
    description: "Forte fundação em ciências biológicas e desenvolvimento de habilidades analíticas. Experiência que fortaleceu disciplina, resiliência e pensamento crítico aplicado à resolução de problemas.",
  },
];

export const certificates: Certificate[] = [
  {
    title: "Career Essentials in Software Development by Microsoft and LinkedIn",
    issuer: "Microsoft / LinkedIn Learning",
    issueDate: "2024-11",
    url: "https://www.linkedin.com/learning/certificates/a12843799e16406ce15f775df2deb9c4bd3d4d8945e6fb1da9f3284d95587304",
    skills: ["Software Development"],
  },
  {
    title: "Vibe Coding L1: Bronze",
    issuer: "Lovable",
    issueDate: "2026-02",
    url: "https://www.linkedin.com/in/lucas-diniz-ostroski/details/certifications/",
    skills: ["AI-Assisted Development", "Prompt Engineering"],
  },
  {
    title: "Curso de Japonês (JLPT N5)",
    issuer: "Tokyo Sakura Gaoka Institute",
    issueDate: "2026-02",
    url: "/documents/tokyo-sakura-gaoka.pdf",
    skills: ["Japonês"],
  },
  {
    title: "EF SET English Certificate (C2 Proficiency)",
    issuer: "EF SET",
    issueDate: "2024-11",
    url: "https://cert.efset.org/pt/LfJe4z",
    skills: ["English"],
  },
  {
    title: "Programming Foundations: Beyond the Fundamentals",
    issuer: "LinkedIn Learning",
    issueDate: "2024-11",
    url: "https://www.linkedin.com/learning/certificates/8e7943eeaac7618d975c75a4d14cb1db48162719150fbd0b2cc3904257c862dc",
    skills: ["Programming"],
  },
  {
    title: "The Complete 2023 Web Development Bootcamp",
    issuer: "Udemy",
    issueDate: "2023-12",
    url: "https://www.udemy.com/certificate/UC-da83b504-6441-4ffd-8968-91d25f25a19f/",
    skills: ["Web Development"],
  },
  {
    title: "Digital Advertising Certification: Develop a Winning Online Advertising Strategy",
    issuer: "HubSpot Academy",
    issueDate: "2025-01",
    url: "https://app.hubspot.com/academy/achievements/cn50rk94/en/1/amayacrab-na/digital-advertising",
    skills: ["Digital Advertising", "Marketing", "Social Media Advertising", "Google Ads"],
  },
];
