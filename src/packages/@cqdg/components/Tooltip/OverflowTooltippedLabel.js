// @flow
import React from 'react';
import { compose, withState } from 'recompose';

import withTooltip from '@cqdg/components/Tooltip/withTooltip';

const OverflowTooltippedLabel = compose(
  withTooltip,
  withState('hasTooltip', 'setHasTooltip', false),
)(
  class extends React.Component {
    render() {
      const {
        children,
        hasTooltip,
        htmlFor,
        props,
        setHasTooltip,
        setTooltip,
        style,
      } = this.props;
      return (
        <label
          htmlFor={htmlFor}
          onMouseOut={() => hasTooltip && setTooltip()}
          onMouseOver={() => hasTooltip && setTooltip(children)}
          ref={el => {
            if (!hasTooltip && el) {
              if (el.clientWidth < el.scrollWidth) {
                setHasTooltip(true);
              }
            }
          }}
          style={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            minWidth: 0,
            overflow: 'hidden',
            padding: '0 0.25rem',
            ...style,
          }}
          {...props}
          >
          {children}
        </label>
      );
    }
  },
);

export default OverflowTooltippedLabel;
