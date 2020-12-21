import React from 'react';
import { Tooltip } from '@cqdg/components/Tooltip';
import SparkMeter from '@cqdg/components/SparkMeter';

const SparkMeterWithTooltip = ({ part, whole }) => (
  <Tooltip Component={`${(part / whole * 100).toFixed(2)}%`}>
    <SparkMeter
      aria-label={`${(part / whole * 100).toFixed(2)}%`}
      value={part / whole}
      />
  </Tooltip>
);


export default SparkMeterWithTooltip;
