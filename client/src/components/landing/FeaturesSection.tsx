import { motion } from 'framer-motion';
import { FEATURES } from './utils';

export default function FeaturesSection() {
  return (
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
  );
}
