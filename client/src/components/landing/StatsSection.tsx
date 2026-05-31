import { motion } from 'framer-motion';

export default function StatsSection() {
  return (
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
  );
}
