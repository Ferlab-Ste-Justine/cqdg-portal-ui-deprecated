/* @flow */
/* eslint better/no-ifs:0, import/no-commonjs:0, fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay/classic';
import { parse } from 'query-string';
import md5 from 'blueimp-md5';
import urlJoin from 'url-join';
import { RelayNetworkLayer, urlMiddleware } from 'react-relay-network-layer';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import { PersistGate } from 'redux-persist/lib/integration/react';

import Loader from '@cqdg/relay/ui/Loader';
import { API } from '@cqdg/utils/constants';
import { viewerQuery } from '@cqdg/relay/queries';
import retryMiddleware from '@cqdg/relay/retryMiddleware';
import setupStore from '@cqdg/store/dux';
import { fetchApiVersionInfo } from '@cqdg/store/dux/versionInfo';
import { fetchNotifications } from '@cqdg/store/dux/bannerNotification';
import Portal from './Portal';
import features from './features.json';

const retryStatusCodes = [
  500,
  503,
  504,
];

Relay.injectNetworkLayer(
  new RelayNetworkLayer([
    urlMiddleware({
      url: () => urlJoin(API, 'graphql'),
    }),
    retryMiddleware({
      fetchTimeout: 15000,
      forceRetry: (cb, delay) => {
        window.forceRelayRetry = cb;
        console.log(
          `call \`forceRelayRetry()\` for immediately retry! Or wait ${delay} ms.`
        );
      },
      retryDelays: attempt => ((attempt + 4) ** 2) * 100,
      statusCodes: retryStatusCodes,
    }),
    // Add hash id to request
    next => req => {
      const [url, search = ''] = req.url.split('?');
      const hash =
        parse(search).hash ||
        md5(
          [req.relayReqObj._printedQuery.text, JSON.stringify(req.relayReqObj._printedQuery.variables)].join(':')
        );

      req.url = `${url}?hash=${hash}`;

      return next(req);
    },
  ])
);

export const { persistor, store } = setupStore({
  persistConfig: {
    keyPrefix: 'ncigdcActive',
  },
});

window.store = store;

store.dispatch(fetchApiVersionInfo());

if (process.env.NODE_ENV !== 'development') {
  if (features.notifications) {
    store.dispatch(fetchNotifications());
  }
}

class RelayRoute extends Relay.Route {
  static routeName = 'RootRoute';

  static queries = viewerQuery;
}

const Root = (rootProps: mixed) => (
  <Provider store={store}>
    <PersistGate loading={<Loader />} persistor={persistor}>
      <Router>
        <React.Fragment>
          <Relay.Renderer
            Container={Portal}
            environment={Relay.Store}
            queryConfig={new RelayRoute(rootProps)}
            />
        </React.Fragment>
      </Router>
    </PersistGate>
  </Provider>
);

export default Root;
