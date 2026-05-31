import React from 'react';

const GalaxyButton = ({ children, onClick, disabled, type = "button", className = "", ...props }) => {
  return (
    <div className={`galaxy-button-wrapper ${className}`}>
      <button
        className="uiverse"
        onClick={onClick}
        disabled={disabled}
        type={type}
        {...props}
      >
        <div className="wrapper">
          <span className="content-span">{children || "UIVERSE"}</span>
          {/* Circles spread across the button */}
          <div className="circle circle-1" />
          <div className="circle circle-2" />
          <div className="circle circle-3" />
          <div className="circle circle-4" />
          <div className="circle circle-5" />
          <div className="circle circle-6" />
          <div className="circle circle-7" />
          <div className="circle circle-8" />
          <div className="circle circle-9" />
          <div className="circle circle-10" />
          <div className="circle circle-11" />
          <div className="circle circle-12" />
        </div>
      </button>
    </div>
  );
}

export default GalaxyButton;
