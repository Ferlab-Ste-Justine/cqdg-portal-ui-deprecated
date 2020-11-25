import ArrowDownIcon from 'react-icons/lib/fa/long-arrow-down';
import ArrowUpIcon from 'react-icons/lib/fa/long-arrow-up';
import Button from '@ncigdc/uikit/Button';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Hidden from '@ncigdc/components/Hidden';
import React from 'react';
import styled from '@ncigdc/theme/styled';
import withRouter from '@ncigdc/utils/withRouter';
import { compose, setDisplayName, withReducer } from 'recompose';
import {
  find, get, isEqual, xorWith,
} from 'lodash';
import { ITheme, withTheme } from '@ncigdc/theme';
import { Row } from '@ncigdc/uikit/Flex';
import { SortIcon } from '@ncigdc/theme/icons';
import t from '@cqdg/locales/intl';

const RadioRow = styled(Row, {
  padding: '0.3rem 0.6rem',
  marginLeft: 'auto',
  alignItems: 'center',
});

interface IReducerAction<T, P> {
  type: T;
  payload: P;
}
type TSortDirection = 'desc' | 'asc';
export interface ISortSelection {
  field: string;
  order: TSortDirection;
}
export interface ISortTableButtonState {
  sortSelection: ReadonlyArray<ISortSelection>;
}

type TSortActionNames = 'toggleSortKey' | 'changeSortDirection';
type TSortTableButtonReducerAction = IReducerAction<
  TSortActionNames,
  ISortSelection
>;

type TSortTableReducer = (
  s: ISortTableButtonState,
  a: TSortTableButtonReducerAction
) => ISortTableButtonState;

type TSortTableButtonDispatch = (s: ISortTableButtonState) => void;

export interface ISortTableOption {
  id: string;
  name: string;
}
export type TSortTableButtonSortFunc = (
  s: ReadonlyArray<ISortSelection>
) => void;
interface ISortTableButtonProps {
  sortFunction: TSortTableButtonSortFunc;
  options: ISortTableOption[];
  initialState?: ISortTableButtonState;
  theme?: ITheme;
  style?: React.CSSProperties;
  isDisabled?: boolean;
  buttonClassName?: string;
}

interface ICSortTableButtonProps extends ISortTableButtonProps {
  state: ISortTableButtonState;
  dispatch: (
    a: TSortTableButtonReducerAction,
    cb: TSortTableButtonDispatch
  ) => void;
}

const sortTableReducer: TSortTableReducer = (state, action) => {
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

interface ISortUiState {
  [key: string]: {
    selected: boolean;
    asc: boolean;
    desc: boolean;
  };
}
type TUiStateReduce = (
  s: ReadonlyArray<ISortSelection>,
  o: ISortTableOption[]
) => ISortUiState;
const uiStateReduce: TUiStateReduce = (selectionState, selectionOptions) =>
  selectionOptions.reduce((acc, curr) => {
    const selection = find(
      selectionState,
      (s: ISortSelection) => s.field === curr.id
    );
    const sortDir = get(selection, 'order', false);
    acc[curr.id] = {
      selected: selection || false,
      asc: sortDir === 'asc',
      desc: sortDir === 'desc',
    };
    return acc;
  }, {});

type TGenerateInitialState = (
  p: ICSortTableButtonProps
) => ISortTableButtonState;
const generateInitialState: TGenerateInitialState = ({ initialState }) =>
  (initialState || { sortSelection: [] });

const SortTableButton = compose<ICSortTableButtonProps, ISortTableButtonProps>(
  withReducer<
    ISortTableButtonProps,
    ISortTableButtonState,
    TSortTableButtonReducerAction,
    string,
    string
  >('state', 'dispatch', sortTableReducer, generateInitialState),
  setDisplayName('SortTableButton'),
  withRouter,
  withTheme
)(
  ({
    buttonClassName = '',
    dispatch,
    isDisabled = false,
    options,
    sortFunction,
    state,
    style,
    theme,
  }) => {
    const uiState = uiStateReduce(state.sortSelection, options);

    return (
      <Dropdown
        autoclose={false}
        button={(
          <Button className={buttonClassName} disabled={isDisabled} style={style}>
            <SortIcon />
            <Hidden>{t('global.tables.actions.sort')}</Hidden>
          </Button>
        )}
        dropdownStyle={{
          top: '100%',
          marginTop: 5,
          whiteSpace: 'nowrap',
        }}
        isDisabled={isDisabled}
        >
        {options.map(({ id, name }: { id: string; name: string }) => {
          const dispatchAction = (
            sType: TSortActionNames,
            sId: string,
            sDir: TSortDirection
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
              <Row flex="1 1 auto" style={{ padding: '0.3rem 0.6rem' }}>
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
              </Row>
              <RadioRow>
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
              </RadioRow>
            </DropdownItem>
          );
        })}
      </Dropdown>
    );
  }
);

export default SortTableButton;
