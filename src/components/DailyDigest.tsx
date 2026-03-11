import { ExternalLink, TrendingUp } from 'lucide-react';
import { getLatestDigest } from '../data/dailyNews';

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function DailyDigest() {
  const digest = getLatestDigest();

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">{formatDate(digest.date)} · AI Top {digest.items.length}</p>
      </div>

      {/* News cards */}
      <ol className="space-y-3">
        {digest.items.map((item, i) => (
          <li key={i} className="group rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:border-gray-200 hover:bg-white">
            <div className="flex items-start gap-3">
              {/* Number badge */}
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-500 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                {i + 1}
              </span>

              <div className="min-w-0 flex-1 space-y-1.5">
                {/* Title + link */}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1 text-sm font-semibold text-gray-900 hover:text-emerald-600 transition-colors leading-snug"
                >
                  <span>{item.title}</span>
                  <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 opacity-50" />
                </a>

                {/* Summary */}
                <p className="text-xs leading-relaxed text-gray-500">{item.summary}</p>

                {/* Why it matters */}
                <p className="text-xs leading-relaxed text-gray-400">
                  <span className="font-medium text-gray-500">為何重要：</span>
                  {item.why}
                </p>

                {/* Meta row */}
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 group-hover:bg-gray-100">
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
            {digest.market.text}
          </p>
        </div>
      )}
    </div>
  );
}
