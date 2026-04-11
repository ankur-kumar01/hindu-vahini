import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image, url }) {
  const siteTitle = "HinduVahini";
  const fullTitle = `${title} | ${siteTitle}`;
  const defaultDescription = "HinduVahini is a cultural NGO dedicated to preserving our rich heritage, advancing educational empowerment, and creating a sustainable positive impact on society.";
  const metaDescription = description || defaultDescription;
  
  // Base configuration
  const siteUrl = "https://hinduvahini.online";
  
  // Helper to ensure absolute URLs (crucial for WhatsApp/Facebook previews)
  const getAbsoluteUrl = (path, defaultPath) => {
    if (!path) return `${siteUrl}${defaultPath}`;
    if (path.startsWith('http')) return path; // Already absolute (e.g. external wikimedia or full server path)
    if (path.startsWith('/')) return `${siteUrl}${path}`; // Local relative path
    return `${siteUrl}/${path}`; // Fallback for names without slash
  };

  const fullUrl = getAbsoluteUrl(url, '');
  const metaImage = getAbsoluteUrl(image, '/our_vision.jpeg');

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
      <meta property="og:image:secure_url" content={metaImage} />
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
