/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';

import MdPeople from 'react-icons/lib/md/people';
import MdAssignment from 'react-icons/lib/md/assignment';
import FiExternalLink from 'react-icons/lib/fa/external-link';

import Link from '@ncigdc/components/Links/Link';

import StackLayout from '@ferlab-ui/core/layouts/StackLayout';
import InlineCount from '@cqdg/components/countWithIcon/InlineCount';
import CardContainerNotched from '@cqdg/components/cards/CardContainerNotched';
import CardContent from '@ferlab-ui/cards/CardContent';
import CountWithIcon from '@cqdg/components/countWithIcon/CountWithIcon';

import t from '@cqdg/locales/intl';

import './StudyCards.css';

const StudyCards = () => {
  return (
    <div className="studies-cards">
      <StackLayout className="action-bar">
        <InlineCount Icon={MdPeople} label="global.donors" total={999} />
        <div className="separator" />
        <InlineCount Icon={MdAssignment} label="global.studies" total={4} />
      </StackLayout>
      <div className="cards-container">
        <CardContainerNotched className="card-container" type="header">
          <CardContent cardType="headerFooter">
            <header>
              <div className="card-padding">
                <h2 className="header-title">{t('aggregation.st1')}</h2>
                <Link
                  pathname="/files"
                  query={{
                    filters: {
                      content: [
                        {
                          op: 'in',
                          content: {
                            field: 'study.short_name_keyword',
                            value: ['ST1'],
                          },
                        },
                      ],
                      op: 'and',
                    },
                  }}
                  >
                  {t('global.cards.details')}
                  {' '}
                  <FiExternalLink />
                </Link>
              </div>
            </header>
            <div className="card-padding">
              <h2>{t('aggregation.st1')}</h2>
              <p>
                {t('aggregation.st1.desc')}
              </p>
            </div>
            <div className="card-footer card-padding">
              <CountWithIcon count={377} iconType="donor" label={t('global.donors')} />
              <CountWithIcon count={754} iconType="file" label={t('global.files')} />
            </div>

          </CardContent>
        </CardContainerNotched>
        <CardContainerNotched className="card-container" type="header">
          <CardContent cardType="headerFooter">
            <header>
              <div className="card-padding">
                <h2 className="header-title">{t('aggregation.st2')}</h2>
                <Link
                  pathname="/files"
                  query={{
                    filters: {
                      content: [
                        {
                          op: 'in',
                          content: {
                            field: 'study.short_name_keyword',
                            value: ['ST2'],
                          },
                        },
                      ],
                      op: 'and',
                    },
                  }}
                  >
                  {t('global.cards.details')}
                  {' '}
                  <FiExternalLink />
                </Link>
              </div>
            </header>
            <div className="card-padding">
              <h2>{t('aggregation.st2')}</h2>
              <p>
                {t('aggregation.st2.desc')}
              </p>
            </div>
            <div className="card-footer card-padding">
              <CountWithIcon count={249} iconType="donor" label={t('global.donors')} />
              <CountWithIcon count={330} iconType="file" label={t('global.files')} />
            </div>

          </CardContent>
        </CardContainerNotched>
        <CardContainerNotched className="card-container" type="header">
          <CardContent cardType="headerFooter">
            <header>
              <div className="card-padding">
                <h2 className="header-title">{t('aggregation.st3')}</h2>
                <Link
                  pathname="/files"
                  query={{
                    filters: {
                      content: [
                        {
                          op: 'in',
                          content: {
                            field: 'study.short_name_keyword',
                            value: ['ST3'],
                          },
                        },
                      ],
                      op: 'and',
                    },
                  }}
                  >
                  {t('global.cards.details')}
                  {' '}
                  <FiExternalLink />
                </Link>
              </div>
            </header>
            <div className="card-padding">
              <h2>{t('aggregation.st3')}</h2>
              <p>
                {t('aggregation.st3.desc')}
              </p>
            </div>
            <div className="card-footer card-padding">
              <CountWithIcon count={199} iconType="donor" label={t('global.donors')} />
              <CountWithIcon count={465} iconType="file" label={t('global.files')} />
            </div>

          </CardContent>
        </CardContainerNotched>
        <CardContainerNotched className="card-container" type="header">
          <CardContent cardType="headerFooter">
            <header>
              <div className="card-padding">
                <h2 className="header-title">{t('aggregation.st4')}</h2>
                <Link
                  pathname="/files"
                  query={{
                    filters: {
                      content: [
                        {
                          op: 'in',
                          content: {
                            field: 'study.short_name_keyword',
                            value: ['ST4'],
                          },
                        },
                      ],
                      op: 'and',
                    },
                  }}
                  >
                  {t('global.cards.details')}
                  {' '}
                  <FiExternalLink />
                </Link>
              </div>
            </header>
            <div className="card-padding">
              <h2>{t('aggregation.st4')}</h2>
              <p>
                {t('aggregation.st4.desc')}
              </p>
            </div>
            <div className="card-footer card-padding">
              <CountWithIcon count={174} iconType="donor" label={t('global.donors')} />
              <CountWithIcon count={200} iconType="file" label={t('global.files')} />
            </div>
          </CardContent>
        </CardContainerNotched>
      </div>
    </div>
  );
};

export default StudyCards;
