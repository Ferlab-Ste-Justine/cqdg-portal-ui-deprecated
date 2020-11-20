import React from 'react';
import FiExternalLink from 'react-icons/lib/fa/external-link';

import './link.css';

const Link = ({
  children,
  className = '',
  defaultIcon = true,
  disabled = false,
  href,
  target,
  type = '',
}) => {
  return (
    <a className={`${type} ${className}`} disabled={disabled} href={href} target={target}>
      {children}
      {' '}
      { defaultIcon && <FiExternalLink className="link-icon" />}
    </a>
  );
};

export default Link;
