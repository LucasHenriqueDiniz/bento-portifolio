import { ContactLinks } from "./contacts";

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lucas Diniz",
  url: ContactLinks.website,
  image: "https://lucashdo.com/ogImage.png",
  jobTitle: "Software Engineer",
  worksFor: { "@type": "Organization", name: "Appmax" },
  email: ContactLinks.email,
  sameAs: [ContactLinks.github, ContactLinks.linkedin, ContactLinks.instagram],
};
