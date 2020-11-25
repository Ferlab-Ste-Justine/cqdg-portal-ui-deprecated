// @flow
import React from 'react';
import styled from '@ncigdc/theme/styled';

const TableRow = styled.tr({
  backgroundColor: ({ striped }) =>
    (striped ? '#fff' : '#F8F9FC'),
});

const Tr = ({
  style = {}, children, index = 1, ...props
}) => (
  <TableRow striped={index % 2 === 0} style={style} {...props}>
    {children}
  </TableRow>
);

export default Tr;
