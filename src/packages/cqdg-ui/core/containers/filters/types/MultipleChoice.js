/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { Fragment } from 'react';
import CloseIcon from 'react-icons/lib/md/close';

import {
  compose, withState, withPropsOnChange, pure,
} from 'recompose';

import OverflowTooltippedLabel from '@cqdg/components/Tooltip/OverflowTooltippedLabel';
import { internalHighlight } from '@cqdg/components/Highlight';

import Button from 'cqdg-ui/core/buttons/button';
import Tag from 'cqdg-ui/core/text/Tag';
import StackLayout from 'cqdg-ui/core/layouts/StackLayout';

import './MultipleChoice.css';

let input;
const MultipleChoice = (props) => {
  const {
    dictionary,
    filterGroup,
    filters,
    maxShowing,
    onChange,
    searchInputVisible,
    selectedFilters,
    setShowingMore,
    showingMore,
    title,
  } = props;

  return (
    <Fragment>
      {searchInputVisible && (
        <StackLayout>
          <input
            aria-label={dictionary.multiChoice.searchPlaceholder}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onChange={() => props.setFilter(input.value)}
            placeholder={dictionary.multiChoice.searchPlaceholder}
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
      {filters.length > 0 && (
        <StackLayout vertical>
          <StackLayout className="fui-filters-actions">
            <Button className="fui-filters-links" onClick={() => onChange(filterGroup, selectedFilters)} type="text">
              {dictionary.actions.all}
            </Button>

            <div className="separator" />
            <Button className="fui-filters-links" onClick={() => onChange(filterGroup, selectedFilters)} type="text">{dictionary.actions.none}</Button>
          </StackLayout>
          {filters
            .sort((a, b) => (b.doc_count - a.doc_count))
            .slice(0, showingMore ? Infinity : maxShowing)
            .map(filter => (
              <StackLayout className="fui-mc-item" horizontal key={`${filterGroup.field}-${filter.id}-${filter.doc_count}`}>
                <Button className="fui-mv-item-checkbox" onClick={() => onChange(filterGroup, [filter.name])} type="text">
                  <input
                    checked={
                      selectedFilters.indexOf(filter.key) >= 0
                      }
                    id={`input-${title}-${filter.key}`}
                    name={`input-${title}-${filter.id}`}
                    readOnly
                    type="checkbox"
                    />
                  <OverflowTooltippedLabel
                    className=".tooltip"
                    htmlFor={`input-${title}-${filter.id}`}
                    >
                    {props.searchValue
                            ? internalHighlight(
                              props.searchValue,
                              filter.name,
                              {
                                backgroundColor: '#FFFF00',
                              },
                            )
                            : filter.name}
                  </OverflowTooltippedLabel>

                </Button>
                <Tag>
                  {filter.doc_count.toLocaleString()}
                </Tag>
              </StackLayout>
            ))}
          {filters.length > maxShowing && (
            <Button
              className="fui-filters-types-mc-footer"
              onClick={() => setShowingMore(!props.showingMore)}
              onKeyPress={() => setShowingMore(!props.showingMore)}
              role="button"
              tabIndex="0"
              type="text"
              >
              {showingMore
                      ? dictionary.actions.less
                      : filters.length - 5 &&
                      `${filters.length - 5} ${dictionary.actions.more}...`}
            </Button>
          )}
        </StackLayout>
      )}
      {filters.length === 0 && (
        <StackLayout className="fui-no-filters" vertical>
          <span className="no-results-text">
            {(input || { value: '' }).value
                      ? dictionary.messages.errorNotFound
                      : dictionary.messages.errorNoData}
          </span>
        </StackLayout>
      )}
    </Fragment>
  );
};

const enhance = compose(
  withState('showingMore', 'setShowingMore', false),
  withState('filter', 'setFilter', ''),
  withPropsOnChange(
    [
      'filters',
      'filter',
      'searchValue',
    ],
    ({
      filter, filters, searchValue = '',
    }) => {
      return {
        filters: filters.filter(
          b =>
            b.key.toLowerCase().includes(filter.toLowerCase()) &&
          (b.key.toLowerCase().includes(searchValue.toLowerCase())),
        ),
      };
    },
  ),
  pure,
);

export default enhance(MultipleChoice);
