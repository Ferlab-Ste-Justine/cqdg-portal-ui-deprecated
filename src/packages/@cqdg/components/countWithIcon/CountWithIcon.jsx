import React from 'react';

import './CountWithIcon.css';

const CountWithIcon = ({
  className = '', count, iconType, label,
}) => {
  return (
    <div className={`${className} countwithicon-container`}>
      <img alt={label} src={`/img/${iconType}_icon.svg`} />
      <div className="countwithicon-desc">
        <span className="countwithicon-count">{count}</span>
        <span className="countwithicon-label">{label}</span>
      </div>
    </div>
  );
};

export default CountWithIcon;
