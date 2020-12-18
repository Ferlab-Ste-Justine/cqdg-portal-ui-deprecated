/* eslint-disable jsx-a11y/anchor-is-valid */
/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  compose, withState, withPropsOnChange, pure,
} from 'recompose';

import { toggleAddAllToCart } from '@cqdg/store/dux/cart';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';
import { IRawQuery } from '@ncigdc/utils/uri/types';
import { parseFilterParam } from '@cqdg/utils/uri';
import Link from '@ncigdc/components/Links/Link';

import t from '@cqdg/locales/intl';
import {
  resetQuery,
} from '@cqdg/store/query';

import Radio from 'cqdg-ui/core/buttons/RadioButton';
import StackLayout from 'cqdg-ui/core/layouts/StackLayout';
import Button from 'cqdg-ui/core/buttons/button';

import './SingleChoice.css';

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

const getCurrentFilters = (ctx) => ((ctx.query &&
  parseFilterParam((ctx.query || {}).filters, {}).content) ||
  [])
  .map(filter => ({
    ...filter,
    content: {
      ...filter.content,
      value: typeof filter.content.value === 'string'
          ? filter.content.value.toLowerCase()
          : filter.content.value.map(val => val.toLowerCase()),
    },
  }
  ));

let input;
const SingleChoice = (props: TProps) => {
  const {
    addAllToCart, collapsed, dispatch, field, filteredBuckets, maxShowing,
  } = props;
  const dotField = field.replace(/__/g, '.');

  const newQuery = resetQuery(field);
  if (collapsed) return null;

  return (
    <LocationSubscriber>
      {(ctx: { pathname: string; query: IRawQuery }) => {
        const currentFilters = getCurrentFilters(ctx);
        const selectedFilters = currentFilters.reduce((acc, f) => acc.concat(f.content.value), []);
        const selectedFilter = selectedFilters ? selectedFilters[0] : '';

        return (
          <StackLayout className="fui-filter-sc" horizontal>
            <Radio.Group value={selectedFilter}>
              {_.orderBy(filteredBuckets, 'doc_count', 'desc')
                .slice(0, props.showingMore ? Infinity : maxShowing)
                .map(b => ({
                  ...b,
                  name: b.key_as_string || b.key,
                  id: b.key.trim().toLowerCase().split(' ').join('.'),
                }))
                .map(bucket => {
                  const filterToReset = currentFilters.reduce((acc, f) => {
                    if (f.content.field === field) {
                      const otherFilterValue = f.content.value.find((v) => v !== bucket.name);
                      return otherFilterValue ? acc.concat(otherFilterValue) : acc;
                    }
                    return acc;
                  }, []).concat(bucket.name);

                  return (
                    <Radio.Button
                      key={bucket.id}
                      value={bucket.name}
                      >
                      <Link
                        className="fui-mv-item-checkbox"
                        key={bucket.id}
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
                                  value: filterToReset,
                                },
                              },
                            ],
                          },
                        }}
                        >
                        {t(`aggregation.${bucket.name}`)}
                      </Link>
                    </Radio.Button>
                  );
                })}
            </Radio.Group>
            <Link
              query={newQuery}
              >
              <Button type="text">
                {t('facet.actions.reset')}
              </Button>
            </Link>
            {filteredBuckets.length === 0 && (
              <span>
                {(input || { value: '' }).value
                      ? t('no.matching.values')
                      : t('no.data.for.field')}
              </span>
            )}
          </StackLayout>
        );
      }}
    </LocationSubscriber>
  );
};

const enhance = compose(
  withState('showingMore', 'setShowingMore', false),
  withState('filter', 'setFilter', ''),
  connect(state => ({
    addAllToCart: state.cart.addAllToCart,
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

export default enhance(SingleChoice);
