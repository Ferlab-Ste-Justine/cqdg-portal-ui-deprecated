// @flow

// Vendor
import React from 'react';
import PropTypes from 'prop-types';
import {
  compose, withState, shouldUpdate, mapProps,
} from 'recompose';
import CloseIcon from 'react-icons/lib/md/close';

// Custom
import { center, zDepth1 } from '@ncigdc/theme/mixins';

/*----------------------------------------------------------------------------*/

const styles = {
  wrapper: {
    position: 'fixed',
    top: 0,
    width: '100vw',
    zIndex: 100,
    pointerEvents: 'none',
    textAlign: 'left',
    wordBreak: 'break-word',
    overflow: 'hidden',
    ...center,
  },
  container: {
    margin: '1rem 0',
    transition: 'transform 0.25s ease',
  },
  inactive: {
    transform: 'translateY(-150px)',
  },
  active: {
    transform: 'translateY(0)',
  },
  info: {
    color: '#5C5151',
    backgroundColor: '#EDF8FB',
    border: '1px solid #B4CCD4',
  },
  add: {
    color: '#575A00',
    backgroundColor: '#EAEBC2',
    boxShadow: '0px 4px 12px rgba(47, 94, 125, 0.18)',
    borderRadius: '2px',
  },
  remove: {
    color: '#735A00',
    backgroundColor: '#FFEEC2',
    boxShadow: '0px 4px 12px rgba(47, 94, 125, 0.18)',
    borderRadius: '2px',
  },
  warning: {
    color: '#86291B',
    backgroundColor: '#F1D4CF',
    boxShadow: '0px 4px 12px rgba(47, 94, 125, 0.18)',
    borderRadius: '2px',
  },
  toast: {
    position: 'relative',
    padding: '8px 16px',
    width: '40rem',
    borderRadius: '10px',
    pointerEvents: 'all',
    ...zDepth1,
  },
  closeIcon: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    cursor: 'pointer',
    ':hover': {
      color: 'red',
    },
  },
};

const Notification = ({
  action,
  children,
  className,
  close,
  closed,
  style,
  visible,
}) => (
  <div className={className} style={styles.wrapper}>
    <div
      className="test-notification"
      role="complementary"
      style={{
        ...styles.container,
        ...(visible && !closed ? styles.active : styles.inactive),
        ...style,
      }}
      >
      <div
        style={{
          ...styles.toast,
          ...(styles[action] || styles.add),
        }}
        >
        <CloseIcon onClick={close} style={styles.closeIcon} />
        {children}
      </div>
    </div>
  </div>
);

Notification.propTypes = {
  action: PropTypes.string,
  children: PropTypes.node,
  close: PropTypes.func,
  delay: PropTypes.number,
  id: PropTypes.string,
  style: PropTypes.object,
  visible: PropTypes.bool,
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
