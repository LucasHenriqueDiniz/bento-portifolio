/**
 * Academic timeline data for the TimelineCard component.
 *
 * Job entries are NOT duplicated here — TimelineCard reads them straight from
 * `jobExperiences`, which is the single source of truth shared with /resume
 * and the PDF export.
 */

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

export const timelineAcademicExperiences: TimelineAcademicExperience[] = [
  {
    id: "unicv",
    degree: "Engenharia de Software",
    field: "Computer Software Engineering",
    institution: "UNICV - Centro Universitário Cidade Verde",
    location: "Brasil",
    startDate: "2025-02",
    endDate: null,
    description:
      "Foco em arquitetura de sistemas robustos, desenvolvimento escalável e implementação de metodologias ágeis. Aprofundamento em padrões de design e engenharia de software moderna. Conclusão prevista para 2027.",
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
