import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-dark-700/60 to-dark-800/60 rounded-[3rem] p-8 md:p-16 border border-white/[0.08] text-center relative overflow-hidden w-full"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">About the Project</h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-10">
            AarvieveLifeSync was built with a vision to unify disparate productivity tools into a single, cohesive, and beautiful interface. It empowers users to take charge of their time, finances, and personal well-being without relying on multiple scattered applications.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            <div className="bg-primary-500/5 p-6 rounded-2xl border border-primary-500/10 hover:border-primary-500/25 transition-colors">
              <h3 className="text-xl font-bold mb-2 text-primary-400">Mission</h3>
              <p className="text-gray-400">Streamline daily productivity and bring peace of mind through unified tools.</p>
            </div>
            <div className="bg-accent-500/5 p-6 rounded-2xl border border-accent-500/10 hover:border-accent-500/25 transition-colors">
              <h3 className="text-xl font-bold mb-2 text-accent-400">Vision</h3>
              <p className="text-gray-400">To be the ultimate all-in-one personal dashboard for individuals globally.</p>
            </div>
            <div className="bg-amber-500/5 p-6 rounded-2xl border border-amber-500/10 hover:border-amber-500/25 transition-colors">
              <h3 className="text-xl font-bold mb-2 text-amber-400">Values</h3>
              <p className="text-gray-400">Privacy, performance, beautiful design, and seamless user experience.</p>
            </div>
          </div>
          <div className="inline-flex flex-col items-center gap-4 bg-white/5 px-8 py-6 rounded-3xl backdrop-blur-md border border-white/[0.08] mt-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-3xl shadow-lg shadow-primary-500/20">A</div>
            <div className="text-center">
              <div className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-1">Lead Developer</div>
              <div className="font-bold text-2xl">Aaron M. Cañada</div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
