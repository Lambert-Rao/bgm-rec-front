import React from 'react';
import './ErrorDisplay.css';

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => {
  return <div className="error">{message}</div>;
};

export default ErrorDisplay;