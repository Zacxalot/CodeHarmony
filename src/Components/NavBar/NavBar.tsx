import React, { useEffect } from 'react';
import './NavBar.scss';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Box,
} from '@mui/material';
import CodeHarmonyLogo from '../Code Harmony Logo/CodeHarmonyLogo';
import { Account } from '../../Redux/userAccountSlice';
import { useAppSelector } from '../../Redux/hooks';

export default function NavBar() {
  const navigate = useNavigate();
  const account: Account = useAppSelector((state) => state.account);

  // If not logged in, navigate to login
  useEffect(() => {
    if (!account.username) {
      navigate('/login');
    }
  }, []);

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
          <CodeHarmonyLogo />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
