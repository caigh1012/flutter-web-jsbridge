import React from 'react';
import { createRoot } from 'react-dom/client';
import bridge from './native/bridge';

function mounte(innerApp: React.ReactNode) {
  bridge.ready.then(() => {
    createRoot(document.getElementById('root')!).render(innerApp);
  });
}

export default function generatePage(App: React.ReactNode): void {
  mounte(App);
}
