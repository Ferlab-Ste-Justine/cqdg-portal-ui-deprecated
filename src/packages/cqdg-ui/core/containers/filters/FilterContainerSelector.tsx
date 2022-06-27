/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import SingleChoice from 'cqdg-ui/core/containers/filters/types/SingleChoice';
import MultipleChoice from 'cqdg-ui/core/containers/filters/types/MultipleChoice';
import RangeFilter from 'cqdg-ui/core/containers/filters/types/RangeFilter';
import { IDictionary } from './types/dictionary';

import {
  VisualType, IFilterGroup, IFilter, onChangeType
} from './Filters';

interface IFiltersProps {
  filterGroup: IFilterGroup;
  dictionary: IDictionary;
  title: string;
  filters: IFilter[];
  selectedFilters: any;
  searchInputVisible: boolean;
  maxShowing: number;
  searchValue: string;
  onChange: onChangeType;
}

export const FilterComponent = ({
  dictionary,
  filterGroup,
  filters,
  maxShowing,
  onChange,
  searchInputVisible,
  searchValue,
  selectedFilters,
  title,
}: IFiltersProps) => {

  const commonProps = {
    title,
  };

  switch (filterGroup.visualType) {
    case VisualType.Toggle: return (
      <SingleChoice
        {...commonProps}
        dictionary={dictionary}
        filterGroup={filterGroup}
        filters={filters}
        onChange={onChange}
        placeholder={
          filterGroup.placeholder ? filterGroup.placeholder : `Enter ${commonProps.title}`
        }
        selectedFilters={selectedFilters}
        />
    );
    case VisualType.Range: return (
      <RangeFilter
        dictionary={dictionary}
        filterGroup={filterGroup}
        onChange={onChange}
        selectedFilters={selectedFilters}
        {...commonProps}
        />
    );
    case VisualType.Checkbox:
    default: return (
      <MultipleChoice
        dictionary={dictionary}
        filterGroup={filterGroup}
        {...commonProps}
        filters={filters}
        maxShowing={maxShowing}
        onChange={onChange}
        searchInputVisible={searchInputVisible}
        searchValue={searchValue}
        selectedFilters={selectedFilters}
        />
    );
  }
};
