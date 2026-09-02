export default function StatCard({ title, value, icon: Icon, color = 'accent', trend, subtitle }) {
  const colorMap = {
    accent:  { bg: 'bg-lime-500',  light: 'bg-lime-50',  text: 'text-lime-600'  },
    success: { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600' },
    warning: { bg: 'bg-amber-500',   light: 'bg-amber-50',   text: 'text-amber-500'   },
    danger:  { bg: 'bg-rose-500',    light: 'bg-rose-50',    text: 'text-rose-600'    },
    navy:    { bg: 'bg-navy-950',    light: 'bg-navy-50',    text: 'text-navy-900'    },
  };

  const c = colorMap[color] || colorMap.accent;

  return (
    <div className="card-hover animate-slide-up group relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${c.bg} opacity-5 blur-2xl group-hover:scale-150 transition-transform duration-700`} />
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`${c.light} p-3 rounded-xl shadow-sm border border-white/60`}>
          <Icon size={22} className={c.text} />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm ${
            trend > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-silver-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-navy-950">{value}</p>
      {subtitle && <p className="text-xs text-silver-500 mt-1">{subtitle}</p>}
    </div>
  );
}
