import React, { ReactNode, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import themeConfig from '@/styles/themes';
import { useQuiz } from '@/contexts/QuizContext';

interface AppThemeProviderProps {
  children: ReactNode;
}

/**
 * Custom theme provider that handles both light and dark mode
 * based on user settings in the app
 */
const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  // Get dark mode preference from quiz context
  const { appSettings } = useQuiz();

  // Create theme based on dark mode preference
  const theme = useMemo(() => {
    return createTheme({
      ...themeConfig,
      palette: {
        ...themeConfig.palette,
        mode: appSettings.darkMode ? 'dark' : 'light',
        ...(appSettings.darkMode && {
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
          },
        }),
      },
    });
  }, [appSettings.darkMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline /> {/* Handles baseline styling like background color */}
      {children}
    </MuiThemeProvider>
  );
};

export default AppThemeProvider;