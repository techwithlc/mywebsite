import React, { useState } from 'react';
import { Coffee, Heart, ExternalLink, X } from 'lucide-react';
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
    <div className={`${compact ? 'p-4' : 'p-6 md:p-8'} space-y-6`}>
      {!compact && (
        <div className="mb-6 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg shadow-rose-500/20">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h3 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
            {t.sponsor.title}
          </h3>
          <p className="text-sm text-gray-600 md:text-base">
            {t.sponsor.description}
          </p>
        </div>
      )}

      <div className="mx-auto max-w-md">
        {/* Buy Me a Coffee */}
        <button
          onClick={handleSponsorClick}
          className="group flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-amber-300 hover:shadow-lg transition-all"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
            <Coffee className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="text-sm font-bold text-gray-900 md:text-base">
              {t.sponsor.buyMeCoffee}
            </h4>
            <p className="text-xs text-gray-500 md:text-sm">{t.sponsor.buyMeCoffeeLabel}</p>
          </div>
          <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* Thank you message */}
      {showThankYou && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
          <p className="text-sm font-semibold text-emerald-700 md:text-base">
            {t.sponsor.thanks}
          </p>
        </div>
      )}

      {compact && (
        <p className="text-center text-xs text-gray-500 md:text-sm">
          {t.sponsor.description}
        </p>
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
