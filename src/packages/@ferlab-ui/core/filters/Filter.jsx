/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import IoIosClose from 'react-icons/lib/io/close';

import Link from '@ncigdc/components/Links/Link';
import AggregatedFilter from './AggregatedFilter';

import './Filter.css';

const Filter = ({
  filters, filterType, isFilterExpanded, onToggle, query,
}) => {
  return (
    <span className="filter">
      <span className="filter-type">{filterType}</span>
      <span className="filter-separator">=</span>
      <AggregatedFilter className="aggregated-container" filters={filters} isFilterExpanded={isFilterExpanded} onToggle={onToggle} />
      <Link className="filter-close-link" merge="toggle" query={query}>
        <IoIosClose className="inner-close-icon" />
      </Link>

    </span>
  );
};

export default Filter;
