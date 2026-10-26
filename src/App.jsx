import { useEffect, useState } from 'react';

import { RouteProvider } from './providers/RouteProvider';
import { DataProvider } from './providers/DataProvider';
import { preloadApp } from './preload/preloadApp';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      await preloadApp({
        images: ['/h_main_brand.png'],
        fonts: ['400 16px Inter'],
      });

      if (!cancelled) {
        setReady(true);
      }
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return <AppPreloader />;
  }

  return (
    <DataProvider>
      <RouteProvider />
    </DataProvider>
  );
}

function AppPreloader() {
  return (
    <div className="homedeck-preloader">
      <img
        src="/h_main_brand.png"
        alt="HomeDeck"
        className="homedeck-preloader-logo"
        width={2523}
        height={412}
      />

      <div className="homedeck-preloader-track">
        <div className="homedeck-preloader-progress" />
      </div>

      <span className="homedeck-preloader-caption">
        Preparando sua experiência...
      </span>
    </div>
  );
}