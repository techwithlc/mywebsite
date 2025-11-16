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
  onClose 
}) => {
  const { t } = useLanguage();
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSponsorClick = () => {
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);

    // Open Buy Me a Coffee link
    window.open('https://buymeacoffee.com/techwithlc', '_blank', 'noopener,noreferrer');
  };

  const SponsorContent = () => (
    <div className={`${compact ? 'p-4' : 'p-6 md:p-8'} space-y-6`}>
      {!compact && (
        <div className="mb-6 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-fuchsia-500 shadow-[0_0_26px_rgba(56,189,248,0.7)]">
            <Heart className="h-8 w-8 text-slate-950" />
          </div>
          <h3 className="mb-3 text-2xl font-bold text-slate-50 md:text-3xl">
            {t.sponsor.title}
          </h3>
          <p className="text-sm text-slate-300/85 md:text-base">
            {t.sponsor.description}
          </p>
        </div>
      )}

      <div className="mx-auto max-w-md">
        {/* Buy Me a Coffee */}
        <button
          onClick={handleSponsorClick}
          className="group flex w-full items-center gap-4 rounded-2xl border border-cyan-400/70 bg-slate-950/90 p-5 shadow-[0_0_26px_rgba(56,189,248,0.55)] hover:border-fuchsia-400/70 hover:bg-slate-900 transition-all"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_0_20px_rgba(251,191,36,0.6)] group-hover:scale-110 transition-transform">
            <Coffee className="h-7 w-7 text-slate-950" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="text-sm font-bold text-slate-50 md:text-base">
              {t.sponsor.buyMeCoffee}
            </h4>
            <p className="text-xs text-slate-300/80 md:text-sm">
              Buy Me a Coffee
            </p>
          </div>
          <ExternalLink className="h-5 w-5 text-cyan-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Thank you message */}
      {showThankYou && (
        <div className="rounded-2xl border border-emerald-400/60 bg-emerald-500/15 p-4 text-center">
          <p className="text-sm font-semibold text-emerald-200 md:text-base">
            {t.sponsor.thanks}
          </p>
        </div>
      )}

      {compact && (
        <p className="text-center text-xs text-slate-400 md:text-sm">
          {t.sponsor.description}
        </p>
      )}
    </div>
  );

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950/95 shadow-[0_0_35px_rgba(15,23,42,0.9)]">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-100 transition-colors"
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
    <div className="rounded-2xl border border-slate-800 bg-slate-950/90 shadow-card">
      <SponsorContent />
    </div>
  );
};

export default SponsorSection; 