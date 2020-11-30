/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import take from 'lodash/take';
import LeftArrow from 'react-icons/lib/fa/long-arrow-left';

import UnionIcon from '../icons/UnionIcon';

import './AggregatedFilter.css';

const AggregatedFilter = ({
  className, filters, isFilterExpanded, onToggle,
}) => {
  const hasMoreValues = filters.length > 3;
  const showedFilters = isFilterExpanded || !hasMoreValues ? filters : take(filters, 3);
  return (
    <div className={`aggregated-filter ${className}`}>
      <div className="aggregated-wrapper-container">
        {
          showedFilters.map((filter, index) => {
            return (
              index === showedFilters.length - 1
              ? (
                <span className="filter-name" key={`aggregated-filter-${filter}`}>{filter}</span>

              )
              : (
                <React.Fragment key={`aggregated-filter-${filter}`}>
                  <span className="filter-name">{filter}</span>
                  <span><UnionIcon /></span>
                </React.Fragment>
              )
            );
          })
        }
        {hasMoreValues && (isFilterExpanded
        ? <span className="aggregated-filter-expand" onClick={onToggle}><LeftArrow /></span>
        : <span className="aggregated-filter-expand" onClick={onToggle}>...</span>)}
      </div>
    </div>
  );
};

export default AggregatedFilter;
