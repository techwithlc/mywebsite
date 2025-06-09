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
    <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
      <div className="text-center">
        <Globe className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <p className="text-blue-300 font-medium">Website Preview</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800/50 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/10 flex flex-col h-full border border-gray-700/30">
      {/* Website Preview Section */}
      <div className="flex-shrink-0 h-[352px] w-full relative group">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full relative overflow-hidden"
        >
          {thumbnailUrl && !imageError ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-700/50 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <img
                src={thumbnailUrl}
                alt={`${title} website preview`}
                className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 text-white">
                <ExternalLink className="w-5 h-5" />
                <span className="font-medium">Visit Website</span>
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition-colors"
        >
          <h3 className="text-xl font-bold mb-2 transition-colors">
            {title}
          </h3>
        </a>
        <p className="text-gray-300 mb-4 flex-grow">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {tech.map((tag) => (
            <span
              key={tag}
              className="bg-blue-500/10 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-500/20"
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