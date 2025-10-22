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
    <div className={`${compact ? 'p-4' : 'p-8'} space-y-6`}>
      {!compact && (
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">{t.sponsor.title}</h3>
          <p className="text-gray-600 text-lg">{t.sponsor.description}</p>
        </div>
      )}

      <div className="max-w-md mx-auto">
        {/* Buy Me a Coffee */}
        <button
          onClick={handleSponsorClick}
          className="w-full group flex items-center gap-4 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 rounded-2xl border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg"
        >
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <Coffee className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-bold text-lg text-orange-700">{t.sponsor.buyMeCoffee}</h4>
            <p className="text-sm text-orange-600">Buy Me a Coffee</p>
          </div>
          <ExternalLink className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Thank you message */}
      {showThankYou && (
        <div className="text-center p-6 bg-green-50 border-2 border-green-200 rounded-2xl">
          <p className="text-green-700 font-semibold text-lg">{t.sponsor.thanks}</p>
        </div>
      )}

      {compact && (
        <p className="text-sm text-gray-600 text-center">
          {t.sponsor.description}
        </p>
      )}
    </div>
  );

  if (showModal) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#faf9f7] rounded-3xl max-w-md w-full relative border border-[#e8e4df] shadow-2xl">
          {onClose && (
            <button
              onClick={onClose}
                              className="absolute top-4 right-4 p-2 hover:bg-[#ede9e4] rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <SponsorContent />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf9f7] rounded-2xl border border-[#e8e4df] shadow-lg">
      <SponsorContent />
    </div>
  );
};

export default SponsorSection; 