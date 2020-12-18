/* eslint-disable react/destructuring-assignment */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
  compose,
} from 'recompose';

import RelayLoadingContainer from '@ncigdc/components/RelayLoadingContainer';
import ProgressContainer from '@ncigdc/components/ProgressContainer';
import ModalContainer from '@ncigdc/components/ModalContainer';
import withRouter from '@cqdg/utils/withRouter';

import { GlobalTooltip } from '@cqdg/components/Tooltip';
import Routes from '@cqdg/routes';
import NotificationContainer from '@cqdg/components/notification/NotificationContainer';
import Header from '@cqdg/components/header/Header';
import { setLanguageAction } from '@cqdg/store/intl';
import { getBrowserLanguage } from '@cqdg/locales/intl';

import './App.css';

class CqdgApp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.notifications = this.props.notifications;
    props.dispatch(setLanguageAction(getBrowserLanguage()));
  }

  componentDidMount() {
    let lastPathname = this.props.location.pathname;
    this.removeListen = this.props.history.listen(location => {
      if (location.pathname !== lastPathname) {
        window.scrollTo(0, 0);
        lastPathname = location.pathname;
      }
    });
  }

  componentWillUnmount() {
    this.removeListen();
  }

  render() {
    return (
      <Fragment>
        <ProgressContainer />
        <Header />
        <Routes />
        <RelayLoadingContainer />
        <NotificationContainer />
        <ModalContainer />
        <GlobalTooltip />
      </Fragment>
    );
  }
}

export default compose(
  withRouter,
  connect(store => ({
    notifications: store.bannerNotification,
    intl: store.intl, // force rerender on language changes
  }))
)(CqdgApp);
