import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Clock, 
  Users, 
  Ticket, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Building2, 
  BarChart2, 
  Cpu, 
  ArrowRight,
  BookOpen,
  HelpCircle,
  Sparkles,
  Search,
  Navigation,
  FileCheck
} from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function HowItWorksPage() {
  const citizenSteps = [
    {
      num: '01',
      title: 'Facility Discovery & Selection',
      desc: 'Search for participating hospitals, banks, university departments, or government centers. Filter by location, sector, and live queue load.',
      icon: Search,
      badge: 'Step 1'
    },
    {
      num: '02',
      title: 'Service & Prerequisite Verification',
      desc: 'Select your specific requirement (e.g., General OPD, Passport Biometrics, or Transcripts) and verify mandatory documents beforehand.',
      icon: FileCheck,
      badge: 'Step 2'
    },
    {
      num: '03',
      title: 'Receive Digital Virtual Token',
      desc: 'Generate a unique, verifiable digital token that secures your exact position in line without being physically present in the room.',
      icon: Ticket,
      badge: 'Step 3'
    },
    {
      num: '04',
      title: 'Smart Departure Guidance',
      desc: 'Our departure planner calculates your transit time, traffic allowances, and safety buffers, alerting you when it is ideal to leave home.',
      icon: Navigation,
      badge: 'Step 4'
    },
    {
      num: '05',
      title: 'Live Queue Tracking & Telemetry',
      desc: 'Watch queue progress in real time on your dashboard. Monitor people ahead, current tokens called, and updated turn estimates.',
      icon: Clock,
      badge: 'Step 5'
    },
    {
      num: '06',
      title: 'Direct Counter Check-in',
      desc: 'Arrive right on time, present your digital token at the assigned counter station, and complete your visit with zero hallway waiting.',
      icon: CheckCircle2,
      badge: 'Step 6'
    }
  ];

  const adminWorkflow = [
    {
      title: '1. Staff Desk Activation',
      desc: 'Staff members log into their assigned counter terminals and activate services they are certified to handle.',
      icon: Building2
    },
    {
      title: '2. Dynamic Load Balancing',
      desc: 'Tokens are prioritized and routed automatically across active counters, eliminating dead idle time between appointments.',
      icon: Users
    },
    {
      title: '3. One-Click Dispatching',
      desc: 'Staff call the next in-line visitor or apply a grace period if a citizen is momentarily delayed in transit.',
      icon: CheckCircle2
    },
    {
      title: '4. Continuous Throughput Auditing',
      desc: 'Management analyzes peak hourly congestion and staff pace to allocate supplementary counters where needed.',
      icon: BarChart2
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1 space-y-16">
      
      {/* Header */}
      <PageHeader
        badge="Queue Science & Architecture"
        title="How QueueLess AI Works"
        description="A transparent breakdown of our citizen queue workflow, administrative counter dispatching, and queue wait estimation methodology."
      />

      {/* Scope Transparency Alert */}
      <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <strong className="text-slate-900 text-sm block mb-0.5">Transparency & Demonstration Scope</strong>
            <span>
              QueueLess AI Phase 1 establishes the mathematical formulation, user interface, and system architecture. 
              Live production deployments will integrate with facility turnstiles, SMS gateways, and cloud PostgreSQL databases in Phase 2.
            </span>
          </div>
        </div>
      </div>

      {/* SIX-STEP CITIZEN WORKFLOW */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Citizen Experience</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            The 6-Step Citizen Virtual Queue Workflow
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-3xl">
            From discovering a facility to finishing your appointment at the counter, here is how QueueLess AI completely eliminates physical queue waiting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {citizenSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {step.badge}
                    </span>
                    <span className="text-2xl font-black font-mono text-slate-300">
                      {step.num}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ADMIN WORKFLOW */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xs space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Facility Operations</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Simple Administrative Workflow for Staff
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl">
            How front-desk officers, doctors, and tellers manage visitor flow without manual token shouting or physical crowd management.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminWorkflow.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ESTIMATION METHODOLOGY & TRANSPARENCY */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xs space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">Algorithm & Formulation</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Estimation Methodology & Queue Theory
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
            We believe in complete algorithmic honesty. Queue wait estimation in QueueLess AI Phase 1 is built upon classical operations research queueing theory (Little's Law approximation) rather than black-box claims.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Formula 1: Wait Time Estimation */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Wait Duration Heuristic</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Multi-Server Little's Law Approximation</h3>
            
            <div className="p-4 rounded-xl bg-white border border-slate-200 font-mono text-xs sm:text-sm text-blue-700 shadow-xs">
              WaitTime = (People Ahead × Avg Service Minutes) / Active Counters
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              If 4 people are ahead of you in Cardiology (avg service duration: 18 minutes), and 2 counters are operational, the baseline wait is:
              <br />
              <code className="text-slate-800 font-semibold mt-1 inline-block">(4 × 18 min) / 2 = 36 minutes</code>.
            </p>
            <p className="text-xs text-slate-500">
              In Phase 2, this heuristic will be continuously refined using live counter completion timestamps and historical variance matrices.
            </p>
          </div>

          {/* Formula 2: Departure Recommendation */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-cyan-600 text-xs font-semibold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Departure Time Guidance</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Travel Time + Comfort Buffer Formula</h3>
            
            <div className="p-4 rounded-xl bg-white border border-slate-200 font-mono text-xs sm:text-sm text-cyan-700 shadow-xs">
              Departure = Target Turn Time - (Transit Time + 10 min Buffer)
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              If your projected turn is at 11:10 AM, transit is 18 minutes, and safety buffer is 10 minutes:
              <br />
              <code className="text-slate-800 font-semibold mt-1 inline-block">11:10 AM - (18m + 10m) = 10:42 AM Recommended Departure</code>.
            </p>
            <p className="text-xs text-slate-500">
              Ensures citizens arrive with adequate time for elevator transit and desk reporting without early hallway loitering.
            </p>
          </div>

        </div>

        {/* Integration Readiness Statement */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-slate-800 block text-sm">Real-time Telemetry Requirements for Phase 2</strong>
            <p>
              Accurate minute-by-minute updates depend on active telemetry reporting from participating facilities. 
              Our architecture provides webhooks and REST endpoints ready to receive electronic turnstile taps, doctor station completion signals, 
              and Supabase PostgreSQL change streams in Phase 2.
            </p>
          </div>
        </div>

      </section>

      {/* CTA SECTION */}
      <section className="text-center py-6 space-y-4 bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs">
        <h3 className="text-2xl font-bold text-slate-900">Experience QueueLess AI in Action</h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Explore demo facilities, test virtual token issuance, or inspect the staff control dashboard.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/facilities"
            className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs"
          >
            Find a Facility
          </Link>
          <Link
            to="/citizen"
            className="px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all"
          >
            Citizen Dashboard
          </Link>
        </div>
      </section>

    </div>
  );
}
