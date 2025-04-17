import React from 'react';
import { Box, Typography, Link, useTheme } from '@mui/material';

/**
 * Application footer component with copyright information
 * and navigation links.
 */
const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        mt: 'auto',
        backgroundColor: theme.palette.grey[100],
        borderTop: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        &copy; {currentYear} Quiz Master
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Link href="#" color="inherit" underline="hover">
          <Typography variant="body2">Privacy Policy</Typography>
        </Link>
        <Link href="#" color="inherit" underline="hover">
          <Typography variant="body2">Terms of Service</Typography>
        </Link>
        <Link href="#" color="inherit" underline="hover">
          <Typography variant="body2">Contact Us</Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;