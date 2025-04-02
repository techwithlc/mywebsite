import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react'; // Using Play icon for visual cue

interface EmbedFacadeProps {
  embedUrl: string;
  title: string;
  type: 'spotify' | 'youtube';
  thumbnailUrl?: string; // Optional: For a custom thumbnail
}

const EmbedFacade: React.FC<EmbedFacadeProps> = ({ embedUrl, title, type, thumbnailUrl }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const loadEmbed = () => {
    setIsLoaded(true);
  };

  // Basic placeholder styling - adjust as needed
  const placeholderStyle: React.CSSProperties = {
    position: 'relative',
    cursor: 'pointer',
    overflow: 'hidden',
    backgroundColor: '#374151', // gray-700
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%', // Ensure it fills the container
    minHeight: '352px', // Match the height used in App.tsx
    borderRadius: '0.5rem', // rounded-lg
  };

  const playIconStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    opacity: 0.8,
    transition: 'opacity 0.3s ease',
  };

  const titleStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '1rem',
    left: '1rem',
    right: '1rem',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 500,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '0.5rem',
    borderRadius: '0.25rem',
  };

  if (isLoaded) {
    return (
      <iframe
        src={embedUrl}
        width="100%"
        height="100%" // Ensure iframe also fills container
        frameBorder="0"
        allowFullScreen
        allow={type === 'spotify'
          ? "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          : "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        }
        loading="lazy" // Still good practice, though facade handles initial load
        className="w-full h-full" // Use Tailwind classes if preferred and configured
        style={{ minHeight: '352px' }} // Ensure iframe has min height too
      />
    );
  }

  return (
    <div
      style={placeholderStyle}
      onClick={loadEmbed}
      onMouseEnter={(e) => {
        const icon = e.currentTarget.querySelector('.play-icon') as HTMLElement;
        if (icon) icon.style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        const icon = e.currentTarget.querySelector('.play-icon') as HTMLElement;
        if (icon) icon.style.opacity = '0.8';
      }}
      role="button"
      aria-label={`Load ${type} embed: ${title}`}
      tabIndex={0} // Make it focusable
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') loadEmbed(); }} // Keyboard activation
    >
      {/* Optional: Add a background image thumbnail here if thumbnailUrl is provided */}
      {thumbnailUrl && (
        <img src={thumbnailUrl} alt={`${title} thumbnail`} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
      )}
      <PlayCircle className="play-icon w-16 h-16" style={playIconStyle} />
      <div style={titleStyle}>{title}</div>
    </div>
  );
};

export default EmbedFacade;
