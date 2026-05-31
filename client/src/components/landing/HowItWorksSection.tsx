import { motion } from 'framer-motion';
import { STEPS } from './utils';

export default function HowItWorksSection() {
  return (
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
  );
}
