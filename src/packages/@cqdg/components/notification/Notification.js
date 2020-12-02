// @flow

// Vendor
import React from 'react';
import PropTypes from 'prop-types';
import {
  compose, withState, shouldUpdate, mapProps,
} from 'recompose';

import CloseIcon from 'react-icons/lib/md/close';

import './Notification.css';

/*----------------------------------------------------------------------------*/

const Notification = ({
  action,
  children,
  className,
  close,
  closed,
  style,
  visible,
}) => (
  <div className={`notification-wrapper ${className}`}>
    <div
      className={`notification-container ${visible && !closed ? 'active' : 'inactive'}`}
      role="complementary"
      style={{
        ...style,
      }}
      >
      <div
        className={`notification-inner-wrapper notification-${action}`}
        >
        <CloseIcon className="notification-close" onClick={close} />
        {children}
      </div>
    </div>
  </div>
);

Notification.propTypes = {
  action: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  close: PropTypes.func,
  delay: PropTypes.number,
  id: PropTypes.string,
  style: PropTypes.object,
  visible: PropTypes.bool,
};

Notification.defaultProps = {
  action: 'add',
  className: '',
};

let timeoutId;
let pageload = false;

const enhance = compose(
  withState('visible', 'setState', false),
  shouldUpdate((props, nextProps) => {
    // Do not render on the first prop update, such as store rehydration
    if (pageload) {
      pageload = false;
      return false;
    }

    // Do not render if no children
    if (!nextProps.children) return false;

    // Do not render if the notification is not up and its children don't change.
    // This catches prop changes that should not affect the notification
    if (props.id === nextProps.id && (!props.visible && !nextProps.visible)) {
      return false;
    }

    function startTimer() {
      timeoutId = setTimeout(() => {
        props.setState(() => false);
      }, nextProps.delay || 5000);
    }

    // If the notification is not up, pop it up and begin the removal timeout
    if (!props.visible && !nextProps.visible) {
      props.setState(() => true);
      if (!nextProps.delay || nextProps.delay > 0) {
        startTimer();
      }
    }

    // If notification is up, refresh timeout when id changes
    if (props.visible && props.id !== nextProps.id) {
      clearTimeout(timeoutId);
      if (!nextProps.delay || nextProps.delay > 0) {
        startTimer();
      }
    }

    return true;
  }),
  mapProps(({ setState, ...rest }) => ({
    close: () => {
      setState(() => false);
      if (timeoutId) clearTimeout(timeoutId);
    },
    ...rest,
  })),
);

/*----------------------------------------------------------------------------*/

export default enhance(Notification);
