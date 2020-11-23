import React from 'react';

import IoArrowForward from 'react-icons/lib/io/arrow-right-c';

import t from '@cqdg/locales/intl';
import CountWithIcon from '@cqdg/components/countWithIcon/CountWithIcon';
import CardContainerNotched from '@cqdg/components/cards/CardContainerNotched';
import Button from '@ferlab-ui/core/buttons/button';
import Link from '@ferlab-ui/core/buttons/link';
import CardContent from '@ferlab-ui/cards/CardContent';

import './home.css';

const HomePage = () => {
  return (
    <React.Fragment>
      <main className="home-main">
        <div className="contentWrapper">
          <section className="hero">
            <div>
              <div className="description">
                <h2>{t('home.hero.subtitle')}</h2>
                <h1>{t('home.hero.title')}</h1>
                <p>{t('home.hero.text')}</p>
              </div>
              <div className="buttons">
                <Button type="primary">
                  {t('home.hero.buttons.connection')}
                  {' '}
                  <IoArrowForward />
                </Button>
                <Button type="hollow">{t('home.hero.buttons.account')}</Button>
              </div>
            </div>
            <div className="data">
              <CardContainerNotched>
                <CardContent cardType="header2Column">
                  <div className="header">
                    <h2>{t('home.hero.data.header')}</h2>
                    <span>{t('home.hero.data.subtitle')}</span>
                  </div>
                  <CountWithIcon count="3" iconType="study" label={t('home.hero.data.groups.study')} />
                  <CountWithIcon count="3" iconType="donor" label={t('home.hero.data.groups.donor')} />
                  <CountWithIcon count="3" iconType="genome" label={t('home.hero.data.groups.genome')} />
                  <CountWithIcon count="3" iconType="exome" label={t('home.hero.data.groups.exome')} />
                  <CountWithIcon count="3" iconType="file" label={t('home.hero.data.groups.file')} />
                  <CountWithIcon count="3" iconType="storage" label={t('home.hero.data.groups.size')} />
                </CardContent>
              </CardContainerNotched>
            </div>
          </section>
          <section className="graphs">
            <CardContainerNotched className="graph" type="hovered">
              <CardContent cardType="stack">
                <h3>{t('home.graphs.graph1.title')}</h3>
                <img alt={t('home.graphs.graph1.title')} src="/img/horizontal_bar_chart.png" />
              </CardContent>
            </CardContainerNotched>
            <CardContainerNotched className="graph" type="hovered">
              <CardContent cardType="stack">
                <h3>{t('home.graphs.graph2.title')}</h3>
                <img alt={t('home.graphs.graph2.title')} src="/img/pie_chart.png" />
              </CardContent>
            </CardContainerNotched>
            <CardContainerNotched className="graph" type="hovered">
              <CardContent cardType="stack">
                <h3>{t('home.graphs.graph3.title')}</h3>
                <img alt={t('home.graphs.graph3.title')} src="/img/bar_chart.png" />
              </CardContent>
            </CardContainerNotched>
          </section>
          <section className="bottom-links">
            <div className="bottom-links-text">
              <h2>{t('home.cards.text.block.title')}</h2>
              <p>{t('home.cards.text.block.text')}</p>
            </div>
            <div className="bottom-links-cards">
              <Link defaultIcon={false} href="https://docs.qa.cqdg.ferlab.bio/" target="_blank">
                <CardContainerNotched className="card-container" type="hover">
                  <CardContent cardType="stack-center">
                    <img alt="Cloud Icon" src="/img/doc_icon.svg" />
                    <h3>{t('home.cards.card1.title')}</h3>
                    <p>{t('home.cards.card1.text')}</p>
                  </CardContent>
                </CardContainerNotched>
              </Link>
              <Link defaultIcon={false} href="https://docs.qa.cqdg.ferlab.bio/dictionary/" target="_blank">
                <CardContainerNotched className="card-container" type="hover">
                  <CardContent cardType="stack-center">
                    <img alt="Cloud Icon" src="/img/data_icon.svg" />
                    <h3>{t('home.cards.card2.title')}</h3>
                    <p>{t('home.cards.card2.text')}</p>
                  </CardContent>
                </CardContainerNotched>
              </Link>
              <Link defaultIcon={false} href="https://docs.qa.cqdg.ferlab.bio/docs/submission/submitting-clinical-data/" target="_blank">
                <CardContainerNotched className="card-container" type="hover">
                  <CardContent cardType="stack-center">
                    <img alt="Cloud Icon" src="/img/cloud_icon.svg" />
                    <h3>{t('home.cards.card3.title')}</h3>
                    <p>{t('home.cards.card3.text')}</p>
                  </CardContent>
                </CardContainerNotched>
              </Link>
            </div>
          </section>
        </div>
      </main>
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
    </React.Fragment>
  );
};

export default HomePage;
