// @flow

import React from 'react';

import Tr from './Tr';
import Th from './Th';

import './Table.css';

const Table = ({
  style = {},
  body,
  headings = [],
  subheadings = [],
  ...props
}) => (
  <table style={{ ...style }} {...props}>
    <thead>
      <Tr>
        {headings.map(x => (typeof x === 'string' ? <Th key={x}>{x}</Th> : x))}
      </Tr>
      {!!subheadings.length && (
        <Tr>
          {subheadings.map(
            x => (typeof x === 'string' ? <Th key={x}>{x}</Th> : x)
          )}
        </Tr>
      )}
    </thead>
    {body}
  </table>
);

export default Table;
