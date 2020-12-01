/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
/* @flow */

import React from 'react';
import includes from 'lodash/includes';
import some from 'lodash/some';

import {
  compose,
  defaultProps,
  renameProps,
  setDisplayName,
  withState,
} from 'recompose';

import { withTheme } from '@ncigdc/theme';
import Header from '@ferlab-ui/core/containers/filters/FilterContainerHeader';

import DateFacet from '@ncigdc/components/Aggregations/DateFacet';
import ExactMatchFacet from '@ncigdc/components/Aggregations/ExactMatchFacet';
import StackLayout from '@ferlab-ui/core/layouts/StackLayout';
import MultipleChoice from '@ferlab-ui/core/containers/filters/types/MultipleChoice';
import RangeFilter from '@ferlab-ui/core/containers/filters/types/RangeFilter';

import './FilterContainer.css';

const COMMON_PREPOSITIONS = [
  'a',
  'an',
  'and',
  'at',
  'but',
  'by',
  'for',
  'in',
  'nor',
  'of',
  'on',
  'or',
  'out',
  'so',
  'the',
  'to',
  'up',
  'yet',
];

const fieldNameToTitle = fieldName => fieldName
  .replace(/_|\./g, ' ')
  .split(' ')
  .map(
    word => (COMMON_PREPOSITIONS.includes(word) ? word : _.capitalize(word)),
  )
  .join(' ');

const getFacetType = facet => {
  if (includes(facet.field, 'datetime')) {
    return 'datetime';
  } if (facet.type === 'terms') {
    // on Annotations & Repo pages project_id is a terms facet
    // need a way to force an *_id field to return terms
    return 'terms';
  } if (facet.type === 'exact') {
    return 'exact';
  } if (
    some([
      '_id',
      '_uuid',
      'md5sum',
      'file_name',
    ], idSuffix => includes(facet.field, idSuffix))
  ) {
    return 'exact';
  } if (facet.type === 'long' || facet.type === 'float') {
    return 'range';
  }
  return 'terms';
};

export const WrapperComponent = compose(withTheme)(({
  setShowingValueSearch,
  showingValueSearch,
  collapsed,
  isMatchingSearchValue,
  setCollapsed,
  facet,
  title,
  aggregation = { buckets: [] },
  handleRequestRemove,
  isRemovable,
  additionalProps,
  maxShowing = 5,
  searchValue,
  DescriptionComponent = null,
}) => {
  const facetType = getFacetType(facet);
  const displayTitle = title || fieldNameToTitle(facet.field);
  const commonProps = {
    collapsed,
    title: displayTitle,
  };

  const facetComponent = {
    exact: () => (
      <ExactMatchFacet
        {...commonProps}
        doctype={facet.doc_type}
        fieldNoDoctype={facet.field}
        placeholder={
          facet.placeholder ? facet.placeholder : `Enter ${commonProps.title}`
        }
        {...additionalProps}
        />
    ),
    datetime: () => (
      <DateFacet field={facet.full} {...commonProps} {...additionalProps} />
    ),
    range: () => (
      <RangeFilter
        convertDays={false}
        field={facet.full}
        max={(aggregation.stats || { max: 0 }).max}
        min={(aggregation.stats || { min: 0 }).min}
        {...commonProps}
        {...additionalProps}
        />
    ),
    terms: () => (
      <MultipleChoice
        field={facet.full}
        {...commonProps}
        buckets={(aggregation || { buckets: [] }).buckets}
        isMatchingSearchValue={isMatchingSearchValue}
        maxShowing={maxShowing}
        searchValue={searchValue}
        showingValueSearch={showingValueSearch}
        {...additionalProps}
        />
    ),
  }[facetType]();

  const hasValueSearch =
    facetType === 'terms' &&
    (aggregation || { buckets: [] }).buckets.filter(b => b.key !== '_missing')
      .length >= 20;
  return (
    <div className="filter-container">
      <StackLayout vertical>
        <Header
          collapsed={collapsed}
          DescriptionComponent={
          DescriptionComponent &&
          !searchValue &&
          (facet.description || 'No description available')
        }
          field={facet.full}
          handleRequestRemove={handleRequestRemove}
          hasValueSearch={!DescriptionComponent && hasValueSearch}
          isRemovable={isRemovable}
          searchValue={searchValue}
          setCollapsed={setCollapsed}
          setShowingValueSearch={setShowingValueSearch}
          showingValueSearch={showingValueSearch}
          title={displayTitle}
          />
        {searchValue && DescriptionComponent}
        { collapsed || <div className="filter-container-content">{facetComponent}</div> }
      </StackLayout>
    </div>
  );
});

const FilterContainer = compose(
  setDisplayName('EnhancedFilterContainer'),
  defaultProps({
    onRequestRemove: () => {},
    isRemovable: false,
  }),
  renameProps({
    onRequestRemove: 'handleRequestRemove',
  }),
  withState('showingValueSearch', 'setShowingValueSearch', false),
  withState('collapsed', 'setCollapsed', props => props.collapsed),
)(WrapperComponent);

export default FilterContainer;
