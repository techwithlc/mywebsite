import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface EmbedFacadeProps {
  embedUrl: string;
  title: string;
  type: 'spotify' | 'youtube';
  thumbnailUrl?: string;
  externalLink?: string;
}

const EmbedFacade: React.FC<EmbedFacadeProps> = ({
  embedUrl,
  title,
  type,
  thumbnailUrl,
  externalLink,
}) => {
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);

  const loadEmbed = () => {
    setIsLoaded(true);
  };

  const handleClick = () => {
    if (externalLink) {
      window.open(externalLink, '_blank', 'noopener,noreferrer');
    } else {
      loadEmbed();
    }
  };

  if (isLoaded) {
    return (
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        allow={
          type === 'spotify'
            ? 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
            : 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        }
        loading="lazy"
        className="h-full w-full"
        style={{ minHeight: '220px' }}
      />
    );
  }

  return (
    <div
      className="relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 transition-all hover:from-gray-50 hover:to-white"
      style={{ minHeight: '220px' }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleClick();
      }}
      role="button"
      aria-label={
        externalLink
          ? `Visit ${type}: ${title}`
          : `Load ${type} embed: ${title}`
      }
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          handleClick();
        }
      }}
    >
      {/* Thumbnail background */}
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt={`${title} thumbnail`}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      )}

      {/* Play button */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110">
          <PlayCircle
            className={`h-10 w-10 ${
              type === 'spotify' ? 'text-green-500' : 'text-red-500'
            }`}
          />
        </div>
        <span className="text-sm font-medium text-gray-600">
          {externalLink ? t.embedFacade.open : t.embedFacade.play}
        </span>
      </div>

      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/70 to-transparent p-4">
        <p className="text-center text-sm font-medium text-white">{title}</p>
      </div>
    </div>
  );
};

export default EmbedFacade;
