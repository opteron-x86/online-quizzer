import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box,
  Button,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useNavigate } from 'react-router-dom';

interface AppHeaderProps {
  toggleSidebar: () => void;
  title?: string;
}

/**
 * Application header component with navigation controls
 * and user account options.
 */
const AppHeader = ({ toggleSidebar, title = "Quiz Master" }: AppHeaderProps) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'white',
        color: 'black',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="help"
            sx={{ mr: 1 }}
          >
            <HelpOutlineIcon />
          </IconButton>
          
          <Button 
            color="inherit" 
            startIcon={<AccountCircleIcon />}
            sx={{ 
              borderRadius: 1.5,
              '&:hover': {
                backgroundColor: theme.palette.grey[200]
              }
            }}
          >
            Account
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;