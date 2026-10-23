import React from 'react';
import { 
  LayoutDashboard, 
  Ticket, 
  Map, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Reusable Left Sidebar with Dark Navy-Blue aesthetic
 * 
 * @param {{
 *  activeTab: string,
 *  onSelectTab: (tabId: string) => void,
 *  onBookTokenClick?: () => void,
 *  onHelpClick?: () => void,
 *  type?: string
 * }} props
 */
export default function Sidebar({ 
  activeTab = 'dashboard', 
  onSelectTab,
  onBookTokenClick,
  onHelpClick,
  type = 'citizen'
}) {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'book-token', label: t('bookToken'), icon: Ticket },
    { id: 'queue-map', label: t('queueMap'), icon: Map },
    { id: 'analytics', label: t('analytics'), icon: BarChart3 },
    { id: 'settings', label: t('settings'), icon: Settings },
    { id: 'help', label: t('help'), icon: HelpCircle },
  ];

  const handleItemClick = (item) => {
    if (item.id === 'book-token' && onBookTokenClick) {
      onBookTokenClick();
      if (onSelectTab) onSelectTab('book-token');
      return;
    }
    if (item.id === 'help' && onHelpClick) {
      onHelpClick();
      if (onSelectTab) onSelectTab('help');
      return;
    }
    if (onSelectTab) {
      onSelectTab(item.id);
    }
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-[#0c1322] text-slate-300 rounded-2xl lg:rounded-3xl p-4 sm:p-5 flex flex-col border border-slate-800/90 shadow-xl lg:sticky lg:top-[104px] lg:h-[calc(100vh-120px)] lg:max-h-[calc(100vh-120px)] overflow-y-auto sidebar-scroll">
      {/* App Portal Tag */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 mb-3 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
        <div className="text-xs min-w-0">
          <span className="font-bold text-white block leading-tight truncate">
            QueueLess AI 2.0
          </span>
          <span className="text-cyan-400/90 text-[10px] font-medium block leading-tight truncate">
            Tamil Nadu Queue Hub
          </span>
        </div>
      </div>

      {/* Main Menu (Positioned neatly from the top) */}
      <div className="space-y-1 shrink-0">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          Main Menu
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 ml-1" />}
            </button>
          );
        })}
      </div>

      {/* Regional Telemetry Section (At the bottom of the sidebar) */}
      <div className="mt-auto pt-4 border-t border-slate-800/80 shrink-0 space-y-2">
        <div className="flex items-center justify-between px-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Regional Telemetry
          </p>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Coverage:</span>
            <span className="font-bold text-white">8 Districts</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Centers:</span>
            <span className="font-semibold text-cyan-400 truncate ml-2">Hospitals, Banks, Seva</span>
          </div>
          <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/60 text-[10px]">
            <span className="text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              AI Predictive Router
            </span>
            <span className="text-slate-400">Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
