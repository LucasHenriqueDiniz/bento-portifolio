/**
 * Projects Data
 *
 * Featured projects with real data showcasing technical breadth and impact.
 * Used by EnhancedProjectCard component for the portfolio homepage.
 */

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  highlight: string;
  url?: string;
  wip?: boolean;
}

export const featuredProjects: Project[] = [
  {
    name: "Weeb Profile",
    description:
      "Sistema de SVGs dinamicos para GitHub com integracao de Last.fm, MyAnimeList e GitHub via automacoes.",
    techStack: ["Node.js", "TypeScript", "API Integration", "Automation"],
    highlight:
      "Pipeline automatizado de coleta, processamento e render com foco em cache e consistencia de dados.",
    url: "https://weeb-profile-web-client.vercel.app/",
    wip: true,
  },
  {
    name: "QuizHub",
    description:
      "Plataforma de quizzes com ranking em tempo real, editor colaborativo e pipeline de ingestao de questoes com suporte a IA.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "LLM Integration",
    ],
    highlight:
      "Modelagem relacional complexa com metricas agregadas e fluxo continuo de normalizacao de conteudo.",
    url: "https://quizhub.com.br/",
    wip: true,
  },
  {
    name: "ItemMarketCap",
    description:
      "Plataforma de analytics para mercado Steam com coleta multi-API, comparativos e watchlists personalizadas.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Redis",
      "API Integration",
      "Data Processing",
    ],
    highlight:
      "Pipeline de normalizacao em tempo real com cache inteligente para consultas frequentes e dashboards comparativos.",
    url: "https://item-marketcap.vercel.app/",
    wip: true,
  },
];
