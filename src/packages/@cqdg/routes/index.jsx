import React, { Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Head from '@cqdg/components/head';
import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';

const HomePage = LoadableWithLoading({
  loader: () => import('@cqdg/pages/home'),
});

const CartRoute = LoadableWithLoading({
  loader: () => import('@ncigdc/routes/CartRoute'),
});

const RepositoryRoute = LoadableWithLoading({
  loader: () => import('@cqdg/pages/FileRepository/RelayRoute'),
});

const StudyRoute = LoadableWithLoading({
  loader: () => import('@cqdg/pages/Study/StudyPage'),
});

const Routes = () => (
  <Fragment>
    <Route>
      {({ location: { pathname } }) => <Head path={pathname.split('/')[1]} />}
    </Route>
    <Switch>
      <Route component={() => (<Redirect to="/home" />)} exact path="/" />
      <Route component={CartRoute} exact path="/cart" />
      <Route component={RepositoryRoute} exact path="/files" />
      <Route component={StudyRoute} exact path="/studies" />
      <Route component={HomePage} exact path="/home" />
    </Switch>
  </Fragment>
);

export default Routes;
