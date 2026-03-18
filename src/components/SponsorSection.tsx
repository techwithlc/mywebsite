import React, { useState } from 'react';
import { Coffee, ExternalLink, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SponsorSectionProps {
  compact?: boolean;
  showModal?: boolean;
  onClose?: () => void;
}

const SponsorSection: React.FC<SponsorSectionProps> = ({
  compact = false,
  showModal = false,
  onClose,
}) => {
  const { t } = useLanguage();
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSponsorClick = () => {
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);

    // Open Buy Me a Coffee link
    window.open(
      'https://buymeacoffee.com/techwithlc',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const SponsorContent = () => (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">{t.sponsor.description}</p>
      <button
        onClick={handleSponsorClick}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-amber-300 hover:text-amber-600 transition-colors"
      >
        <Coffee className="h-4 w-4" />
        {t.sponsor.buyMeCoffee}
        <ExternalLink className="h-3 w-3" />
      </button>
      {showThankYou && (
        <p className="text-sm text-emerald-600">{t.sponsor.thanks}</p>
      )}
    </div>
  );

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-2xl">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <SponsorContent />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl">
      <SponsorContent />
    </div>
  );
};

export default SponsorSection;
