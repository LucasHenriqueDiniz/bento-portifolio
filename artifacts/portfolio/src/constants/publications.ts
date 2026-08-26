export interface Publication {
  title: string;
  venue?: string;
  year?: string;
  url?: string;
}

export const publications: Publication[] = [
  {
    title: "ChatBot Include Gurias: Conhecendo Mulheres das Ciências Exatas",
  },
];

export function formatPublicationSource(publication: Publication): string {
  return [publication.venue, publication.year].filter(Boolean).join(", ");
}
