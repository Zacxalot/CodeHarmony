import React, { useEffect, useState } from 'react';
import passwordValidator from 'password-validator';
import Isemail from 'isemail';
import {
  Alert,
  AlertTitle,
  Button,
  Container,
  IconButton,
  Paper, Stack, Tab, Tabs, TextField,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';

// Password validator

// eslint-disable-next-line new-cap
const passwordValidatorSchema = new passwordValidator();
passwordValidatorSchema.is().min(8, 'Minimum 8 characters')
  .is().max(80, 'Maximum 80 characters')
  .has()
  .uppercase(2, 'Must contain at least 2 uppercase characters')
  .has()
  .symbols(2, 'Must contain at least 2 symbols');

// eslint-disable-next-line new-cap
const usernameValidatorSchema = new passwordValidator();
usernameValidatorSchema.is().min(3, 'Must be 3 or more characters')
  .is().max(32, 'Must be less than 32 characters')
  .not()
  .spaces(0, 'Must not contain spaces')
  .not()
  .symbols(0, 'Must not contain symbols');

export default function LoginRegister() {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordHidden, setPasswordHidden] = useState('password');

  const validateUsername = () => {
    const res = usernameValidatorSchema.validate(username, { details: true }) as any[];
    if (res.length === 0) {
      setUsernameError('');
    } else {
      const [err] = res;
      setUsernameError(err.message);
    }
  };

  const validatePassword = () => {
    const res = passwordValidatorSchema.validate(password, { details: true }) as any[];
    if (res.length === 0) {
      setPasswordError('');
    } else {
      const [err] = res;
      setPasswordError(err.message);
    }
  };

  const validateEmail = () => {
    const valid = Isemail.validate(email);
    if (valid) {
      setEmailError('');
    } else {
      setEmailError('Invalid email address');
    }
  };

  const doRegister = () => {
    if (usernameError === '' && passwordError === '' && emailError === '') {
      axios.post('/account/register', { username, password, email })
        .then(() => { navigate('/'); })
        .catch(() => {
          setErrorMessage('Invalid Details');
        });
    } else {
      setErrorMessage('Invalid Details');
    }
  };

  const doLogin = () => {
    axios.post('/account/login', { username, password })
      .then(() => { navigate('/'); })
      .catch(() => {
        setErrorMessage('Invalid Details');
      });
  };

  const loginClicked = () => {
    if (page === 0) {
      doLogin();
    } else {
      doRegister();
    }
  };

  const tabClicked = (a: any, v: number) => {
    if (v !== page) {
      setErrorMessage('');
      setPage(v);
    }
  };

  useEffect(() => { validateUsername(); setErrorMessage(''); }, [username]);
  useEffect(() => { validatePassword(); setErrorMessage(''); }, [password]);
  useEffect(() => { validateEmail(); setErrorMessage(''); }, [email]);

  const labelText = page === 0 ? 'Login' : 'Register';

  const enableButton = username.trim() !== '' && password !== '' && (page === 0 || (usernameError === '' && passwordError === '' && emailError === '' && email.trim() !== ''));

  return (
    <div>
      <NavBar small />
      <Stack flex={1} justifyContent="center" pt="5rem">
        <Container maxWidth="xs">
          <Paper>
            <Tabs value={page} onChange={tabClicked} variant="fullWidth">
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>
            <Stack p={2} spacing={2} alignItems="center">
              <TextField
                label="Username"
                value={username}
                onChange={({ target: { value } }) => { setUsername(value); }}
                helperText={page === 1 ? usernameError : ''}
                error={page === 1 && usernameError !== ''}
                fullWidth
              />
              <TextField
                label="Password"
                type={passwordHidden}
                value={password}
                onChange={({ target: { value } }) => { setPassword(value); }}
                helperText={page === 1 ? passwordError : ''}
                error={page === 1 && passwordError !== ''}
                InputProps={{
                  endAdornment: <IconButton onClick={() => { setPasswordHidden(passwordHidden === 'password' ? 'text' : 'password'); }}>{passwordHidden === 'password' ? <Visibility /> : <VisibilityOff />}</IconButton>,
                }}
                fullWidth
              />
              <div style={{ width: '100%' }} hidden={page === 0}>
                <TextField
                  label="Email"
                  value={email}
                  onChange={({ target: { value } }) => { setEmail(value); }}
                  helperText={emailError}
                  error={emailError !== ''}
                  fullWidth
                />
              </div>
              <Button disabled={!enableButton} variant="contained" onClick={loginClicked}>{labelText}</Button>
              <div style={{ width: '100%' }} hidden={errorMessage === ''}>
                <Alert variant="outlined" severity="error" onClose={() => { setErrorMessage(''); }}>
                  <AlertTitle>{`Couldn't ${labelText}`}</AlertTitle>
                  {errorMessage}
                </Alert>
              </div>
            </Stack>
          </Paper>
        </Container>
      </Stack>
    </div>
  );
}
