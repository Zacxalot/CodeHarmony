import React from 'react';
import { OverridableStringUnion } from '@mui/types';
import { Variant } from '@mui/material/styles/createTypography';
import { Stack, Typography, TypographyPropsVariantOverrides } from '@mui/material';
import { Link } from 'react-router-dom';

interface CodeHarmonyLogoProps {
  variant?: OverridableStringUnion<Variant | 'inherit', TypographyPropsVariantOverrides>;
  linked?: Boolean,
}

export default function CodeHarmonyLogo({ variant, linked }: CodeHarmonyLogoProps) {
  if (linked) {
    return (
      <Typography variant={variant} fontWeight={700} sx={{ userSelect: 'none', textDecoration: 'none' }} color="text.primary" component={Link} to="/">
        Code
        <Stack component="span" style={{ display: 'inline' }} sx={{ color: 'primary.main' }}>_</Stack>
        Harmony
      </Typography>
    );
  }

  return (
    <Typography variant={variant} fontWeight={700} sx={{ userSelect: 'none', textDecoration: 'none' }} color="text.primary">
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
