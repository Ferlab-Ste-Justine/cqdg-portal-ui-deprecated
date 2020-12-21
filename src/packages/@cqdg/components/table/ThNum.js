// @flow
import React from 'react';
import Th from './Th';

const ThNum = ({
  children, className = '', id = '', ...props
}) => (
  <Th className={`${className} th-number`} id={id} {...props}>{children}</Th>
);

export default ThNum;
