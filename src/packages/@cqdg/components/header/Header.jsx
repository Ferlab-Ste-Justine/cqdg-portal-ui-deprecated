/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { connect } from 'react-redux';

import { compose } from 'recompose';
import GoInboxIcon from 'react-icons/lib/go/inbox';
import GoDatabaseIcon from 'react-icons/lib/fa/file-text';
import UserLock from 'react-icons/lib/fa/lock';
import Button from '@ferlab-ui/core/buttons/button';
import t from '@cqdg/locales/intl';
import Link from '@ferlab-ui/core/buttons/link';
import { withRouter } from 'react-router-dom';
import { setLanguageAction } from '@cqdg/store/intl';
import '@cqdg/components/header/Header.css';
import CartIcon from "@cqdg/components/icons/CartIcon";

const Header = (props) => {
  const { history, intl, setLanguage } = props;
  const { push } = history;
  const { location } = window;
  return (
    <header id="header" role="banner">
      <img
        alt={t('global.cqdg')}
        className="logo"
        onClick={() => push('/home')}
        src="img/logo.svg"
        />
      <div className="nav">
        <Button
          active={location.pathname === '/files'}
          onClick={() => push('/files')}
          type="navigation"
          >
          <GoDatabaseIcon />
          {t('nav.file.repo')}
        </Button>
        <Button
          active={location.pathname === '/studies'}
          onClick={() => push('/studies')}
          type="navigation"
          >
          <GoInboxIcon />
          {t('nav.studies')}
        </Button>
      </div>
      <div className="actions">
        <Link className="big" defaultIcon={false} href="/">
          <UserLock className="big" />
          {t('global.login')}
        </Link>
        <div className="separator" />
        <Link href="/cart" className="big" defaultIcon={false}>
          <CartIcon className="big cart"/>
          {t('global.cart')}
        </Link>
        <div className="separator" />
        <Link href="https://docs.qa.cqdg.ferlab.bio/">
          {t('global.documentation')}
        </Link>
        <Link href="https://cqdg.ca/en.html">{t('nav.website')}</Link>
        <Button
          onClick={() => {
            setLanguage(intl.langCode === 'fr' ? 'en' : 'fr');
          }}
          shape="circle"
          >
          {intl.langCode === 'fr' ? 'EN' : 'FR'}
        </Button>
      </div>
    </header>
  );
};

const MapDispatchToProps = (dispatch) => ({
  setLanguage: (langCode) => {
    dispatch(setLanguageAction(langCode));
  },
});

export default compose(
  withRouter,
  connect((store) => ({ intl: store.intl }), MapDispatchToProps),
)(Header);
