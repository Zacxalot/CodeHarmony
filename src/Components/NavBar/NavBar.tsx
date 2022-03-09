import React from 'react';
import './NavBar.scss';
import { Link, useNavigate } from 'react-router-dom';
import {
  Typography, AppBar, Toolbar, Stack, Box, Button,
} from '@mui/material';

interface NavBarProps {
  small?: boolean
}

function NavBar({ small }: NavBarProps) {
  const navigate = useNavigate();
  return (
    // Use a smaller font size if the small prop is given
    <AppBar
      position="static"
      sx={{
        bgcolor: 'background.paper', color: 'text.primary',
      }}
    >
      <Toolbar style={{ minHeight: '0px' }}>
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight={700} sx={{ userSelect: 'none', cursor: 'pointer' }} onClick={() => { navigate('/'); }}>
            Code
            <Stack component="span" style={{ display: 'inline' }} sx={{ color: 'primary.main' }}>_</Stack>
            Harmony
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

NavBar.defaultProps = {
  small: false,
};

export default NavBar;
