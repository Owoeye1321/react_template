import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
// routes
import { ContextProvider } from './context';
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ContextProvider>
      <HelmetProvider>
        <ThemeProvider>
          <BrowserRouter>
            <ScrollToTop />
            <StyledChart />
            <Router />
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    </ContextProvider>
  );
}
