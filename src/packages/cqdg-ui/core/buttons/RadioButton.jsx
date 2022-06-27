/* eslint-disable react/no-multi-comp */
import React from 'react';

import './RadioButton.css';

const ButtonGroup = (props) => {
  const {
    children,
    className = '',
    disabled = false,
    value,
  } = props;

  const newChildren = children.map((c) => {
    return React.cloneElement(
      React.Children.only(c),
      {
        checked: value === c.props.value,
      }
    );
  });

  return (
    <div className={`fui-button-group-container ${className}`} disabled={disabled}>
      {newChildren}
    </div>
  );
};

const Button = ({
  checked,
  children,
  className = '',
  disabled = false,
  key,
  onClick,
  value,
}) => {
  const buttonAttr = {
    disabled,
    onClick,
  };
  return (
    <label className={`fui-button-radio-button ${checked ? 'active' : ''} ${className}`} htmlFor={`fui-button-rb-${key}`} onClick={onClick}>
      <input {...buttonAttr} className="fui-button-input" id={`fui-button-rb-${value}`} />
      {children}
    </label>
  );
};

export default {
  Button,
  Group: ButtonGroup,
};
