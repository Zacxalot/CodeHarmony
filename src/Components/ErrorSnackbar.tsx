import { Alert, AlertColor, Snackbar } from '@mui/material';
import React from 'react';

interface ErrorSnackbarProps {
  message: string,
  onClose: () => void,
  severity?: AlertColor,
}

export default function ErrorSnackbar({ message, onClose, severity }: ErrorSnackbarProps) {
  return (
    <Snackbar open={message !== ''} autoHideDuration={5000} onClose={onClose} anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}>
      <Alert severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}

ErrorSnackbar.defaultProps = {
  severity: 'error',
};
