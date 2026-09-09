export default function ProgressBar({ value, max, label, color = 'auto' }) {
  const pct = Math.min(100, Math.round((value / max) * 100)) || 0;

  // Auto-pick gradient color based on completion percentage
  const autoColor =
    pct >= 100 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
    pct >= 60  ? 'bg-gradient-to-r from-lime-400 to-lime-500 shadow-[0_0_10px_rgba(132,204,22,0.3)]'    :
    pct >= 30  ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]'   :
                 'bg-gradient-to-r from-rose-400 to-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]';

  const colorMap = {
    accent:  'bg-gradient-to-r from-lime-400 to-lime-500 shadow-[0_0_10px_rgba(132,204,22,0.3)]',
    success: 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]',
    warning: 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]',
    danger:  'bg-gradient-to-r from-rose-400 to-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]',
    auto:    autoColor,
  };

  const barColor = colorMap[color] ?? autoColor;

  return (
    <div className="w-full group">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-silver-600 uppercase tracking-wider">{label}</span>
          <span className="text-xs font-bold text-navy-900 bg-silver-100 px-2 py-0.5 rounded-md border border-silver-200">{pct}%</span>
        </div>
      )}
      <div className="w-full bg-silver-200/50 shadow-inner rounded-full h-2.5 overflow-hidden border border-silver-200/80 p-[1px]">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${barColor}`}
          style={{ width: `${pct}%` }}
        >
          {/* Subtle shine overlay */}
          <div className="absolute inset-0 bg-white/20 w-full h-full" />
        </div>
      </div>
    </div>
  );
}
