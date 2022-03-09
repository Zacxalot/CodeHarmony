import React from 'react';
import { OverridableStringUnion } from '@mui/types';
import { Variant } from '@mui/material/styles/createTypography';
import { Stack, Typography, TypographyPropsVariantOverrides } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface CodeHarmonyLogoProps {
  variant?: OverridableStringUnion<Variant | 'inherit', TypographyPropsVariantOverrides>;
  linked?: Boolean,
}

export default function CodeHarmonyLogo({ variant, linked }: CodeHarmonyLogoProps) {
  const navigate = useNavigate();

  const navLink = () => {
    if (linked) {
      navigate('/');
    }
  };

  return (
    <Typography variant={variant} fontWeight={700} sx={{ userSelect: 'none', cursor: linked ? 'pointer' : 'default' }} color="text.primary" onClick={navLink}>
      Code
      <Stack component="span" style={{ display: 'inline' }} sx={{ color: 'primary.main' }}>_</Stack>
      Harmony
    </Typography>
  );
}

CodeHarmonyLogo.defaultProps = {
  variant: 'h6',
  linked: true,
};
