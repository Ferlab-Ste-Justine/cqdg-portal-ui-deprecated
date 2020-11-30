import React from 'react';

import './CardContent.css';

const CardContent = ({ cardType = 'stack', children, className = '' }) => {
  return (
    <div className={`${cardType} ${className}`}>
      {children}
    </div>
  );
};

export default CardContent;
