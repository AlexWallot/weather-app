'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Vérifier si l'app est déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installée avec succès');
    } else {
      console.log('Installation PWA refusée');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-fade-in-up">
      <div className="glass-effect rounded-2xl p-4 border border-white/20">
        <div className="flex items-center gap-3">
          <div className="text-3xl">📱</div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">Installer l'application</h3>
            <p className="text-blue-200 text-xs">Accédez rapidement aux prévisions météo</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDismiss}
              aria-label="Fermer le prompt d'installation"
              className="text-white/70 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              Plus tard
            </button>
            <button
              onClick={handleInstallClick}
              aria-label="Installer l'application météo"
              className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Installer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
