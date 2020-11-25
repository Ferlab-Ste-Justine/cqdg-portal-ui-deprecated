// @flow
import React from 'react';

const Tr = ({ children, index = 1, ...props }) => (
  <tr className={index % 2 === 0 ? '' : 'stripped'} {...props}>
    {children}
  </tr>
);

export default Tr;
