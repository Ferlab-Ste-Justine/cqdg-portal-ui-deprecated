// @flow
import React from 'react';

const Th = ({ children, className, ...props }) => (
  <th className={className} {...props}>{children}</th>
);

export default Th;
