import React from 'react';

import ExactMatchFacet from 'cqdg-ui/core/containers/filters/types/ExactMatchFacet';

import SingleChoice from 'cqdg-ui/core/containers/filters/types/SingleChoice';
import MultipleChoice from 'cqdg-ui/core/containers/filters/types/MultipleChoice';
import RangeFilter from 'cqdg-ui/core/containers/filters/types/RangeFilter';
import t from '@cqdg/locales/intl';

export interface IFilterGroup {
  'doc_type': string;
  description: string;
  field: string;
  full: string;
  placeholder: string;
  title: string;
  type: string;
  visualType: string;
}

export interface IFilter {
  doc_count: number;
  key: string;
}

interface IFiltersProps {
  filterGroup: IFilterGroup;
  collapsed: boolean;
  title: string;
  filters: IFilter[];
  searchInputVisible: boolean;
  maxShowing: number;
  searchValue: string;
}

export const FilterComponent = ({
  collapsed, filterGroup, filters, maxShowing, searchInputVisible, searchValue, title,
}: IFiltersProps) => {
  const facet = filterGroup;
  const commonProps = {
    collapsed,
    title,
  };

  switch (filterGroup.visualType) {
    case 'choice': return (
      <SingleChoice
        {...commonProps}
        buckets={filters}
        doctype={facet.doc_type}
        field={facet.full}
        fieldNoDoctype={facet.field}
        placeholder={
          facet.placeholder ? facet.placeholder : `Enter ${commonProps.title}`
        }
        />
    );
    case 'exact': return (
      <ExactMatchFacet
        {...commonProps}
        doctype={facet.doc_type}
        fieldNoDoctype={facet.field}
        placeholder={
          facet.placeholder ? facet.placeholder : `Enter ${commonProps.title}`
        }
        />
    );
    case 'range': return (
      <RangeFilter
        convertDays={false}
        field={facet.full}
        max={({ max: 0 }).max}
        min={({ min: 0 }).min}
        {...commonProps}
        />
    );
    case 'terms':
    default: return (
      <MultipleChoice
        field={facet.full}
        {...commonProps}
        buckets={filters}
        maxShowing={maxShowing}
        noResultsText={t('facet.no.result')}
        searchInputVisible={searchInputVisible}
        searchValue={searchValue}
        />
    );
  }
};
