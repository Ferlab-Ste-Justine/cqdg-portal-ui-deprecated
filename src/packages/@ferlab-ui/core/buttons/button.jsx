import React from 'react';
import FiExternalLink from 'react-icons/lib/fa/external-link';

import './button.css';

const Button = ({
  active,
  children,
  defaultIcon = true,
  disabled = false,
  onClick,
  shape = 'rect',
  type = 'normal',
  className,
}) => {
  const buttonAttr = {
    className: `${type} ${shape} ${active ? 'active' : ''} ${className}`,
    disabled,
    onClick,
  };

  if (type === 'text') {
    return (
      <button {...buttonAttr}>
        {children}
      </button>
    );
  }

  return (
    <button {...buttonAttr}>
      {children}
      {' '}
      { type === 'link' && defaultIcon && <FiExternalLink className="link-icon" />}
    </button>
  );
};

export default Button;
