export default function StatCard({ title, value, icon: Icon, color = 'accent', trend, subtitle }) {
  const colorMap = {
    accent:  { bg: 'bg-accent-500',  light: 'bg-accent-50',  text: 'text-accent-500'  },
    success: { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-500' },
    warning: { bg: 'bg-amber-500',   light: 'bg-amber-50',   text: 'text-amber-500'   },
    danger:  { bg: 'bg-red-500',     light: 'bg-red-50',     text: 'text-red-500'     },
    navy:    { bg: 'bg-navy-950',    light: 'bg-navy-50',    text: 'text-navy-900'    },
  };

  const c = colorMap[color] || colorMap.accent;

  return (
    <div className="card-hover animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className={`${c.light} p-3 rounded-xl`}>
          <Icon size={22} className={c.text} />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            trend > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-silver-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-navy-950">{value}</p>
      {subtitle && <p className="text-xs text-silver-500 mt-1">{subtitle}</p>}
    </div>
  );
}
