import { useState } from 'react';
import { ExternalLink, TrendingUp } from 'lucide-react';
import { getDigests } from '../data/dailyNews';

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('zh-TW', {
    month: 'short',
    day: 'numeric',
  });
}

export default function DailyDigest() {
  const digests = getDigests();
  const [activeIdx, setActiveIdx] = useState(0);
  const digest = digests[activeIdx];

  return (
    <div className="space-y-4">
      {/* Date tabs — only shown when there are multiple days */}
      {digests.length > 1 && (
        <div className="flex gap-1.5 flex-wrap">
          {digests.map((d, i) => (
            <button
              key={d.date}
              onClick={() => setActiveIdx(i)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                i === activeIdx
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {formatDate(d.date)}
              {i === 0 && (
                <span className="ml-1.5 rounded-full bg-emerald-500 px-1 py-px text-[9px] font-bold text-white">
                  NEW
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Date label */}
      <p className="text-xs text-gray-400">
        {new Date(...(digest.date.split('-').map(Number) as [number, number, number])).toLocaleDateString('zh-TW', {
          year: 'numeric', month: 'long', day: 'numeric',
        })}
        {' · '}Top {digest.items.length}
      </p>

      {/* News cards */}
      <ol className="space-y-3">
        {digest.items.map((item, i) => (
          <li
            key={i}
            className="group rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:border-gray-200 hover:bg-white"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-500 transition-colors group-hover:bg-gray-900 group-hover:text-white">
                {i + 1}
              </span>

              <div className="min-w-0 flex-1 space-y-1.5">
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
            </div>
          </li>
        ))}
      </ol>

      {/* Market note */}
      {digest.market && (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
          <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
          <p className="text-xs leading-relaxed text-emerald-700">
            <span className="font-semibold">市場快訊：</span>
            {digest.market}
          </p>
        </div>
      )}
    </div>
  );
}
