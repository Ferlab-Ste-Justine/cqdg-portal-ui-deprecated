/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import CQDGPortal from '@cqdg/App';

import './style/themes/default/main.css';
import './style/themes/default/colors.css';

const PortalQuery = {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        File { hits { total } }
      }
    `,
  },
};

const Portal = Relay.createContainer(CQDGPortal, PortalQuery);

export default Portal;
