import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import PublicLayout from '@/layouts/PublicLayout';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import DashboardPage from '@/pages/DashboardPage';
import TasksPage from '@/pages/TasksPage';
import ExpensesPage from '@/pages/ExpensesPage';
import PasswordVaultPage from '@/pages/PasswordVaultPage';
import TimeTrackerPage from '@/pages/TimeTrackerPage';
import FoodTrackerPage from '@/pages/FoodTrackerPage';
import ReportsPage from '@/pages/ReportsPage';
import SettingsPage from '@/pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'services', element: <ServicesPage /> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'expenses', element: <ExpensesPage /> },
      { path: 'passwords', element: <PasswordVaultPage /> },
      { path: 'time-tracker', element: <TimeTrackerPage /> },
      { path: 'food-tracker', element: <FoodTrackerPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);
