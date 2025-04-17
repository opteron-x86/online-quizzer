import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Toolbar,
  Collapse,
  useTheme
} from '@mui/material';
import {
  Home as HomeIcon,
  School as SchoolIcon,
  // Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Quiz as QuizIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  width: number;
}

/**
 * Sidebar navigation component with collapsible sections
 * and active route highlighting.
 */
const Sidebar = ({ open, width }: SidebarProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [coursesOpen, setCoursesOpen] = React.useState(true);

  const handleCoursesClick = () => {
    setCoursesOpen(!coursesOpen);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? width : theme.spacing(7),
        flexShrink: 0,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: open ? width : theme.spacing(7),
          overflowX: 'hidden',
          backgroundColor: theme.palette.grey[50],
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItemButton 
            onClick={() => navigate('/')}
            selected={isActive('/')}
          >
            <ListItemIcon>
              <HomeIcon color={isActive('/') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText 
              primary="Home" 
              sx={{ opacity: open ? 1 : 0 }}
              primaryTypographyProps={{ 
                color: isActive('/') ? 'primary' : 'inherit',
                fontWeight: isActive('/') ? 'bold' : 'normal'
              }}
            />
          </ListItemButton>

          <ListItemButton onClick={handleCoursesClick}>
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Courses" 
              sx={{ opacity: open ? 1 : 0 }} 
            />
            {open && (coursesOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
          
          <Collapse in={open && coursesOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => navigate('/course/D426')}
                selected={isActive('/course/D426')}
              >
                <ListItemIcon>
                  <QuizIcon color={isActive('/course/D426') ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText 
                  primary="D426 Data Management" 
                  sx={{ opacity: open ? 1 : 0 }}
                  primaryTypographyProps={{ 
                    color: isActive('/course/D426') ? 'primary' : 'inherit',
                    fontWeight: isActive('/course/D426') ? 'bold' : 'normal'
                  }}
                />
              </ListItemButton>
              {/* Additional courses would be added here */}
            </List>
          </Collapse>

          <ListItemButton 
            onClick={() => navigate('/history')}
            selected={isActive('/history')}
          >
            <ListItemIcon>
              <HistoryIcon color={isActive('/history') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText 
              primary="History" 
              sx={{ opacity: open ? 1 : 0 }}
              primaryTypographyProps={{ 
                color: isActive('/history') ? 'primary' : 'inherit',
                fontWeight: isActive('/history') ? 'bold' : 'normal'
              }}
            />
          </ListItemButton>
        </List>
        
        <Divider />
        
        <List>
          <ListItemButton 
            onClick={() => navigate('/settings')}
            selected={isActive('/settings')}
          >
            <ListItemIcon>
              <SettingsIcon color={isActive('/settings') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText 
              primary="Settings" 
              sx={{ opacity: open ? 1 : 0 }}
              primaryTypographyProps={{ 
                color: isActive('/settings') ? 'primary' : 'inherit',
                fontWeight: isActive('/settings') ? 'bold' : 'normal'
              }}
            />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;