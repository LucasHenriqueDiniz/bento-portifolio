export const ContactLinks = {
  instagram: 'https://www.instagram.com/lucasdinizostroski/',
  linkedin: 'https://www.linkedin.com/in/lucas-diniz-ostroski/',
  discord: 'amayacrab',
  website: 'https://www.lucashdo.com/',
  email: 'lucashdo@protonmail.com',
  steam: 'https://steamcommunity.com/id/Amayacrab/',
  github: 'https://github.com/LucasHenriqueDiniz',
  whatsapp: 'https://wa.me/5551995245504',
};

// Type for contact links
export type ContactLinkType = keyof typeof ContactLinks;

// Social media display names
export const ContactNames = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  discord: 'Discord',
  website: 'Website',
  email: 'Email',
  steam: 'Steam',
  github: 'GitHub',
};

// Array format for compatibility with SocialCard component
export const contacts = [
  { platform: 'Discord', url: ContactLinks.discord, label: 'amayacrab', color: '#5865F2' },
  { platform: 'Instagram', url: ContactLinks.instagram, label: 'lucasdinizostroski', color: '#E4405F' },
  { platform: 'GitHub', url: ContactLinks.github, label: 'LucasHenriqueDiniz', color: '#333' },
  { platform: 'LinkedIn', url: ContactLinks.linkedin, label: 'lucas-diniz-ostroski', color: '#0A66C2' },
  { platform: 'Email', url: `mailto:${ContactLinks.email}`, label: ContactLinks.email, color: '#EA4335' },
  { platform: 'Steam', url: ContactLinks.steam, label: 'Amayacrab', color: '#1b2838' },
];
