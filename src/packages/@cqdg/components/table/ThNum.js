// @flow
import React from 'react';
import Th from './Th';

const ThNum = ({ children, className, ...props }) => (
  <Th className={`${className} th-number`} {...props}>{children}</Th>
);

export default ThNum;
