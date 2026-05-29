import { motion } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import InstallPWA from '@/components/InstallPWA';
import {
  HiOutlineClipboardList,
  HiOutlineCurrencyDollar,
  HiOutlineKey,
  HiOutlineClock,
  HiOutlineHeart,
  HiOutlineChartBar,
  HiArrowRight,
  HiOutlineCheckCircle,
} from 'react-icons/hi';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

const FEATURES = [
  {
    icon: HiOutlineClipboardList,
    title: 'Task Manager',
    desc: 'Organize and prioritize your work with smart task lists, due dates, and progress tracking.',
    color: '#5c7cfa',
  },
  {
    icon: HiOutlineCurrencyDollar,
    title: 'Expense Tracker',
    desc: 'Monitor spending, categorize expenses, and get visual breakdowns of your monthly budget.',
    color: '#22b8cf',
  },
  {
    icon: HiOutlineKey,
    title: 'Password Vault',
    desc: 'Store credentials securely with AES encryption. Access everything in one safe place.',
    color: '#f59e0b',
  },
  {
    icon: HiOutlineClock,
    title: 'Time Tracker',
    desc: 'Log hours per project, review weekly trends, and identify where your time goes.',
    color: '#f97316',
  },
  {
    icon: HiOutlineHeart,
    title: 'Food & Nutrition',
    desc: 'Track daily meals, calories, and macros to stay on top of your health goals.',
    color: '#f43f5e',
  },
  {
    icon: HiOutlineChartBar,
    title: 'Reports & Export',
    desc: 'Generate beautiful PDF reports for expenses, time logs, and nutrition at any time.',
    color: '#a855f7',
  },
];

const STEPS = [
  { number: '01', title: 'Create your account', desc: 'Sign up for free in seconds. No credit card required.' },
  { number: '02', title: 'Set up your workspace', desc: 'Configure your currency, timezone, and daily calorie goal.' },
  { number: '03', title: 'Stay on top of everything', desc: 'Log tasks, expenses, and time from one unified dashboard.' },
];

export default function LandingPage() {
  const { setLoginModalOpen } = useUIStore();

  return (
    <div className="flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center px-5 sm:px-8 pt-28 pb-28 md:pt-36 md:pb-36 overflow-hidden">
        {/* Subtle radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(92,124,250,0.12) 0%, transparent 70%)' }}
        />

        <motion.div
          initial="hidden" animate="show"
          className="relative z-10 max-w-4xl mx-auto"
        >
          {/* Eyebrow */}
          <motion.div
            custom={0} variants={fadeUp}
            className="inline-flex items-center gap-2 mb-7 px-3.5 py-1 rounded-full border border-white/[0.1] bg-white/[0.04] text-xs font-medium text-white/60 tracking-wide"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#5c7cfa] opacity-80" />
            Personal productivity, all in one place
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={1} variants={fadeUp}
            className="text-[2.75rem] sm:text-6xl md:text-7xl font-bold tracking-[-0.03em] leading-[1.08] text-white mb-6"
          >
            Everything you need
            <br />
            <span className="text-white/35">to master your day.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            custom={2} variants={fadeUp}
            className="text-base sm:text-lg text-white/45 mb-10 max-w-xl mx-auto leading-relaxed"
          >
            AarvieveLifeSync brings tasks, expenses, passwords, time tracking,
            and nutrition into a single, beautifully simple workspace.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={3} variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              onClick={() => setLoginModalOpen(true)}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-[#080810] bg-white hover:bg-white/90 transition-all duration-200 active:scale-95"
              id="hero-get-started"
            >
              Get started — it's free
              <HiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <InstallPWA />
          </motion.div>
        </motion.div>

        {/* Thin separator line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────── */}
      <section className="border-y border-white/[0.05] py-10" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '5', label: 'Modules' },
              { value: '100%', label: 'Free to use' },
              { value: 'AES', label: 'Encrypted vault' },
              { value: 'PDF', label: 'Report export' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                <p className="text-xs text-white/35 mt-1 tracking-wide uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8" id="features">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="max-w-xl mb-16">
            <p className="text-xs font-semibold text-[#5c7cfa] uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-snug mb-4">
              One app. Every tool you need.
            </h2>
            <p className="text-white/40 text-base leading-relaxed">
              Built for personal use, designed with precision. Everything works together so you never lose context switching between apps.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                className="group relative p-6 rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 cursor-default"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${f.color}18` }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>

                {/* Subtle hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${f.color}08, transparent 70%)` }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-16">
            <p className="text-xs font-semibold text-[#5c7cfa] uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-snug">
              Up and running in minutes.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-5 left-[16%] right-[16%] h-px bg-white/[0.06]" />

            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className="relative"
              >
                <div className="w-10 h-10 rounded-full border border-white/[0.1] flex items-center justify-center mb-6 bg-white/[0.03] relative z-10">
                  <span className="text-xs font-semibold text-white/50">{step.number}</span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's included ──────────────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold text-[#5c7cfa] uppercase tracking-widest mb-3">Included</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-snug mb-4">
                Everything, no subscription.
              </h2>
              <p className="text-white/40 text-base leading-relaxed mb-8">
                No tiers. No paywalls. Every feature is available from day one, completely free.
              </p>

              <ul className="space-y-3">
                {[
                  'Unlimited tasks, expenses & time entries',
                  'Encrypted password vault',
                  'Daily nutrition & calorie tracking',
                  'PDF export for all your data',
                  'Dark & light mode',
                  'Installable PWA — works offline',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/60">
                    <HiOutlineCheckCircle className="w-4 h-4 text-[#5c7cfa] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual card mock */}
            <div className="relative hidden md:block">
              <div className="rounded-2xl border border-white/[0.07] p-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="flex-1 h-px bg-white/[0.06] ml-2" />
                </div>
                <div className="space-y-3">
                  {['Complete onboarding task', 'Review weekly budget', 'Log 3 meals today', 'Update portfolio passwords'].map((t, i) => (
                    <div key={t} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${i < 2 ? 'border-[#5c7cfa] bg-[#5c7cfa]' : 'border-white/20'}`}>
                        {i < 2 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className={`text-xs ${i < 2 ? 'text-white/30 line-through' : 'text-white/60'}`}>{t}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-5 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs text-white/30">2 of 4 complete</span>
                  <div className="flex gap-1">
                    {[0,1,2,3].map((n) => (
                      <div key={n} className={`h-1 w-8 rounded-full ${n < 2 ? 'bg-[#5c7cfa]' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </div>
              </div>
              {/* Subtle glow under card */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-12 bg-[#5c7cfa]/20 blur-2xl rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="py-28 px-5 sm:px-8 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-5"
          >
            Start organizing your life<br />
            <span className="text-white/30">today, for free.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/40 text-base mb-10"
          >
            No credit card. No trial. No hidden fees. Just you and your productivity.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              onClick={() => setLoginModalOpen(true)}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-[#080810] bg-white hover:bg-white/90 transition-all active:scale-95"
              id="cta-get-started"
            >
              Create your free account
              <HiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <InstallPWA />
          </motion.div>
        </div>
      </section>

    </div>
  );
}
