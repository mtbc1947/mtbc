import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description }) => {
  const location = useLocation();
  const canonicalUrl = `https://www.maidenheadtownbc.com${location.pathname}`;

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default SEO;
