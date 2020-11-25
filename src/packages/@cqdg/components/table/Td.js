
import React from 'react';

const Td = ({ children, className, ...props }) => (
  <td className={className} {...props}>
    {children}
  </td>
);

export default Td;
