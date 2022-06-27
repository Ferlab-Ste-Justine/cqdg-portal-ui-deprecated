/* eslint-disable react/prefer-stateless-function */
/* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
// @ts-ignore
import React from 'react';

import FilterContainerHeader from 'cqdg-ui/core/containers/filters/FilterContainerHeader';

import StackLayout from 'cqdg-ui/core/layouts/StackLayout';
import { FilterComponent } from './FilterContainerSelector';
import { IFilterGroup, IFilter, onChangeType } from './Filters';

import './FilterContainer.css';
import { IDictionary } from './types/dictionary';

interface IFilterContainerProps {
  filterGroup: IFilterGroup;
  dictionary: IDictionary;
  title: string;
  filters: IFilter[];
  selectedFilters: any;
  onRemoveFilterContainer: () => void;
  onChange: onChangeType;
  isRemovable: boolean;
  maxShowing: number;
  searchValue: string;
  searchEnabled: boolean;
}

interface IFilterContainerState {
  searchInputVisible: boolean;
  collapsed: boolean;
}

class FilterContainer
  extends React.Component<IFilterContainerProps, IFilterContainerState> {
  constructor(props: IFilterContainerProps) {
    super(props);
    this.state = {
      collapsed: false,
      searchInputVisible: false,
    };
  }

  setCollapsed = (value: boolean) => {
    this.setState({
      collapsed: value,
    });
  }

  setSearchInputVisible = (value: boolean) => {
    this.setState({
      searchInputVisible: value,
    });
  }

  render() {
    const {
      filterGroup,
      dictionary,
      title,
      filters = [],
      onRemoveFilterContainer = () => {},
      isRemovable = false,
      maxShowing = 5,
      onChange,
      searchValue,
      searchEnabled,
      selectedFilters,
    } = this.props;

    const {
      collapsed,
      searchInputVisible,
    } = this.state;

    return (
      <div className="filter-container">
        <StackLayout vertical>
          <FilterContainerHeader
            collapsed={collapsed}
            isRemovable={isRemovable}
            mouseOverTooltip={
              filterGroup.description ? filterGroup.description : null
            }
            onClick={this.setCollapsed}
            onRemoveFilterContainer={onRemoveFilterContainer}
            onSearchClick={this.setSearchInputVisible}
            searchEnabled={searchEnabled}
            searchInputVisibled={searchInputVisible}
            title={title}
            />
          { collapsed || (
            <div className="filter-container-content">
              <FilterComponent
                dictionary={dictionary}
                filterGroup={filterGroup}
                filters={filters}
                maxShowing={maxShowing}
                onChange={onChange}
                searchInputVisible={searchInputVisible}
                searchValue={searchValue}
                selectedFilters={selectedFilters}
                title={title}
                />
            </div>
          ) }
        </StackLayout>
      </div>
    );
  }
}

export default FilterContainer;
