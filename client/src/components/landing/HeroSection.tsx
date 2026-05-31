import { motion } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import InstallPWA from '@/components/InstallPWA';
import { HiArrowRight } from 'react-icons/hi';
import { fadeUp } from './utils';

export default function HeroSection() {
  const { setLoginModalOpen } = useUIStore();

  return (
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
            onClick={() => setLoginModalOpen(true, 'register')}
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
  );
}
