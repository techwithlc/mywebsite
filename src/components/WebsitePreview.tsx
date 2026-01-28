import React, { useState } from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface WebsitePreviewProps {
  title: string;
  description: string;
  url: string;
  tech: string[];
  thumbnailUrl?: string;
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({
  title,
  description,
  url,
  tech,
  thumbnailUrl,
}) => {
  const { t } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const defaultThumbnail = (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
      <div className="text-center">
        <Globe className="mx-auto mb-3 h-12 w-12 text-emerald-500" />
        <p className="text-xs font-medium text-gray-500">{t.websitePreview.preview}</p>
      </div>
    </div>
  );

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300">
      {/* Website Preview Section */}
      <div className="relative h-[220px] w-full flex-shrink-0 overflow-hidden bg-gray-100">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full w-full relative overflow-hidden"
        >
          {thumbnailUrl && !imageError ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                </div>
              )}
              <img
                src={thumbnailUrl}
                alt={`${title} website preview`}
                className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-110 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            defaultThumbnail
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 text-sm text-white">
                <ExternalLink className="h-4 w-4" />
                <span className="font-medium">{t.websitePreview.visit}</span>
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* Content Section */}
      <div className="flex flex-grow flex-col p-6">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-emerald-600 transition-colors"
        >
          <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors">
            {title}
          </h3>
        </a>
        <p className="mb-4 flex-grow text-sm leading-relaxed text-gray-600">
          {description}
        </p>
        <div className="mt-auto flex flex-wrap gap-2">
          {tech.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebsitePreview;
