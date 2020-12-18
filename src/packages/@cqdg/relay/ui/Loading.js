/* @flow */

import React from 'react';
import Overlay from '@cqdg/relay/ui/Overlay';
import Spinner from '@cqdg/relay/ui/Material';

const Loading = ({
  error,
  isLoading,
  pastDelay,
  timedOut,
}: {
  isLoading: boolean;
  timedOut: boolean;
  pastDelay: boolean;
  error: boolean;
}) => {
  if (isLoading) {
    // While our other component is loading...
    if (timedOut) {
      // In case we've timed out loading our other component.
      return <div>Loader timed out!</div>;
    } if (pastDelay) {
      // Display a loading screen after a set delay.
      return (
        <Overlay
          show
          style={{
            position: 'absolute',
            zIndex: 10,
          }}
          >
          <Spinner />
        </Overlay>
      );
    }
      // Don't flash "Loading..." when we don't need to.
    return null;
  } if (error) {
    // If we aren't loading, maybe
    return <div>Error! Component failed to load</div>;
  }
    // This case shouldn't happen... but we'll return null anyways.
  return null;
};

export default Loading;
