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

  const handleSponsorClick = (platform: 'buymeacoffee' | 'paypal') => {
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);

    // Open sponsor links (these would be real URLs in production)
    const urls = {
      buymeacoffee: 'https://buymeacoffee.com/techwithlc', // Replace with actual URL
      paypal: 'https://paypal.me/techwithlc' // Replace with actual URL
    };

    window.open(urls[platform], '_blank', 'noopener,noreferrer');
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

      <div className="grid gap-4 md:grid-cols-2">
        {/* Buy Me a Coffee */}
        <button
          onClick={() => handleSponsorClick('buymeacoffee')}
          className="group flex items-center gap-4 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 rounded-2xl border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg"
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

        {/* PayPal */}
        <button
          onClick={() => handleSponsorClick('paypal')}
          className="group flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
        >
          <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.56-.04H18.5a.641.641 0 0 0-.633.74l.562 3.562c.081.518.525.9 1.05.9h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.292-1.867-.002-3.136-1.012-4.287C28.254 1.543 26.247 1 23.677 1h-7.46c-.524 0-.972.382-1.054.901z"/>
            </svg>
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-bold text-lg text-blue-700">{t.sponsor.paypal}</h4>
            <p className="text-sm text-blue-600">PayPal</p>
          </div>
          <ExternalLink className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
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
        <div className="bg-white rounded-3xl max-w-md w-full relative border border-gray-200 shadow-2xl">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl transition-colors"
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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg">
      <SponsorContent />
    </div>
  );
};

export default SponsorSection; 