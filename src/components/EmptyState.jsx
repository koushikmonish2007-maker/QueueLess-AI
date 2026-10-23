import React from 'react';
import { Layers } from 'lucide-react';

/**
 * Reusable EmptyState component
 * 
 * @param {{
 *  icon?: React.ElementType,
 *  title: string,
 *  message: string,
 *  actionLabel?: string,
 *  onAction?: () => void,
 *  actionIcon?: React.ElementType
 * }} props
 */
export default function EmptyState({
  icon: Icon = Layers,
  title,
  message,
  actionLabel,
  onAction,
  actionIcon: ActionIcon
}) {
  return (
    <div className="glass-card rounded-2xl p-8 sm:p-12 text-center max-w-md mx-auto my-6 border border-slate-800">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-surface flex items-center justify-center text-slate-400 border border-slate-700/60 shadow-inner">
        <Icon className="w-8 h-8 text-brand-cyan/80" />
      </div>

      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-6">{message}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-brand-blue hover:bg-brand-blue-light transition-all shadow-glow-sm hover:shadow-glow-blue cursor-pointer"
        >
          {ActionIcon && <ActionIcon className="w-4 h-4" />}
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
