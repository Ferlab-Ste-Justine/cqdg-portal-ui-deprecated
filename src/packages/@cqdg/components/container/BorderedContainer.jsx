import React from 'react';
import StackLayout from '@ferlab-ui/core/layouts/StackLayout';

import './BorderedContainer.css';

export const BorderedContainer = ({ children, className = '' }) => (
  <StackLayout className={`bordered-container ${className}`}>
    {children}
  </StackLayout>
);


export default BorderedContainer;
