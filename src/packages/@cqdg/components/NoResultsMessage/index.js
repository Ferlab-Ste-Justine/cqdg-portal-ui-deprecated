/* @flow */
import React from 'react';

import './style.css';

const NoResultsMessage =
  ({ children, style }) => (
    <span
      className="no-results-message"
      style={style}
      >
      {children || 'No results found'}
    </span>
  );


export default NoResultsMessage;
