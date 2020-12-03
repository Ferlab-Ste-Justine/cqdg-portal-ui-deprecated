// @flow
import React from 'react';
import Th from './Th';

const ThNum = ({ children, className, id = '', ...props }) => (
  <Th id={id} className={`${className} th-number`} {...props}>{children}</Th>
);

export default ThNum;
