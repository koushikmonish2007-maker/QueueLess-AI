import React from 'react';
import { 
  Sparkles, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  ArrowRight,
  Navigation,
  Layers,
  Activity
} from 'lucide-react';

export default function AuthVisualPanel() {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden border-r border-slate-800">
      {/* Radiant Glow Mesh */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Branding */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-cyan-400 text-xs font-semibold mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>QueueLess AI 2.0 Universal Platform</span>
        </div>

        <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
          Skip the Queue. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            Save Your Time.
          </span>
        </h1>
        <p className="text-sm text-slate-300 max-w-md leading-relaxed">
          Book virtual queue spots at participating hospitals, banks, and citizen seva centers with real-time tracking and predictive smart departure.
        </p>
      </div>

      {/* Center: Digital Queue Illustration Card */}
      <div className="relative z-10 my-8">
        <div className="relative mx-auto max-w-md rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 p-6 shadow-2xl shadow-blue-950/50">
          
          {/* Card Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold tracking-wider uppercase text-slate-300">
                Live Virtual Queue
              </span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-blue-500/20 text-cyan-300 border border-blue-500/30">
              Supabase Telemetry
            </span>
          </div>

          {/* Token Highlight */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Apex Super Specialty Hospital</span>
              <h2 className="text-3xl font-black font-mono tracking-wider text-white mt-0.5">#H-104</h2>
              <span className="text-xs text-cyan-300 font-semibold">General OPD Consultation</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Est. Call Window</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">11:20 AM</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">2 people ahead</span>
            </div>
          </div>

          {/* Micro Queue Visualizer */}
          <div className="space-y-2 mb-5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Queue Turn Progression</span>
              <span className="text-cyan-400 font-bold">75% complete</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full w-3/4 transition-all duration-1000" />
            </div>
          </div>

          {/* Smart Departure Guidance Pill */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/70 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Navigation className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Smart Departure: <strong>Leave in 12 mins</strong></span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              On Schedule
            </span>
          </div>
        </div>

        {/* Floating Decorative Badges */}
        <div className="absolute -bottom-4 -left-4 px-3.5 py-2 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-lg flex items-center gap-2 text-xs text-slate-200 backdrop-blur-md">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Avg. 35 mins saved per visit</span>
        </div>
        <div className="absolute -top-3 -right-3 px-3.5 py-2 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-lg flex items-center gap-2 text-xs text-slate-200 backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted PostgreSQL Security</span>
        </div>
      </div>

      {/* Bottom Metrics Footer */}
      <div className="relative z-10 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center">
        <div>
          <span className="text-lg font-black text-white block">100%</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Cloud Verified</span>
        </div>
        <div>
          <span className="text-lg font-black text-cyan-400 block">0 min</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Physical Waiting</span>
        </div>
        <div>
          <span className="text-lg font-black text-white block">24/7</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Realtime Tracking</span>
        </div>
      </div>
    </div>
  );
}
