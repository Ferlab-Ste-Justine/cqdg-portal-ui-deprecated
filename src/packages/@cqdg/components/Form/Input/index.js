// @flow

import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ getNode = null, ...props }) => (
  <input
    aria-label="text"
    ref={getNode}
    type="text"
    {...props}
    />
);

Input.propTypes = {
  getNode: PropTypes.func,
};

export default Input;
