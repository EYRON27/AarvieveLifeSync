import { motion } from 'framer-motion';
import {
  HiOutlineClipboardList,
  HiOutlineCurrencyDollar,
  HiOutlineKey,
  HiOutlineClock,
  HiOutlineHeart,
  HiOutlineChartBar,
} from 'react-icons/hi';

export default function ServicesPage() {
  const services = [
    {
      title: 'Tasks',
      description: 'Organize your daily activities with a powerful to-do list system.',
      icon: HiOutlineClipboardList,
      color: 'text-primary-400',
      bg: 'bg-primary-500/10',
      border: 'border-primary-500/10 hover:border-primary-500/25',
      glow: 'group-hover:shadow-primary-500/5',
    },
    {
      title: 'Expenses',
      description: 'Track your spending, set budgets, and analyze where your money goes.',
      icon: HiOutlineCurrencyDollar,
      color: 'text-accent-400',
      bg: 'bg-accent-500/10',
      border: 'border-accent-500/10 hover:border-accent-500/25',
      glow: 'group-hover:shadow-accent-500/5',
    },
    {
      title: 'Password Vault',
      description: 'Securely store and manage all your important credentials in one encrypted place.',
      icon: HiOutlineKey,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/10 hover:border-amber-500/25',
      glow: 'group-hover:shadow-amber-500/5',
    },
    {
      title: 'Time Tracker',
      description: 'Monitor your productivity and see exactly where your time is being spent.',
      icon: HiOutlineClock,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/10 hover:border-orange-500/25',
      glow: 'group-hover:shadow-orange-500/5',
    },
    {
      title: 'Food Tracker',
      description: 'Log your meals, count calories, and maintain a healthy diet effortlessly.',
      icon: HiOutlineHeart,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/10 hover:border-rose-500/25',
      glow: 'group-hover:shadow-rose-500/5',
    },
    {
      title: 'Reports',
      description: 'Analyze your progress across all domains with comprehensive visual charts.',
      icon: HiOutlineChartBar,
      color: 'text-accent-400',
      bg: 'bg-accent-500/10',
      border: 'border-accent-500/10 hover:border-accent-500/25',
      glow: 'group-hover:shadow-accent-500/5',
    },
  ];

  return (
    <section className="flex-1 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
          Our{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
            Services
          </span>
        </h2>
        <p className="text-gray-400 text-xl max-w-3xl mx-auto">
          A comprehensive suite of tools designed to help you stay organized, focused, and in control of your daily activities. Everything you need, unified in one elegant platform.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`group bg-white/[0.03] backdrop-blur-xl rounded-3xl p-8 border ${service.border} hover:bg-white/[0.06] transition-all duration-300 hover:shadow-xl ${service.glow}`}
          >
            <div className={`w-16 h-16 rounded-2xl ${service.bg} flex items-center justify-center mb-6`}>
              <service.icon className={`w-8 h-8 ${service.color}`} />
            </div>
            <h3 className="text-2xl font-bold mb-3 font-display">{service.title}</h3>
            <p className="text-gray-400 text-lg">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
