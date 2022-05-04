import React from 'react';
import { RootLayout } from './RootLayout';
import { AppContextProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';

export const App = () => (
  <AppContextProvider>
    <ThemeProvider>
      <RootLayout/>
    </ThemeProvider>
  </AppContextProvider>
);
