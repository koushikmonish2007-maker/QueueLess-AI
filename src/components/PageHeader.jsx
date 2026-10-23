import React from 'react';

/**
 * Reusable PageHeader component for consistent page layouts
 * 
 * @param {{
 *  title: string,
 *  badge?: string,
 *  description?: string,
 *  children?: React.ReactNode
 * }} props
 */
export default function PageHeader({ title, badge, description, children }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
      <div className="max-w-2xl">
        {badge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            {badge}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-3 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
