// @flow
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { xor, omit } from 'lodash';
import {
  compose,
  withState,
  pure,
  withHandlers,
  withPropsOnChange,
  withProps,
} from 'recompose';

import { humanify } from '@ncigdc/utils/string';
import withRouter from '@ncigdc/utils/withRouter';

import Link from '@ncigdc/components/Links/Link';

import { facetFieldDisplayMapper } from '@ncigdc/components/Aggregations';
import { parseJSONParam } from '@ncigdc/utils/uri/index';
import t from '@cqdg/locales/intl';

import IoIosCloseCircleOutline from 'react-icons/lib/io/ios-close-outline';
import LeftArrow from 'react-icons/lib/fa/angle-left';

import Filter from '@ferlab-ui/core/filters/Filter';

import './QueryBuilder.css';
import { toggleAddAllToCart } from '@ncigdc/dux/cart';
import { connect } from 'react-redux';

/*----------------------------------------------------------------------------*/

type TProps = {
  query: Record<string, any>;
  currentFilters: Array<Record<string, any>>;
  onLessClicked: Function;
  isFilterExpanded: Function;
  addAllToCart: boolean;
};

const enhance = compose(
  withRouter,
  withPropsOnChange(['query'], ({ query: { filters } }) => ({
    filters: parseJSONParam(filters),
  })),
  withPropsOnChange(['filters'], ({ filters }) => ({
    currentFilters: (filters && filters.content) || [],
  })),
  withState('expandedFilters', 'setExpandedFilters', []),
  connect(state => ({
    addAllToCart: state.cart.addAllToCart,
  })),
  withProps(({ expandedFilters }) => ({
    isFilterExpanded: filter => expandedFilters.includes(filter),
  })),
  withHandlers({
    onLessClicked: ({ expandedFilters, setExpandedFilters }) => filter => {
      setExpandedFilters(xor(expandedFilters, [filter]));
    },
  }),
  pure,
);

const QueryBuilder = (
  {
    addAllToCart,
    currentFilters,
    dispatch,
    isFilterExpanded,
    onLessClicked,
    query,
  }: TProps = {},
) => {
  const hasCurrentFilters = currentFilters.length > 0;
  const containerState = hasCurrentFilters ? 'with-filters' : 'no-filters';
  return (
    <div className={`query-builder query-builder--${containerState}`}>
      <div className="wrapper-builder">
        {!hasCurrentFilters ? (
          <React.Fragment>
            <LeftArrow className="left-arrow" />
            <span className="no-filters-text">
              {t('repo.search.by.facet.title')}
            </span>
          </React.Fragment>
        )
        : (
          <React.Fragment>
            <Link query={omit(query, 'filters')}>
              <IoIosCloseCircleOutline className="close-icon" />
            </Link>
            <div className="wrapper-filters">
              {currentFilters.map((filter) => {
                const value = [].concat(filter.content.value || []);

                return (
                  <Filter
                    filters={value}
                    filterType={humanify({ term: facetFieldDisplayMapper(filter.content.field), capitalize: false })}
                    isFilterExpanded={isFilterExpanded(filter)}
                    key={`${filter.content.field}.${filter.op}.${value.join()}`}
                    onClick={() => {
                      if (addAllToCart === true) {
                        dispatch(toggleAddAllToCart());
                      }
                    }}
                    onToggle={() => onLessClicked(filter)}
                    query={{
                      filters: {
                        content: [filter],
                        op: 'and',
                      },
                      offset: 0,
                    }}
                    />
                );
              })}
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
/*----------------------------------------------------------------------------*/

export default enhance(QueryBuilder);
