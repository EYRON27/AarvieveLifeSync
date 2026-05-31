import {
  HiOutlineClipboardList,
  HiOutlineCurrencyDollar,
  HiOutlineKey,
  HiOutlineClock,
  HiOutlineHeart,
  HiOutlineChartBar,
} from 'react-icons/hi';

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

export const FEATURES = [
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

export const STEPS = [
  { number: '01', title: 'Create your account', desc: 'Sign up for free in seconds. No credit card required.' },
  { number: '02', title: 'Set up your workspace', desc: 'Configure your currency, timezone, and daily calorie goal.' },
  { number: '03', title: 'Stay on top of everything', desc: 'Log tasks, expenses, and time from one unified dashboard.' },
];
