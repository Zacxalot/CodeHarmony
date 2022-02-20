import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import './LargeButton.scss';

type LargeLinkButtonProps = PropsWithChildren<{
  to: string,
  emoji?: string,
}>

function LargeLinkButton({ to, emoji, children }: LargeLinkButtonProps) {
  return (
    <Link className="large-button button-hover" to={to}>
      {children}
      <span className="emoji">{emoji}</span>
    </Link>
  );
}

LargeLinkButton.defaultProps = {
  emoji: '😀',
};

export default LargeLinkButton;
