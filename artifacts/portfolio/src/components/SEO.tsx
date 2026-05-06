import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  url?: string;
  lang?: string;
  noindex?: boolean;
}

const defaultTitle = "Lucas Diniz — Full-stack Developer";
const defaultDescription =
  "Portfolio de Lucas Diniz — Desenvolvedor full-stack apaixonado por código, design e transformar ideias em realidade.";
const defaultImage = "https://lucashdo.com/ogImage.png";
const siteUrl = "https://lucashdo.com";

export default function SEO({
  title,
  description,
  image,
  type = "website",
  url,
  lang = "pt-BR",
  noindex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} — Lucas Diniz` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const metaImage = image || defaultImage;
  const metaUrl = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {noindex && <meta name="robots" content="noindex" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content="lucashdo" />
      <meta property="og:locale" content={lang.replace("-", "_")} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@lucashdo" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Canonical */}
      <link rel="canonical" href={metaUrl} />
    </Helmet>
  );
}
