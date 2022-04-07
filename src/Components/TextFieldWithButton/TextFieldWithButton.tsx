import {
  Box,
  Button, SxProps, TextField, Theme,
} from '@mui/material';
import React, { useState } from 'react';

interface TextFieldWithButtonProps {
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void,
  onClick: () => void,
  buttonText: string,
  label: string,
  helperText: string,
  buttonDisabled?: boolean,
  value?: string | undefined,
  endIcon?: React.ReactNode,
  sx?: SxProps<Theme>,
}

export default function TextFieldWithButton({
  onChange, onClick, buttonText, label, helperText, buttonDisabled, value, endIcon, sx,
}: TextFieldWithButtonProps) {
  const [lastVal, setLastVal] = useState('');

  return (
    <Box component="form" onSubmitCapture={(e: any) => { e.preventDefault(); onClick(); }} sx={sx}>
      <TextField
        InputProps={{
          endAdornment: <Button onClick={() => { onClick(); }} sx={{ height: '3.5rem', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }} variant="contained" disabled={buttonDisabled} endIcon={endIcon || undefined}>{buttonText}</Button>,
          style: { padding: '1px' },
        }}
        onChange={(({ target }) => { onChange(target.value); setLastVal(target.value); })}
        label={label}
        helperText={helperText}
        error={helperText !== ''}
        value={value || lastVal}
        sx={{ width: '100%' }}
      />
    </Box>
  );
}

TextFieldWithButton.defaultProps = {
  buttonDisabled: false,
  value: undefined,
  endIcon: undefined,
  sx: undefined,
};
