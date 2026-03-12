import { useState } from 'react';
import { ExternalLink, TrendingUp, ChevronDown } from 'lucide-react';
import { getDigests } from '../data/dailyNews';

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('zh-TW', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function DailyDigest() {
  const digests = getDigests();
  const [openIdx, setOpenIdx] = useState(0); // latest open by default

  return (
    <div className="space-y-2">
      {digests.map((digest, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={digest.date} className="rounded-xl border border-gray-100 overflow-hidden">
            {/* Accordion header */}
            <button
              onClick={() => setOpenIdx(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-medium text-gray-800">{formatDate(digest.date)}</span>
                {i === 0 && (
                  <span className="rounded-full bg-emerald-500 px-1.5 py-px text-[9px] font-bold text-white">
                    NEW
                  </span>
                )}
                <span className="text-xs text-gray-400">· {digest.items.length} 則</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Accordion body */}
            {isOpen && (
              <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
                <ol className="space-y-3">
                  {digest.items.map((item, j) => (
                    <li key={j} className="group flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-400 transition-colors group-hover:bg-gray-900 group-hover:text-white">
                        {j + 1}
                      </span>

                      <div className="min-w-0 flex-1 space-y-1">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-start gap-1 text-sm font-semibold leading-snug text-gray-900 transition-colors hover:text-emerald-600"
                        >
                          <span>{item.title}</span>
                          <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 opacity-40" />
                        </a>

                        <p className="text-xs leading-relaxed text-gray-500">{item.summary}</p>

                        <p className="text-xs leading-relaxed text-gray-400">
                          <span className="font-medium text-gray-500">為何重要：</span>
                          {item.why}
                        </p>

                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                            {item.source}
                          </span>
                          <span className="text-[10px] text-gray-300">{item.time}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>

                {digest.market && (
                  <div className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2.5">
                    <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    <p className="text-xs leading-relaxed text-emerald-700">
                      <span className="font-semibold">市場快訊：</span>
                      {digest.market}
                    </p>
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
