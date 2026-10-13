import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';

try {
  const html = renderToString(
    <React.StrictMode>
      <HelmetProvider>
        <StaticRouter location="/">
          <App />
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
  console.log("Render successful. Length:", html.length);
} catch(e) {
  console.error("Render failed:", e);
}
