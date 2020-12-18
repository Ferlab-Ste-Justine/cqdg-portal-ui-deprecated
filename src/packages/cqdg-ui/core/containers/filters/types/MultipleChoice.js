/* eslint-disable jsx-a11y/anchor-is-valid */
/* @flow */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import {
  compose, withState, withPropsOnChange, pure,
} from 'recompose';

import { toggleAddAllToCart } from '@cqdg/store/dux/cart';
import OverflowTooltippedLabel from '@ncigdc/uikit/OverflowTooltippedLabel';
import Link from '@cqdg/components/Links/Link';
import { internalHighlight } from '@ncigdc/uikit/Highlight';
import { inCurrentFilters } from '@cqdg/utils/filters';
import { getCurrentFilters } from '@cqdg/store/query';
import t from '@cqdg/locales/intl';

import CloseIcon from 'react-icons/lib/md/close';

import Button from 'cqdg-ui/core/buttons/button';
import Tag from 'cqdg-ui/core/text/Tag';
import StackLayout from 'cqdg-ui/core/layouts/StackLayout';

import './MultipleChoice.css';

type TProps = {
  buckets: [IBucket];
  field: string;
  filteredBuckets: Array<Record<string, any>>;
  style: Record<string, any>;
  title: string;
  showingValueSearch: boolean;
  collapsed: boolean;
  setShowingMore: Function;
  showingMore: boolean;
  maxShowing: number;
  searchValue: string;
  isMatchingSearchValue: boolean;
};


const getCurrentFilters3 = () => {
  const currentFilters = getCurrentFilters([]).content;

  if (!currentFilters || currentFilters.length === 0) return [];

  return currentFilters.map(filter => ({
    ...filter,
    content: {
      ...filter.content,
      value: typeof filter.content.value === 'string'
            ? filter.content.value.toLowerCase()
            : filter.content.value.map(val => val.toLowerCase()),
    },
  }
  ));
};


