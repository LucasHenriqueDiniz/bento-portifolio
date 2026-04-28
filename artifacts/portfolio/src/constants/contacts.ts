/**
 * Contact information data structure
 * @interface Contact
 * @property {string} platform - Platform name (e.g., "Instagram", "Discord", "GitHub")
 * @property {string} label - Display label
 * @property {string} username - Username or handle
 * @property {string} url - Full URL to profile
 * @property {string} description - Short description
 * @property {string} color - Brand color for the platform
 * @property {string} [gradient] - Optional gradient for platforms like Instagram
 * @property {string} [icon] - Icon identifier (for react-icons)
 */
export interface Contact {
  platform: string;
  label: string;
  username: string;
  url: string;
  description: string;
  color: string;
  gradient?: string;
  icon: string;
}

/**
 * List of contact/social media links
 */
export const contacts: Contact[] = [
  {
    platform: "Instagram",
    label: "@lucasdinizostroski",
    username: "lucasdinizostroski",
    url: "https://instagram.com/lucasdinizostroski",
    description: "Photos & daily updates",
    color: "#E4405F",
    gradient: "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
    icon: "SiInstagram",
  },
  {
    platform: "Discord",
    label: "Lucas Diniz",
    username: "228562465351270401", // Discord User ID
    url: "https://discord.com/users/228562465351270401",
    description: "Chat with me on Discord",
    color: "#5865f2",
    icon: "SiDiscord",
  },
  {
    platform: "GitHub",
    label: "LucasHenriqueDiniz",
    username: "LucasHenriqueDiniz",
    url: "https://github.com/LucasHenriqueDiniz",
    description: "Check out my code",
    color: "#111",
    icon: "SiGithub",
  },
  {
    platform: "LinkedIn",
    label: "Lucas Diniz Ostroski",
    username: "lucas-diniz-ostroski",
    url: "https://www.linkedin.com/in/lucas-diniz-ostroski/",
    description: "Professional network",
    color: "#0077b5",
    icon: "SiLinkedin",
  },
  {
    platform: "Email",
    label: "Get in touch",
    username: "lucashdo@protonmail.com",
    url: "mailto:lucashdo@protonmail.com",
    description: "Send me an email",
    color: "#ea4335",
    icon: "FiMail",
  },
];

/**
 * Get contact by platform name
 * @param platform - Platform name to search for
 * @returns Contact object or undefined if not found
 */
export const getContactByPlatform = (platform: string): Contact | undefined => {
  return contacts.find((c) => c.platform.toLowerCase() === platform.toLowerCase());
};

/**
 * Get primary contacts (top 4 for display)
 */
export const primaryContacts = contacts.slice(0, 4);
