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
    <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <Globe className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
        <p className="text-indigo-600 font-medium">Website Preview</p>
      </div>
    </div>
  );

  return (
    <div className="bg-[#faf9f7] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-[#e8e4df] flex flex-col h-full group">
      {/* Website Preview Section */}
      <div className="flex-shrink-0 h-[300px] w-full relative group overflow-hidden">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full relative overflow-hidden"
        >
          {thumbnailUrl && !imageError ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-[#ede9e4] animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
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
          className="hover:text-indigo-600 transition-colors"
        >
          <h3 className="text-xl font-bold mb-3 text-gray-900 transition-colors">
            {title}
          </h3>
        </a>
        <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {tech.map((tag) => (
            <span
              key={tag}
              className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-200"
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