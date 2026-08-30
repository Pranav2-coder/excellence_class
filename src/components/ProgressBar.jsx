export default function ProgressBar({ value, max, label, color = 'accent' }) {
  const pct = Math.min(100, Math.round((value / max) * 100)) || 0;

  const colorMap = {
    accent:  'bg-accent-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger:  'bg-red-500',
  };

  const barColor = colorMap[color] || colorMap.accent;

  // Determine color based on pct
  const autoColor =
    pct >= 100 ? 'bg-emerald-500' :
    pct >= 60  ? 'bg-accent-500'  :
    pct >= 30  ? 'bg-amber-500'   :
                 'bg-red-500';

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-silver-600">{label}</span>
          <span className="text-sm font-bold text-navy-950">{pct}%</span>
        </div>
      )}
      <div className="w-full bg-silver-300 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-700 ease-out ${autoColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
