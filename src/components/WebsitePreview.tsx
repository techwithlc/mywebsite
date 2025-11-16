import React, { useState } from 'react';
import { ExternalLink, Globe } from 'lucide-react';

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
  thumbnailUrl
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const defaultThumbnail = (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <div className="text-center">
        <Globe className="mx-auto mb-3 h-12 w-12 text-cyan-300" />
        <p className="text-xs font-medium text-slate-300">Website Preview</p>
      </div>
    </div>
  );

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 shadow-card hover:border-cyan-400/70 hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all duration-300">
      {/* Website Preview Section */}
      <div className="relative h-[260px] w-full flex-shrink-0 overflow-hidden">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full relative overflow-hidden"
        >
          {thumbnailUrl && !imageError ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
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
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 text-sm text-slate-50">
                <ExternalLink className="h-4 w-4" />
                <span className="font-medium">Visit Website</span>
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* Content Section */}
      <div className="flex flex-grow flex-col p-5">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-cyan-300 transition-colors"
        >
          <h3 className="mb-2 text-lg font-semibold text-slate-50 transition-colors">
            {title}
          </h3>
        </a>
        <p className="mb-4 flex-grow text-sm leading-relaxed text-slate-300/85">
          {description}
        </p>
        <div className="mt-auto flex flex-wrap gap-2">
          {tech.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[0.7rem] font-medium text-slate-200"
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