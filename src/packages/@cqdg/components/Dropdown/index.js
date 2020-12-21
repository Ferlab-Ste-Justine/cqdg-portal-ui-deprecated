// @flow

import React from 'react';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';
import StackLayout from 'cqdg-ui/core/layouts/StackLayout';
import withDropdown from './withDropdown';

import './style.css';

const Dropdown = ({
  active,
  autoclose = true,
  button = null,
  children,
  className,
  dropdownClassName = '',
  isDisabled = false,
  selected,
  setActive,
  style,
}) => (
  <span
    className={`${className} dropdown`}
    style={{
      position: 'relative',
      ...style,
    }}
    >
    <span onClick={e => !isDisabled && setActive(!active)}>
      {button || (
        <StackLayout className="dropdown-button">
          <span>{selected}</span>
          <DownCaretIcon style={{ marginLeft: 'auto' }} />
        </StackLayout>
      )}
    </span>
    {active && (
      <StackLayout
        className={`${dropdownClassName} dropdown-items`}
        onClick={e => !autoclose && e.stopPropagation()}
        vertical
        >
        {children}
      </StackLayout>
    )}
  </span>
);

export default withDropdown(Dropdown);
