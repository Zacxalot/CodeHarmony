import React, { PropsWithChildren } from 'react';
import '../LargeLinkButton/LargeButton.scss';

type LargeCallbackButtonProps = PropsWithChildren<{
  callback: () => void,
  emoji?: string
}>

function LargeCallbackButton({ callback, emoji, children }: LargeCallbackButtonProps) {
  return (
    <button className="large-button button-hover" onClick={callback} type="button">
      {children}
      <span className="emoji">{emoji}</span>
    </button>
  );
}

LargeCallbackButton.defaultProps = {
  emoji: '😀',
};

export default LargeCallbackButton;
