// @flow

import React from 'react';
import PropTypes from 'prop-types';

/*----------------------------------------------------------------------------*/

const Input = ({ getNode = null, style, ...props }) => (
  <input
    aria-label="text"
    ref={getNode}
    type="text"
    {...props}
    />
);

Input.propTypes = {
  getNode: PropTypes.func,
  onChange: PropTypes.func,
  style: PropTypes.object,
};

/*----------------------------------------------------------------------------*/

export default Input;
