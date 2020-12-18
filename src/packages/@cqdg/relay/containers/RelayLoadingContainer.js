// @flow
import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  pure,
  setDisplayName,
} from 'recompose';
import Overlay from '@cqdg/relay/ui/Overlay';
import Particle from '@cqdg/relay/ui/Particle';

const RelayLoadingContainer = ({ relayLoading }) => (
  <Overlay className="test-loading-container" show={relayLoading}>
    {relayLoading && <Particle />}
  </Overlay>
);

export default compose(
  setDisplayName('EnhancedRelayLoadingContainer'),
  connect(state => ({ relayLoading: state.relayLoading })),
  pure,
)(RelayLoadingContainer);
