// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { apiMiddleware } from 'redux-api-middleware';
import reducers from './reducers';

type TSetupStoreArgs = {
  persistConfig: Record<string, any>;
};
type TSetupStore = (args: TSetupStoreArgs) => Record<string, any>;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const setupStore: TSetupStore = ({ persistConfig = {} } = {}) => {
  const config = {
    key: 'reducers',
    storage,
    whitelist: [
      'auth',
      'bannerNotification',
      'cart',
      'customFacets',
      'facetsExpandedStatus',
      'sets',
      'tableColumns',
    ],
    debug: process.env.NODE_ENV === 'development',
    ...persistConfig,
  };

  const store = createStore(
    persistCombineReducers(config, reducers),
    composeEnhancers(applyMiddleware(thunk, apiMiddleware))
  );

  const persistor = persistStore(store);

  return {
    store,
    persistor,
  };
};

export default setupStore;
