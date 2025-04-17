import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppLayout from '@/components/layout/AppLayout';
import AppRoutes from '@/routes/AppRoutes';
import { QuizProvider } from '@/contexts/QuizContext';
import themeConfig from './styles/themes';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

/**
 * Main application component that sets up routing and providers
 */
const App: React.FC = () => {
  // Create theme from config
  const theme = createTheme(themeConfig);

  return (
    <ErrorBoundary>
      <Router>
        <QuizProvider>
          <ThemeProvider theme={theme}>
            <AppLayout>
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </AppLayout>
          </ThemeProvider>
        </QuizProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;