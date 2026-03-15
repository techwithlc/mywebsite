import { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp, ChevronDown, FlaskConical } from 'lucide-react';
import { getDigests } from '../data/dailyNews';

function useStPatrick() {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  return m === 3 && d >= 13 && d <= 17;
}

function Shamrocks() {
  const count = 12;
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50" aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 4;
        const duration = 4 + Math.random() * 4;
        const size = 14 + Math.floor(Math.random() * 16);
        return (
          <span
            key={i}
            className="absolute top-[-2rem] select-none"
            style={{
              left: `${left}%`,
              fontSize: `${size}px`,
              animation: `shamrock-fall ${duration}s ${delay}s linear infinite`,
              opacity: 0,
            }}
          >
            ☘️
          </span>
        );
      })}
      <style>{`
        @keyframes shamrock-fall {
          0%   { transform: translateY(0)   rotate(0deg);   opacity: 0.9; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function formatDate(iso: string, lang: 'en' | 'zh'): string {
  const [year, month, day] = iso.split('-').map(Number);
  const locale = lang === 'en' ? 'en-US' : 'zh-TW';
  return new Date(year, month - 1, day).toLocaleDateString(locale, {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

const t = {
  why:    { en: 'Why it matters:', zh: '為何重要：' },
  market: { en: 'Market Pulse:', zh: '市場快訊：' },
  items:  { en: 'stories', zh: '則' },
};

export default function DailyDigest({ language = 'zh' }: { language?: 'en' | 'zh' }) {
  const digests = getDigests();
  const [openIdx, setOpenIdx] = useState(0); // latest open by default
  const isStPatrickWeek = useStPatrick();
  const [showShamrocks, setShowShamrocks] = useState(isStPatrickWeek);

  useEffect(() => {
    if (!isStPatrickWeek) return;
    const t = setTimeout(() => setShowShamrocks(false), 10000);
    return () => clearTimeout(t);
  }, [isStPatrickWeek]);

  return (
    <div className="space-y-2">
      {showShamrocks && <Shamrocks />}
      {digests.map((digest, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={digest.date} className="rounded-xl border border-gray-100 dark:border-gold-500/20 overflow-hidden dark:bg-ink-900/40 transition-colors">
            {/* Accordion header */}
            <button
              onClick={() => setOpenIdx(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-ink-800/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-medium text-gray-800 dark:text-ink-50">{formatDate(digest.date, language)}</span>
                {i === 0 && (
                  <span className="rounded-full bg-emerald-500 dark:bg-gold-500 px-1.5 py-px text-[9px] font-bold text-white dark:text-ink-950">
                    NEW
                  </span>
                )}
                <span className="text-xs text-gray-400 dark:text-ink-100/30">· {digest.items.length} {t.items[language]}</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 dark:text-gold-500/50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Accordion body */}
            {isOpen && (
              <div className="border-t border-gray-100 dark:border-gold-500/10 px-4 pb-4 pt-3 space-y-3">
                <ol className="space-y-3">
                  {digest.items.map((item, j) => (
                    <li key={j} className="group flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-ink-800 text-[10px] font-bold text-gray-400 dark:text-gold-500/60 transition-colors group-hover:bg-gray-900 group-hover:text-white dark:group-hover:bg-gold-500 dark:group-hover:text-ink-950">
                        {j + 1}
                      </span>

                      <div className="min-w-0 flex-1 space-y-1">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-start gap-1 text-sm font-semibold leading-snug text-gray-900 dark:text-ink-50 transition-colors hover:text-emerald-600 dark:hover:text-gold-400"
                        >
                          <span>{language === 'en' ? (item.titleEn ?? item.title) : item.title}</span>
                          <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 opacity-40" />
                        </a>

                        <p className="text-xs leading-relaxed text-gray-500 dark:text-ink-100/60">
                          {language === 'en' ? (item.summaryEn ?? item.summary) : item.summary}
                        </p>

                        <p className="text-xs leading-relaxed text-gray-400 dark:text-ink-100/40">
                          <span className="font-medium text-gray-500 dark:text-gold-500/70">{t.why[language]}</span>
                          {language === 'en' ? (item.whyEn ?? item.why) : item.why}
                        </p>

                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="rounded bg-gray-100 dark:bg-ink-800 dark:border dark:border-gold-500/20 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:text-gold-500/60">
                            {item.source}
                          </span>
                          <span className="text-[10px] text-gray-300 dark:text-ink-100/20">{item.time}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>

                {digest.market && (
                  <div className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-emerald-50 dark:border-gold-500/20 dark:bg-gold-500/5 px-3 py-2.5">
                    <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500 dark:text-gold-500" />
                    <p className="text-xs leading-relaxed text-emerald-700 dark:text-gold-400/80">
                      <span className="font-semibold">{t.market[language]}</span>
                      {language === 'en' ? (digest.marketEn ?? digest.market) : digest.market}
                    </p>
                  </div>
                )}

                {digest.feature && (
                  <div className="rounded-lg border border-violet-100 bg-violet-50/50 dark:border-violet-500/20 dark:bg-violet-500/5 overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-violet-100 dark:border-violet-500/20">
                      <FlaskConical className="h-3.5 w-3.5 shrink-0 text-violet-500 dark:text-violet-400" />
                      <span className="text-xs font-bold text-violet-700 dark:text-violet-300">
                        {language === 'en' ? (digest.feature.titleEn ?? digest.feature.title) : digest.feature.title}
                      </span>
                    </div>
                    <div className="px-3 py-2.5 space-y-2.5">
                      <p className="text-xs leading-relaxed text-violet-600/80 dark:text-violet-300/60">
                        {language === 'en' ? (digest.feature.introEn ?? digest.feature.intro) : digest.feature.intro}
                      </p>
                      <ol className="space-y-2">
                        {digest.feature.items.map((fi, k) => (
                          <li key={k} className="flex items-start gap-2">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-200 dark:bg-violet-500/20 text-[9px] font-bold text-violet-600 dark:text-violet-300">
                              {k + 1}
                            </span>
                            <div className="min-w-0">
                              <a
                                href={fi.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-violet-800 dark:text-violet-200 hover:text-violet-600 dark:hover:text-violet-100 transition-colors"
                              >
                                {language === 'en' ? (fi.nameEn ?? fi.name) : fi.name}
                                <ExternalLink className="h-2.5 w-2.5 opacity-40" />
                              </a>
                              <p className="text-[11px] leading-relaxed text-violet-600/70 dark:text-violet-300/50 mt-0.5">
                                {language === 'en' ? (fi.descEn ?? fi.desc) : fi.desc}
                              </p>
                              <span className="text-[10px] text-violet-400/60 dark:text-violet-400/40">{fi.source}</span>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
