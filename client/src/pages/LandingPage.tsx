import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUIStore } from '@/store/uiStore';

export default function LandingPage() {
  const { setLoginModalOpen } = useUIStore();

  return (
    <section className="flex-1 flex flex-col items-center justify-center pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">
          Master Your <span className="text-transparent bg-clip-text gradient-primary">Daily Life</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
          AarvieveLifeSync is your all-in-one personal productivity hub. Manage tasks, track expenses, secure passwords, and more.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setLoginModalOpen(true)}
            className="px-8 py-4 rounded-xl font-bold text-lg text-white gradient-primary hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 active:scale-95 w-full sm:w-auto"
          >
            Get Started Free
          </button>
          <Link
            to="/services"
            className="px-8 py-4 rounded-xl font-bold text-lg text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all duration-300 w-full sm:w-auto text-center"
          >
            Explore Services
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
