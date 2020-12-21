// @flow
import React from 'react';
import StackLayout from 'cqdg-ui/core/layouts/StackLayout';
import './style.css';

const DropdownItem = ({ children, className = '', ...props }) => (
  <StackLayout className={`${className} dropdown-item`} {...props}>
    {children}
  </StackLayout>
);

export default DropdownItem;
