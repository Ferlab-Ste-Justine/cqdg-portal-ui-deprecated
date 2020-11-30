import React from 'react';
import get from 'lodash/get';

import './CardContainerNotched.css';

const CardContainerNotched = ({ children, className = '', type = '' }) => {
  const containerType = {
    hovered: 'card--notched-hovered',
    hover: 'card--notched-hover',
    header: 'card--notched-header',
  };

  const cardTypeClassName = get(containerType, type, '');
  return (
    <div className={`card--notched ${cardTypeClassName} ${className}`}>
      <div aria-hidden="true" className="notch-top">
        <svg className="notch notch--top" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0)">
            <path className="notch__triangle" d="M24 24H0L24 0v24z" />
            <path className="notch__border" d="M23.782-1l.707.707L-.292 24.49-1 23.782z" />
          </g>
          <defs>
            <clipPath id="clip0">
              <path d="M0 0h24v24H0z" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div className="notch-content">
        {children}
      </div>
      <div aria-hidden="true" className="notch-btm">
        <svg className="notch notch--btm" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0)">
            <path className="notch__triangle" d="M0 0h24L0 24V0z" />
            <path className="notch__border" d="M.219 25l-.708-.707L24.293-.49 25 .218.219 25z" />
          </g>
          <defs>
            <clipPath id="clip0">
              <path d="M0 0h24v24H0z" />
            </clipPath>
          </defs>
        </svg>

      </div>
    </div>
  );
};


export default CardContainerNotched;
