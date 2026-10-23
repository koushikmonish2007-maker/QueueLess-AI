import React from 'react';

/**
 * StatusBadge component with subtle glow and clear state coloring.
 * 
 * @param {{ status: string, size?: 'sm' | 'md' | 'lg', label?: string }} props
 */
export default function StatusBadge({ status, size = 'md', label }) {
  const normStatus = (status || '').toLowerCase().replace('-', '_');

  const config = {
    // Token statuses
    waiting: {
      text: label || 'Waiting in Queue',
      dot: 'bg-amber-500',
      classes: 'bg-amber-50 text-amber-800 border-amber-300'
    },
    called: {
      text: label || 'Currently Called',
      dot: 'bg-cyan-500 animate-ping',
      classes: 'bg-cyan-50 text-cyan-800 border-cyan-300 shadow-xs font-semibold'
    },
    in_service: {
      text: label || 'In Service',
      dot: 'bg-blue-600 animate-pulse',
      classes: 'bg-blue-50 text-blue-800 border-blue-300 font-semibold'
    },
    in_progress: {
      text: label || 'In Service',
      dot: 'bg-blue-600 animate-pulse',
      classes: 'bg-blue-50 text-blue-800 border-blue-300 font-semibold'
    },
    completed: {
      text: label || 'Completed',
      dot: 'bg-emerald-500',
      classes: 'bg-emerald-50 text-emerald-800 border-emerald-300'
    },
    delayed: {
      text: label || 'Delayed / Grace',
      dot: 'bg-rose-500',
      classes: 'bg-rose-50 text-rose-800 border-rose-300'
    },
    cancelled: {
      text: label || 'Cancelled',
      dot: 'bg-rose-500',
      classes: 'bg-rose-50 text-rose-800 border-rose-300'
    },
    // Counter statuses
    active: {
      text: label || 'Active & Ready',
      dot: 'bg-emerald-500',
      classes: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
    },
    busy: {
      text: label || 'Serving Citizen',
      dot: 'bg-blue-600 animate-pulse',
      classes: 'bg-blue-50 text-blue-800 border-blue-300 font-semibold'
    },
    break: {
      text: label || 'Staff Break',
      dot: 'bg-slate-400',
      classes: 'bg-slate-100 text-slate-700 border-slate-300'
    },
    offline: {
      text: label || 'Offline',
      dot: 'bg-rose-500',
      classes: 'bg-rose-50 text-rose-800 border-rose-300'
    }
  }[normStatus] || {
    text: label || normStatus,
    dot: 'bg-slate-400',
    classes: 'bg-slate-100 text-slate-700 border-slate-300'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium'
  }[size] || 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-full border ${config.classes} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.text}</span>
    </span>
  );
}
