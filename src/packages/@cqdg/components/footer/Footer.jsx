import React from 'react';
import t from '@cqdg/locales/intl';
import Link from '@ferlab-ui/core/buttons/link';

import './Footer.css';

const Footer = () => {
  return (
    <footer className="nav-footer">
      <div className="footerWrapper">
        <div className="footerTextWrapper">
          <h3 className="footerTitle">{t('footer.title')}</h3>
          <p className="footerMoreInfo">
            {t('footer.info')}
            {' '}
            <Link defaultIcon={false} href="mailto:support@cqdg.ca" type="underlined">support@cqdg.ca</Link>
          </p>
        </div>
        <div className="footerLogos">
          <Link defaultIcon={false} href={t('footer.logo.genome.link')} target="_blank">
            <img alt="genome" src="/img/genome_qc_logo_RS_icon.svg" />
          </Link>
          <Link defaultIcon={false} href={t('footer.logo.chusj.link')} target="_blank">
            <img alt="chusj" src="/img/chusj_logo_icon.svg" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
