import React from 'react';
import Button from '@ferlab-ui/core/buttons/button';

import './ShowToggleBox.css';

const ShowToggleBox = ({ children, className, onClick }) => {
  return (
    <Button className={`show-toggle-box ${className}`} onClick={onClick}>{children}</Button>
  );
};

export default ShowToggleBox;
