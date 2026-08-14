import { ContactLinks } from "./contacts";

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lucas Diniz",
  url: ContactLinks.website,
  image: "https://lucashdo.com/ogImage.png",
  jobTitle: "Full Stack Developer",
  email: ContactLinks.email,
  sameAs: [ContactLinks.github, ContactLinks.linkedin, ContactLinks.instagram],
};
