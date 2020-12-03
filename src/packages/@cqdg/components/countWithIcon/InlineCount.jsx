import React from 'react';

import t from '@cqdg/locales/intl';

import './InlineCount.css';

const InlineCount = ({
  className, Icon, iconClassName, label, total,
}) => {
  const labelTranslated = t(label) || label;
  return (
    <div className={`inline-count-container ${className}`}>
      <Icon className={`icon-count ${iconClassName}`} />
      <span>
        {total}
        {' '}
        {labelTranslated}
      </span>
    </div>
  );
};

export default InlineCount;
