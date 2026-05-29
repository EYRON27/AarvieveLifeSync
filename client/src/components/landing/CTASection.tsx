import { motion } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';
import InstallPWA from '@/components/InstallPWA';
import { HiArrowRight } from 'react-icons/hi';
import { fadeUp } from './utils';

export default function CTASection() {
  const { setLoginModalOpen } = useUIStore();

  return (
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
            onClick={() => setLoginModalOpen(true, 'register')}
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
  );
}
