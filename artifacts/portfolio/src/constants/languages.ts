/**
 * Language proficiency data structure
 * @interface Language
 * @property {string} name - Language name
 * @property {string} code - ISO 639-1 language code (e.g., "en", "pt")
 * @property {string} proficiency - Proficiency level (native, fluent, advanced, intermediate, basic)
 * @property {string} [description] - Optional description of proficiency
 */
export interface Language {
  name: string;
  code: string;
  proficiency: "native" | "fluent" | "advanced" | "intermediate" | "basic";
  description?: string;
}

/**
 * List of languages spoken
 */
export const languages: Language[] = [
  {
    name: "Portuguese",
    code: "pt",
    proficiency: "native",
    description: "Native speaker",
  },
  {
    name: "English",
    code: "en",
    proficiency: "fluent",
    description: "Professional working proficiency",
  },
  {
    name: "Spanish",
    code: "es",
    proficiency: "intermediate",
    description: "Conversational proficiency",
  },
];
