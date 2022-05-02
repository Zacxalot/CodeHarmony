import { CancelRounded } from '@mui/icons-material';
import {
  Button, Container, Paper, Stack, Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import { useAppDispatch, useAppSelector } from '../../Redux/hooks';
import { ModalBox, ModalContainer } from '../TeacherDashboard/TeacherDashboard';
import { logout } from '../../Redux/userAccountSlice';

export default function Profile() {
  const username = useAppSelector((state) => state.account.username);
  const dispatch = useAppDispatch();

  const [confirmDelete, setConfirmDelete] = useState(false);

  const deleteAccount = () => {
    axios.delete('/account').then(() => {
      axios.post('/account/logout').then(() => {
        dispatch(logout());
      }).catch(() => {
      });
    }).catch(() => { });
  };

  return (
    <div>
      <ModalContainer open={confirmDelete} onClose={() => { setConfirmDelete(false); }}>
        <ModalBox>
          <Paper>
            <Stack spacing={2} p={2} alignItems="center">
              <Typography variant="h4">Are you sure you want to delete your account?</Typography>
              <Stack direction="row" spacing={2}>
                <Button onClick={() => { deleteAccount(); }} variant="contained" color="error">Delete</Button>
                <Button onClick={() => { setConfirmDelete(false); }} variant="contained">Cancel</Button>
              </Stack>
            </Stack>
          </Paper>
        </ModalBox>
      </ModalContainer>
      <NavBar />
      <Container maxWidth="sm" sx={{ mt: 2 }}>
        <Paper sx={{ p: 2 }}>
          <Stack alignItems="center" spacing={2}>
            <Typography variant="h4">{username}</Typography>
            <Button onClick={() => { setConfirmDelete(true); }} color="error" variant="contained" endIcon={<CancelRounded />}>Delete Account</Button>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
}
