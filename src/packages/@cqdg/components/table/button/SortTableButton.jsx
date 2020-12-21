import React from 'react';
import ArrowDownIcon from 'react-icons/lib/fa/long-arrow-down';
import ArrowUpIcon from 'react-icons/lib/fa/long-arrow-up';
import SortIcon from 'react-icons/lib/fa/sort-amount-desc';
import { compose, setDisplayName, withReducer } from 'recompose';
import {
  find, get, isEqual, xorWith,
} from 'lodash';

import Dropdown from '@cqdg/components/Dropdown';
import DropdownItem from '@cqdg/components/Dropdown/DropdownItem';
import withRouter from '@cqdg/utils/withRouter';

import StackLayout from 'cqdg-ui/core/layouts/StackLayout';
import Button from 'cqdg-ui/core/buttons/button';

import t from '@cqdg/locales/intl';

import './SortTableButton.css';

const sortTableReducer = (state, action) => {
  switch (action.type) {
    case 'toggleSortKey':
      return {
        ...state,
        sortSelection: xorWith(state.sortSelection, [action.payload], isEqual),
      };
    case 'changeSortDirection':
      return {
        ...state,
        sortSelection: [
          ...state.sortSelection.filter(
            s => !isEqual(s.field, action.payload.field)
          ),
          action.payload,
        ],
      };
    default:
      return state;
  }
};

const uiStateReduce = (selectionState, selectionOptions) =>
  selectionOptions.reduce((acc, curr) => {
    const selection = find(
      selectionState,
      (s) => s.field === curr.id
    );
    const sortDir = get(selection, 'order', false);
    acc[curr.id] = {
      selected: selection || false,
      asc: sortDir === 'asc',
      desc: sortDir === 'desc',
    };
    return acc;
  }, {});

const generateInitialState = ({ initialState }) =>
  (initialState || { sortSelection: [] });

const SortTableButton = compose(
  withReducer('state', 'dispatch', sortTableReducer, generateInitialState),
  setDisplayName('SortTableButton'),
  withRouter,
)(
  ({
    buttonClassName = '',
    dispatch,
    isDisabled = false,
    options,
    sortFunction,
    state,
  }) => {
    const uiState = uiStateReduce(state.sortSelection, options);

    return (
      <Dropdown
        autoclose={false}
        button={(
          <Button className={buttonClassName} disabled={isDisabled}>
            <SortIcon height="14px" width="14px" />
          </Button>
        )}
        dropdownStyle={{
          top: '100%',
          marginTop: 5,
          whiteSpace: 'nowrap',
        }}
        isDisabled={isDisabled}
        >
        {options.map(({ id }) => {
          const dispatchAction = (
            sType,
            sId,
            sDir
          ) =>
            dispatch(
              {
                type: sType,
                payload: {
                  field: sId,
                  order: sDir,
                },
              },
              ({ sortSelection }) => sortFunction(sortSelection)
            );

          return (
            <DropdownItem
              key={id}
              style={{
                lineHeight: '1.5',
                ':hover': {
                  cursor: 'pointer',
                },
              }}
              >
              <StackLayout
                style={{
                  padding: '0.3rem 0.6rem',
                  flex: '1 1 auto',
                }}
                >
                <div
                  onClick={() =>
                    dispatchAction(
                      'toggleSortKey',
                      id,
                      uiState[id].asc ? 'asc' : 'desc'
                    )}
                  style={{
                    width: '100%',
                    color: 'rgb(0, 80, 131)',
                  }}
                  >
                  <input
                    aria-label={t(`facet.${id}`)}
                    checked={uiState[id].selected}
                    name={t(`facet.${id}`)}
                    readOnly
                    style={{ pointerEvents: 'none' }}
                    type="checkbox"
                    />
                  <label htmlFor={t(`facet.${id}`)} style={{ marginLeft: '0.3rem' }}>
                    {t(`facet.${id}`)}
                  </label>
                </div>
              </StackLayout>
              <StackLayout className="radio-row">
                <div
                  onClick={() =>
                    dispatchAction('changeSortDirection', id, 'asc')}
                  style={{ width: '100%' }}
                  >
                  <ArrowDownIcon />
                  <input
                    aria-label="sort-ascending"
                    checked={uiState[id].asc}
                    readOnly
                    style={{ pointerEvents: 'none' }}
                    type="radio"
                    />
                </div>
                <div
                  onClick={() =>
                    dispatchAction('changeSortDirection', id, 'desc')}
                  style={{ width: '100%' }}
                  >
                  <ArrowUpIcon />
                  <input
                    aria-label="sort-descending"
                    checked={uiState[id].desc}
                    readOnly
                    style={{ pointerEvents: 'none' }}
                    type="radio"
                    />
                </div>
              </StackLayout>
            </DropdownItem>
          );
        })}
      </Dropdown>
    );
  }
);

export default SortTableButton;
