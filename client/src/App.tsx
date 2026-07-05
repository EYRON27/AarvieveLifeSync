import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { router } from './routes';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
  mutationCache: new MutationCache({
    onSuccess: () => {
      // Globally invalidate dashboard queries on any successful mutation
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-activity'] });
    },
  }),
});

function AppInitializer({ children }: { children: React.ReactNode }) {
  const { initializeAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    // Initialize theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    // Initialize Firebase auth listener
    const unsubscribe = initializeAuth();
    return unsubscribe;
  }, [initializeAuth]);

  useEffect(() => {
    if (!useAuthStore.getState().isAuthenticated) {
      queryClient.clear();
    }
  }, [useAuthStore(state => state.isAuthenticated)]);

  useEffect(() => {
    // Keep-alive ping to prevent Render free tier from spinning down
    // Render shuts down after 15 min of inactivity — ping every 14 min to keep it warm
    const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '');
    const ping = () => {
      fetch(`${API_BASE}/health`, { method: 'GET', mode: 'no-cors' }).catch(() => {
        // Silently ignore — this is just a keep-alive, not critical
      });
    };

    ping(); // Ping immediately on load
    const interval = setInterval(ping, 14 * 60 * 1000); // Every 14 minutes
    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInitializer>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--toast-bg, #fff)',
              color: 'var(--toast-color, #333)',
              borderRadius: '12px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            },
          }}
        />
      </AppInitializer>
    </QueryClientProvider>
  );
}
