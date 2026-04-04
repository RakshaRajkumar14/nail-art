import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { GlitterCursor } from '@/components/GlitterCursor';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
      return;
    }

    const cleanupFlag = 'shivya-dev-cache-reset-v1';
    if (window.sessionStorage.getItem(cleanupFlag)) {
      return;
    }

    const clearDevCaches = async () => {
      let shouldReload = false;

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        if (registrations.length > 0) {
          await Promise.all(registrations.map((registration) => registration.unregister()));
          shouldReload = true;
        }
      }

      if ('caches' in window) {
        const cacheNames = await window.caches.keys();
        const appCacheNames = cacheNames.filter((name) => name.startsWith('nail-art'));

        if (appCacheNames.length > 0) {
          await Promise.all(appCacheNames.map((name) => window.caches.delete(name)));
          shouldReload = true;
        }
      }

      window.sessionStorage.setItem(cleanupFlag, '1');

      if (shouldReload) {
        window.location.reload();
      }
    };

    clearDevCaches().catch((error) => {
      console.warn('Dev cache cleanup failed', error);
    });
  }, []);

  return (
    <>
      <GlitterCursor />
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </>
  );
}
