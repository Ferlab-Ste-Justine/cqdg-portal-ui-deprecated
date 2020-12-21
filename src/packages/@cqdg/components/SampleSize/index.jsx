import React from 'react';

import './style.css';

const SampleSize = ({
  n,
  formatter = x => x.toLocaleString(),
  symbol = 'n',
}) => (
  <span
    className="sample-size"
    >
    <small>( </small>
    {' '}
    {symbol}
=
    {n ? formatter(n) : '--'}
    <small> )</small>
  </span>
);

export default SampleSize;
