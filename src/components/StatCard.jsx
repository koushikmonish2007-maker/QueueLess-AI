import React from 'react';

/**
 * Reusable StatCard for Metrics and Analytics in SaaS theme
 * 
 * @param {{
 *  title: string,
 *  value: string | number,
 *  icon: React.ElementType,
 *  trend?: string,
 *  trendLabel?: string,
 *  trendUp?: boolean,
 *  subtext?: string,
 *  accent?: 'blue' | 'cyan' | 'emerald' | 'amber',
 *  empty?: boolean,
 *  onActionClick?: () => void,
 *  actionLabel?: string
 * }} props
 */
export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  trendUp = true,
  subtext,
  accent = 'blue',
  empty = false,
  onActionClick,
  actionLabel
}) {
  const accentStyles = {
    blue: {
      bgIcon: 'bg-blue-50 text-blue-600 border-blue-200/80',
      pill: 'bg-blue-50 text-blue-700'
    },
    cyan: {
      bgIcon: 'bg-cyan-50 text-cyan-600 border-cyan-200/80',
      pill: 'bg-cyan-50 text-cyan-700'
    },
    emerald: {
      bgIcon: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
      pill: 'bg-emerald-50 text-emerald-700'
    },
    amber: {
      bgIcon: 'bg-amber-50 text-amber-600 border-amber-200/80',
      pill: 'bg-amber-50 text-amber-700'
    }
  }[accent] || {
    bgIcon: 'bg-blue-50 text-blue-600 border-blue-200/80',
    pill: 'bg-blue-50 text-blue-700'
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 relative group flex flex-col justify-between h-full min-h-[142px]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 leading-snug truncate" title={title}>
            {title}
          </p>
          <div className="flex items-baseline gap-2 min-w-0">
            <h3 
              className={`font-black tracking-tight leading-tight truncate ${
                typeof value === 'string' && value.length > 14
                  ? 'text-base sm:text-lg'
                  : typeof value === 'string' && value.length > 9
                  ? 'text-lg sm:text-xl'
                  : 'text-2xl sm:text-3xl'
              } ${empty ? 'text-slate-500 font-semibold' : 'text-slate-900'}`}
              title={typeof value === 'string' ? value : undefined}
            >
              {value}
            </h3>
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 sm:p-3 rounded-xl border ${accentStyles.bgIcon} transition-transform group-hover:scale-105 duration-200 shrink-0 ml-auto`}>
            <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </div>
        )}
      </div>

      {(trend || subtext || actionLabel) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs min-w-0">
          {trend ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0 ${trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {trend}
              </span>
              {trendLabel && <span className="text-slate-500 text-[11px] truncate">{trendLabel}</span>}
            </div>
          ) : subtext ? (
            <span className="text-slate-500 text-xs leading-tight truncate" title={subtext}>
              {subtext}
            </span>
          ) : null}

          {actionLabel && onActionClick && (
            <button
              type="button"
              onClick={onActionClick}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 ml-auto cursor-pointer shrink-0 transition-colors"
            >
              {actionLabel} →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
