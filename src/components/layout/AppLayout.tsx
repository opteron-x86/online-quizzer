import React from 'react';
import { Box, useTheme } from '@mui/material';
import AppHeader from '@/components/layout/AppHeader';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Application layout component that wraps the main content
 * with the header, sidebar, and footer.
 */
const AppLayout = ({ children }: AppLayoutProps) => {
  const theme = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const sidebarWidth = 240;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppHeader toggleSidebar={toggleSidebar} />
      <Sidebar open={sidebarOpen} width={sidebarWidth} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 10,
          pb: 4,
          px: 2,
          ml: sidebarOpen ? `${sidebarWidth}px` : `${theme.spacing(7)}`,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {children}
      </Box>
      
      <Box
        sx={{
          ml: sidebarOpen ? `${sidebarWidth}px` : `${theme.spacing(7)}`,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
};

export default AppLayout;