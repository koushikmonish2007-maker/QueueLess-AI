import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShieldCheck, Heart, Sparkles, Building2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white text-slate-500 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-xs">
                <div className="w-full h-full bg-[#0c1322] rounded-[9px] flex items-center justify-center">
                  <Clock className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tight">
                Queue<span className="text-cyan-600">Less</span> AI 2.0
              </span>
            </div>

            <p className="text-xs text-slate-600 max-w-md leading-relaxed">
              Smart Virtual Queue Management for Tamil Nadu. 
              QueueLess AI eliminates physical crowding across healthcare, banking, 
              education, and government service centers through virtual queue tokens and smart departure planning.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">
                TEAM GEN4X
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[11px]">
                INTELLATHON 2K26
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">
                Universal SaaS Platform
              </span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Explore Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-blue-600 transition-colors">
                  Facility Discovery
                </Link>
              </li>
              <li>
                <Link to="/citizen" className="hover:text-blue-600 transition-colors">
                  Citizen Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-blue-600 transition-colors">
                  Admin Console
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-blue-600 transition-colors">
                  How Virtual Queuing Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Sectors */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Universal Sectors
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span>Hospitals & OPD Clinics</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Government & Seva Kendras</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span>Banks & Financial Tellers</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Colleges & Universities</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Civic Municipal Centers</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 QueueLess AI. Team GEN4X. Independent queue management technology.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Chennai • Coimbatore • Madurai • Trichy • Salem</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
