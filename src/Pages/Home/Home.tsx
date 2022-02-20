import React from 'react';
import {
  Link,
} from 'react-router-dom';
import './Home.scss';
import NavBar from '../../Components/NavBar/NavBar';

function HomePage() {
  return (
    <div className="full-page">
      <NavBar />
      <div className="selection-card-area page-container">
        <Link to="/s/dashboard" className="selection-card-link">
          <h1>I&apos;m a student</h1>
          <span className="large-emoji">🙋</span>
        </Link>
        <Link to="/t/dashboard" className="selection-card-link">
          <h1>I&apos;m a teacher</h1>
          <span className="large-emoji">👨‍🏫️</span>
        </Link>
      </div>

    </div>
  );
}

export default HomePage;
