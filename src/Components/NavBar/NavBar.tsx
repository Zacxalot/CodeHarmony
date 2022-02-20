import React from 'react';
import './NavBar.scss';
import { Link } from 'react-router-dom';

interface NavBarProps {
  small?: boolean
}

function NavBar({ small }: NavBarProps) {
  return (
    // Use a smaller font size if the small prop is given
    <nav style={{ fontSize: ((small) ? '1rem' : '2rem') }}>
      <Link to="/">
        <h1>
          Code
          <span>_</span>
          Harmony
        </h1>
      </Link>
    </nav>
  );
}

NavBar.defaultProps = {
  small: false,
};

export default NavBar;
