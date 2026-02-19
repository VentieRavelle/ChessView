import React from 'react';
import '@styles/loader.scss';

const Loader: React.FC = () => {
  return (
    <div className="loader-page">
      <div className="minimal-loader">
        <div className="grid-indicator">
          <div className="square"></div>
          <div className="square"></div>
          <div className="square"></div>
          <div className="square"></div>
        </div>
        
        <div className="loader-info">
          <span className="loading-word">Loading</span>
          <div className="dot-staircase">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;