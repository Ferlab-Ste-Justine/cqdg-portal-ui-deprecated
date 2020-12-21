// @flow
import React from 'react';
import Td from './Td';

const TdNum = ({ children, className = '', ...props }) => (
  <Td className={`${className} td-number`} {...props}>{children}</Td>
);


export default TdNum;