let input;
const MultipleChoice = (props: TProps) => {
  const {
    addAllToCart,
    collapsed,
    dispatch,
    field,
    filteredBuckets,
    maxShowing,
    setShowingMore,
    showingMore,
    showingValueSearch,
  } = props;

  const dotField = field.replace(/__/g, '.');
  const currentFilters = getCurrentFilters3();

  const selectedFilters = filteredBuckets.map(b => {
    const name = b.key_as_string || b.key;
    if (inCurrentFilters({
      key: name.toLowerCase(),
      dotField,
      currentFilters,
    })) {
      return name;
    }
  }).filter(v => v);


  return (

    <Fragment>
      {!collapsed && showingValueSearch && (
        <StackLayout>
          <input
            aria-label={t('search.search')}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onChange={() => props.setFilter(input.value)}
            placeholder={t('search.search')}
            ref={node => {
              input = node;
            }}
            />
          {input && input.value && (
            <CloseIcon
              className="fui-mc-search-reset-icon"
              onClick={() => {
                props.setFilter('');
                input.value = '';
              }}
              />
          )}
        </StackLayout>
      )}
      {!collapsed && filteredBuckets.length > 0 && (
        <StackLayout vertical>
          <StackLayout className="fui-filters-actions">
            <Link
              className="fui-filters-links"
              merge="add"
              query={{
                offset: 0,
                filters: {
                  op: 'and',
                  content: [
                    {
                      op: 'in',
                      content: {
                        field: dotField,
                        value: filteredBuckets.map(b => b.key_as_string || b.key),
                      },
                    },
                  ],
                },
              }}
              >
              {t('global.select.all')}
            </Link>
            <div className="separator" />
            <Link
              className="fui-filters-links"
              merge="toggle"
              query={selectedFilters.length > 0
                      ? {
                        offset: 0,
                        filters: {
                          op: 'and',
                          content: [
                            {
                              op: 'in',
                              content: {
                                field: dotField,
                                value: selectedFilters,
                              },
                            },
                          ],
                        },
                      }
                    : {}}
              >
              {t('global.none')}
            </Link>
          </StackLayout>
          {filteredBuckets.sort((a, b) => {
            return (a.key === '__missing__') ? Number.MIN_VALUE
                      : b.key === '__missing__' ? Number.MAX_VALUE
                      : b.doc_count - a.doc_count;
          })
            .slice(0, showingMore ? Infinity : maxShowing)
            .map(b => ({
              ...b,
              name: b.key_as_string || b.key,
              id: b.key.trim().toLowerCase().split(' ').join('.'),
            }))
            .map(bucket => (
              <StackLayout className="fui-mc-item" horizontal key={bucket.name}>
                <Link
                  className="fui-mv-item-checkbox"
                  merge="toggle"
                  onClick={() => {
                    if (addAllToCart === true) {
                      dispatch(toggleAddAllToCart());
                    }
                  }}
                  query={{
                    offset: 0,
                    filters: {
                      op: 'and',
                      content: [
                        {
                          op: 'in',
                          content: {
                            field: dotField,
                            value: [bucket.name],
                          },
                        },
                      ],
                    },
                  }}
                  >
                  <input
                    checked={inCurrentFilters({
                      key: bucket.name.toLowerCase(),
                      dotField,
                      currentFilters,
                    })}
                    id={`input-${props.title}-${bucket.name.replace(
                            /\s/g,
                            '-'
                          )}`}
                    name={`input-${props.title}-${bucket.name.replace(
                            /\s/g,
                            '-'
                          )}`}
                    readOnly
                    style={{
                      pointerEvents: 'none',
                      marginRight: '5px',
                      flexShrink: 0,
                      verticalAlign: 'middle',
                    }}
                    type="checkbox"
                    />
                  <OverflowTooltippedLabel
                    htmlFor={`input-${props.title}-${bucket.name.replace(
                            /\s/g,
                            '-'
                          )}`}
                    style={{
                      marginLeft: '0.3rem',
                      verticalAlign: 'middle',
                    }}
                    >
                    {props.searchValue
                            ? internalHighlight(
                              props.searchValue,
                              bucket.name,
                              {
                                backgroundColor: '#FFFF00',
                              },
                            )
                            : t(`aggregation.${bucket.id}`) || bucket.name}
                  </OverflowTooltippedLabel>
                </Link>
                <Tag>
                  {bucket.doc_count.toLocaleString()}
                </Tag>
              </StackLayout>
            ))}
          {filteredBuckets.length > maxShowing && (
            <Button
              className="fui-filters-types-mc-footer"
              onClick={() => setShowingMore(!props.showingMore)}
              onKeyPress={() => setShowingMore(!props.showingMore)}
              role="button"
              tabIndex="0"
              type="text"
              >
              {showingMore
                      ? t('global.less')
                      : filteredBuckets.length - 5 &&
                      `${filteredBuckets.length - 5} ${t('global.more')}...`}
            </Button>
          )}

          {filteredBuckets.length === 0 && (
            <span>
              {(input || { value: '' }).value
                      ? t('no.matching.values')
                      : t('no.data.for.field')}
            </span>
          )}
        </StackLayout>
      )}
      {!props.collapsed && filteredBuckets.length === 0 && (
        <StackLayout className="fui-no-filters" vertical>
          <span className="no-results-text">{t('facet.no.result')}</span>
        </StackLayout>
      )}
    </Fragment>
  );
};

const enhance = compose(
  withState('showingMore', 'setShowingMore', false),
  withState('filter', 'setFilter', ''),
  connect(state => ({
    addAllToCart: state.cart.addAllToCart,
    intl: state.intl,
  })),
  withPropsOnChange(
    [
      'buckets',
      'filter',
      'searchValue',
    ],
    ({
      buckets, filter, isMatchingSearchValue, searchValue = '',
    }) => ({
      filteredBuckets: buckets.filter(
        b => b.key !== '_missing' &&
          (b.key || '').length &&
          b.key.toLowerCase().includes(filter.toLowerCase()) &&
          (b.key.toLowerCase().includes(searchValue.toLowerCase()) ||
            isMatchingSearchValue),
      ),
    }),
  ),
  pure,
);

export default enhance(MultipleChoice);
