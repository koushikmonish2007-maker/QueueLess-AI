import React from 'react';

/**
 * Reusable LoadingState component
 * 
 * @param {{ message?: string, rows?: number }} props
 */
export default function LoadingState({ message = 'Loading queue data...', rows = 3 }) {
  return (
    <div className="glass-card rounded-2xl p-8 border border-slate-800">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-5 h-5 rounded-full border-2 border-brand-cyan border-t-transparent animate-spin" />
        <span className="text-sm font-medium text-slate-300">{message}</span>
      </div>

      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="animate-pulse space-y-2">
            <div className="h-4 bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-800/60 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
