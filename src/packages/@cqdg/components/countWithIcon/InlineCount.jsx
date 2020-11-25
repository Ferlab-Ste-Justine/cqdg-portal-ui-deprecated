import React from 'react';

import t from '@cqdg/locales/intl';

import './InlineCount.css';

const InlineCount = ({ Icon, label, total }) => {
  const labelTranslated = t(label) || label;
  return (
    <div className="inline-count-container">
      <Icon className="icon-count" />
      <span>
        {total}
        {' '}
        {labelTranslated}
      </span>
    </div>
  );
};

export default InlineCount;
