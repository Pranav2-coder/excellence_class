export default function ProgressBar({ value, max, label, color = 'auto' }) {
  const pct = Math.min(100, Math.round((value / max) * 100)) || 0;

  // Auto-pick color based on completion percentage
  const autoColor =
    pct >= 100 ? 'bg-emerald-500' :
    pct >= 60  ? 'bg-lime-500'    :
    pct >= 30  ? 'bg-amber-500'   :
                 'bg-rose-400';

  const colorMap = {
    accent:  'bg-lime-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger:  'bg-rose-500',
    auto:    autoColor,
  };

  const barColor = colorMap[color] ?? autoColor;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-silver-600">{label}</span>
          <span className="text-xs font-bold text-navy-900">{pct}%</span>
        </div>
      )}
      <div className="w-full bg-silver-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
