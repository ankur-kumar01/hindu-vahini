import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image, url }) {
  const siteTitle = "HinduVahini";
  const fullTitle = `${title} | ${siteTitle}`;
  const defaultDescription = "HinduVahini is a cultural NGO dedicated to preserving our rich heritage, advancing educational empowerment, and creating a sustainable positive impact on society.";
  const metaDescription = description || defaultDescription;
  const siteUrl = "https://hinduvahini.online";
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const metaImage = image ? `${siteUrl}${image}` : `${siteUrl}/our_vision.jpeg`;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* OpenGraph Tagset (Facebook/WhatsApp) */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Canonical Link */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
}
