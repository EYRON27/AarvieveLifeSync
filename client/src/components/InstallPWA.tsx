import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Install button for PWA.
 * Always renders, but shows informative toast messages if the app is already
 * installed or if the browser doesn't support the automatic install prompt.
 */
export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Already running as installed PWA?
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      // Prevent the default mini-infobar
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Detect when the app gets installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (isInstalled) {
      toast.success('AarvieveLifeSync is already installed!');
      return;
    }
    
    if (!deferredPrompt) {
      toast('To install, use your browser menu (e.g. "Add to Home Screen" on iOS/Safari).', { icon: '📱' });
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      toast.success('App installed successfully!');
    }
    setDeferredPrompt(null);
  };

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        onClick={handleInstall}
        className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white bg-white/[0.08] hover:bg-white/[0.13] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-200 active:scale-95"
        id="install-pwa-btn"
      >
        <HiOutlineDownload className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5 text-white/70" />
        {isInstalled ? 'App Installed' : 'Install App'}
      </motion.button>
    </AnimatePresence>
  );
}
