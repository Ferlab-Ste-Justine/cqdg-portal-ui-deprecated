// @flow

import React from 'react';
import Overlay from '@cqdg/relay/ui/Overlay';
import Spinner from '@cqdg/relay/ui/Material';

export const OverlayLoader = ({ loading }) => (
  <Overlay
    show={loading}
    style={{
      position: 'absolute',
      zIndex: 10,
    }}
    >
    <Spinner />
  </Overlay>
);

export const withLoader = (Component) => ({
  Loader = OverlayLoader,
  minHeight,
  style = {
    position: 'relative',
    width: '100%',
  },
  loading,
  firstLoad,
  ...props
}) => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      ...(minHeight ? { minHeight } : {}),
      ...style,
    }}
    >
    {!firstLoad && <Component loading={loading} {...props} />}
    {loading && <Loader loading={loading} />}
  </div>
);

const Loader = ({
  children,
  loading = true,
  height,
  style = {},
  ...props
}) => (
  <div
    style={{
      ...style,
      height: loading
        ? height || '1rem'
        : 'auto',
    }}
    {...props}
    >
    {loading && <OverlayLoader loading={loading} />}
    {children}
  </div>
);

export default Loader;
