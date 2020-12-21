import React from 'react';
import './style.css';

const Sparkmeter = ({
  max = 30, style, value, width = 30, ...props
}) => (
  <div
    className="spark-meter-container"
    style={{
      width,
      ...style,
    }}
    {...props}
    >
    <div
      className="spark-meter"
      style={{
        width: value > 0 ? Math.max(value * max, 2) : 0,
      }}
      />
  </div>
);

export default Sparkmeter;
