'use client';

import { useEffect } from 'react';

export const useServiceWorker = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker enregistré avec succès:', registration.scope);
            
            // Vérifier les mises à jour
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // Nouvelle version disponible
                    console.log('Nouvelle version disponible');
                    if (confirm('Une nouvelle version est disponible. Voulez-vous recharger la page ?')) {
                      window.location.reload();
                    }
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.log('Échec de l\'enregistrement du Service Worker:', error);
          });
      });

      // Gérer les messages du service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          console.log('Cache mis à jour');
        }
      });
    }
  }, []);
};
