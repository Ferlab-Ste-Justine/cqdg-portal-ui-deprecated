/* @flow */
/* eslint better/no-ifs:0, import/no-commonjs:0, fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay/classic';
import { parse } from 'query-string';
import md5 from 'blueimp-md5';
import urlJoin from 'url-join';
import { RelayNetworkLayer, urlMiddleware } from 'react-relay-network-layer';
import { Provider, connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { PersistGate } from 'redux-persist/lib/integration/react';

import Login from '@ncigdc/routes/Login';
import { redirectToLogin } from '@ncigdc/utils/auth';
import Loader from '@ncigdc/uikit/Loaders/Loader';
import { viewerQuery } from '@ncigdc/routes/queries';
import { API, IS_AUTH_PORTAL, AWG } from '@ncigdc/utils/constants';
import retryMiddleware from '@ncigdc/utils/retryMiddleware';

import setupStore from '@cqdg/store/dux';
import { fetchApiVersionInfo } from '@cqdg/store/dux/versionInfo';
import { fetchUser } from '@cqdg/store/dux/auth';
import { fetchNotifications } from '@cqdg/store/dux/bannerNotification';
import Portal from './Portal';
import features from './features.json';

const retryStatusCodes = [
  500,
  503,
  504,
];

const AccessError = message => {
  const instance = new Error(message);
  instance.name = 'AccessError';
  return instance;
};

Relay.injectNetworkLayer(
  new RelayNetworkLayer([
    urlMiddleware({
      url: req => urlJoin(API, 'graphql'),
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

      if (!IS_AUTH_PORTAL) {
        return next(req);
      }

      req.credentials = 'include';

      const parsedBody = JSON.parse(req.body);
      req.body = JSON.stringify(parsedBody);
      return next(req)
        .then(res => {
          if (!res.ok && !retryStatusCodes.includes(res.status)) {
            throw res;
          }

          const { json } = res;

          const { user } = window.store.getState().auth;

          if (user) {
            if (!json.fence_projects[0]) {
              throw new AccessError('no_fence_projects');
            }

            if (!json.nih_projects) {
              throw new AccessError('no_nih_projects');
            }

            if (!json.intersection[0]) {
              throw new AccessError('no_intersection');
            }
          }

          return res;
        })
        .catch(err => {
          const { user } = window.store.getState().auth;
          if (err.name === 'AccessError') {
            return redirectToLogin(err.message);
          }
            // not able to pass the response status from throw so need to exclude by error message
          const errorMessage = err.message
              ? JSON.parse(err.message).message
              : null;
          if (
            IS_AUTH_PORTAL &&
              user &&
              errorMessage ===
                'Your token is invalid or expired. Please get a new token from GDC Data Portal.'
          ) {
            return redirectToLogin('timeout');
          }
        });
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
  store.dispatch(fetchUser());
  if (!AWG && features.notifications) {
    store.dispatch(fetchNotifications());
  }
}

class RelayRoute extends Relay.Route {
  static routeName = 'RootRoute';

  static queries = viewerQuery;
}

const HasUser = connect(state => state.auth)(props => {
  return props.children({
    error: props.error,
    failed: props.failed,
    user: props.user,
  });
});

const Root = (rootProps: mixed) => (
  <Provider store={store}>
    <PersistGate loading={<Loader />} persistor={persistor}>
      <Router>
        <React.Fragment>
          {IS_AUTH_PORTAL ? (
            <Switch>
              <Route component={Login} exact path="/login" />
              <Route
                render={routeProps => (
                  <HasUser>
                    {({ error, failed, user }) => {
                      // if user request fails
                      if (
                        failed &&
                        error.message === 'Session timed out or not authorized'
                      ) {
                        return <Redirect to="/login?error=timeout" />;
                      }
                      if (failed) {
                        return <Redirect to="/login" />;
                      }
                      if (user) {
                        return (
                          <Relay.Renderer
                            Container={Portal}
                            environment={Relay.Store}
                            queryConfig={new RelayRoute(routeProps)}
                            />
                        );
                      }
                      return <Redirect to="/login" />;
                    }}
                  </HasUser>
                )}
                />
            </Switch>
          ) : (
            <Relay.Renderer
              Container={Portal}
              environment={Relay.Store}
              queryConfig={new RelayRoute(rootProps)}
              />
          )}
        </React.Fragment>
      </Router>
    </PersistGate>
  </Provider>
);

export default Root;
