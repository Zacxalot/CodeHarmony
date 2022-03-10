import React, { useEffect, useState } from 'react';
import './NavBar.scss';
import { Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, Button, Menu, MenuItem,
} from '@mui/material';
import axios from 'axios';
import CodeHarmonyLogo from '../Code Harmony Logo/CodeHarmonyLogo';
import { Account, logout } from '../../Redux/userAccountSlice';
import { useAppDispatch, useAppSelector } from '../../Redux/hooks';

export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const account: Account = useAppSelector((state) => state.account);

  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorElement);

  // If not logged in, navigate to login
  useEffect(() => {
    if (!account.username) {
      navigate('/login');
    }
  }, [account]);

  function renderUserButton() {
    if (account.username) {
      return (
        <Button endIcon={<Person sx={{ color: 'primary.main' }} />} size="small" sx={{ color: 'text.primary' }} onClick={(event) => { setAnchorElement(event.currentTarget); }}>
          {account.username}
        </Button>
      );
    }
    return (null);
  }

  const doLogout = () => {
    axios.post('/account/logout')
      .then(() => {
        dispatch(logout());
      })
      .catch(() => {
        console.log('Logout failed');
      });
  };

  const renderMenu = (
    <Menu
      open={menuOpen}
      marginThreshold={0}
      anchorEl={anchorElement}
      onClose={() => { setAnchorElement(null); }}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom',
      }}
    >
      <MenuItem onClick={() => { navigate('/profile'); }}>Profile</MenuItem>
      <MenuItem onClick={doLogout}>Logout</MenuItem>
    </Menu>
  );

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: 'background.paper', color: 'text.primary',
      }}
    >
      <Toolbar disableGutters style={{ minHeight: '0px' }}>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ textAlign: 'center' }}>
          <CodeHarmonyLogo />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          {renderUserButton()}
          {renderMenu}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
