import React from 'react';
import './CHButton.scss';

interface ButtonProps {
  text: string;
  colour?: string;
  callback?: () => void;
  fontBlack?: boolean;
  disabled?: boolean;
}

function CHButton({
  text, colour, callback, fontBlack, disabled,
}: ButtonProps) {
  return (
    <button
      className={`${disabled ? 'ch-button-disabled' : ''} ch-button`}
      disabled={disabled}
      style={{ backgroundColor: colour, color: (fontBlack ? 'black' : 'white') }}
      onClick={callback}
      type="button"
    >
      {text}
    </button>
  );
}

CHButton.defaultProps = {
  disabled: false,
  colour: '#65dd44',
  callback: () => { },
  fontBlack: false,
};

export default CHButton;
