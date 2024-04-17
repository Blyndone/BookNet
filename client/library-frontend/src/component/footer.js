import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <AppBar position="static" style={{ backgroundColor: 'B1DDF0' }}>
        <Toolbar>
          <Typography
            variant="body2"
            color="inherit"
            align="center"
            style={{ width: '100%' }}
          >
            © {new Date().getFullYear()} Book.Net. All rights reserved.
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Footer;
