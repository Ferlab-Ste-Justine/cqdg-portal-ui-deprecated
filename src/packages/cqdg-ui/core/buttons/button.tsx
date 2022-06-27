/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import FiExternalLink from 'react-icons/lib/fa/external-link';

import './button.css';

interface IButtonProps {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  defaultIcon?: boolean;
  disabled?: boolean;
  onClick: () => void;
  shape?: string;
  type?: string;
}

const Button = ({
  active = true,
  children,
  className = '',
  defaultIcon = true,
  disabled = false,
  onClick,
  shape = 'rect',
  type = 'normal',
}: IButtonProps) => {
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
