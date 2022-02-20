import React from 'react';
import './RunbarButton.scss';
import runImg from '../../Vectors/run.svg';

interface ButtonProps {
  icon: string;
  callback: () => void;
  backgroundColour?: string;
}

// Objects to define icon paths and alt text
const altIconNames: { [key: string]: string } = {
  run: 'Run Icon',
};

const iconPaths: { [key: string]: string } = {
  run: runImg,
};

function RunbarButton({
  icon, callback, backgroundColour,
}: ButtonProps) {
  return (
    <button className="runbar-button button-hover" style={{ backgroundColor: backgroundColour }} onClick={callback} type="button">
      <img className="runbar-button-icon" draggable="false" alt={altIconNames[icon]} src={iconPaths[icon]} />
      <span style={{ display: 'block' }}>Run</span>
    </button>
  );
}

RunbarButton.defaultProps = {
  backgroundColour: '#9f35f5',
};

export default RunbarButton;
