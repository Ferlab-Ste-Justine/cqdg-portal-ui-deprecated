import React from 'react';

import './PieTitle.css';

const PieTitle = ({ children, className }) => (
  <h3 className={`pie-title ${className}`}>
    {children}
  </h3>
);

export default PieTitle;
