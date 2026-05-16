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
    { title: 'Tasks', description: 'Organize your daily activities with a powerful to-do list system.', icon: HiOutlineClipboardList },
    { title: 'Expenses', description: 'Track your spending, set budgets, and analyze where your money goes.', icon: HiOutlineCurrencyDollar },
    { title: 'Password Vault', description: 'Securely store and manage all your important credentials in one encrypted place.', icon: HiOutlineKey },
    { title: 'Time Tracker', description: 'Monitor your productivity and see exactly where your time is being spent.', icon: HiOutlineClock },
    { title: 'Food Tracker', description: 'Log your meals, count calories, and maintain a healthy diet effortlessly.', icon: HiOutlineHeart },
    { title: 'Reports', description: 'Analyze your progress across all domains with comprehensive visual charts.', icon: HiOutlineChartBar },
  ];

  return (
    <section className="flex-1 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Our Services</h2>
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
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary-500/20 flex items-center justify-center mb-6">
              <service.icon className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 font-display">{service.title}</h3>
            <p className="text-gray-400 text-lg">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
