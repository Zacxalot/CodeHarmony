import React from 'react';
import { Paper } from '@mui/material';
import { lightTheme } from '../Theme';

interface ImageProps {
  src: string,
  alt: string,
}

export default function Image({ src, alt }: ImageProps) {
  return (
    <img src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: lightTheme.shape.borderRadius }} />
  );
}
