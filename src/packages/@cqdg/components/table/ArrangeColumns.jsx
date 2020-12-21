import React from 'react';
import { connect } from 'react-redux';
import {
  compose, withState, pure, lifecycle,
} from 'recompose';
import ArrangeIcon from 'react-icons/lib/fa/bars';

import StackLayout from 'cqdg-ui/core/layouts/StackLayout';

import SortableItem from '@cqdg/components/Sortable/SortableItem';
import {
  toggleColumn,
  setColumns,
} from '@cqdg/store/dux/tableColumns';
import t from '@cqdg/locales/intl';

import './ArrangeColumns.css';

const ArrangeColumns = compose(
  connect(
    (
      state,
      props,
    ) => ({
      localTableColumns: state.tableColumns[props.entityType].filter(
        (tc) => !(props.hideColumns || []).includes(tc.id)
      ),
      filteredTableColumns: state.tableColumns[props.entityType].filter(
        (tc) =>
          !(props.hideColumns || []).includes(tc.id) && !tc.subHeading
      ),
    })
  ),
  withState('state', 'setState', state => ({
    draggingIndex: null,
  })),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (nextProps.localTableColumns !== this.props.localTableColumns) {
        nextProps.setState({
          filteredTableColumns: this.props.localTableColumns.filter(
            (tc: IColumnProps<boolean>) => !tc.subHeading
          ),
        });
      }
    },
  }),
  pure
)(
  ({
    dispatch,
    entityType,
    filteredTableColumns,
    localTableColumns,
    searchTerm,
    setState,
    state,
  }) => {
    const subHeadings =
      localTableColumns.filter((tc) => tc.subHeading) ||
      [];
    return (
      <div className="test-arrange-columns">
        {filteredTableColumns.map(
          (column, i) => (
            <SortableItem
              className="test-column"
              draggingIndex={state.draggingIndex}
              items={filteredTableColumns}
              key={column.id}
              outline="list"
              sortId={i}
              updateState={(nextState: IState) => {
                if (!nextState.items && state.items) {
                  let newItems = state.items.filter(
                    (item) => !item.subHeading
                  );
                  if (subHeadings && subHeadings.length > 0) {
                    const index: number = filteredTableColumns.indexOf(
                      filteredTableColumns.filter(
                        (tc) => tc.subHeadingIds
                      )[0]
                    );
                    newItems = newItems
                      .slice(0, index)
                      .concat(subHeadings)
                      .concat(newItems.slice(index));
                  }
                  dispatch(
                    setColumns({
                      entityType,
                      order: newItems,
                    })
                  );
                }
                setState({
                  filteredTableColumns,
                  ...nextState,
                });
              }}
              >
              <StackLayout
                className="sortable-item"
                style={
                  column.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ? {}
                    : { display: 'none' }
                }
                >
                <StackLayout
                  onClick={() => {
                    if (column.subHeadingIds) {
                      localTableColumns.forEach(
                        (col, j) => {
                          if (col.subHeading) {
                            const index = localTableColumns.indexOf(
                              col
                            );
                            dispatch(toggleColumn({
                              entityType,
                              index,
                            }));
                          }
                        }
                      );
                    }
                    dispatch(
                      toggleColumn({
                        entityType,
                        index: localTableColumns.indexOf(column),
                      })
                    );
                  }}
                  style={{
                    width: '100%',
                    cursor: 'pointer',
                    alignItems: 'center',
                  }}
                  >
                  <input
                    aria-label={t(`facet.${column.id}`)}
                    checked={!filteredTableColumns[i].hidden}
                    readOnly
                    style={{ pointerEvents: 'none' }}
                    type="checkbox"
                    />
                  <span
                    style={{
                      marginLeft: '0.3rem',
                      color: '#18486B',
                    }}
                    >
                    {t(`facet.${column.id}`)}
                  </span>
                </StackLayout>
                <ArrangeIcon
                  style={{
                    marginLeft: 'auto',
                    cursor: 'row-resize',
                  }}
                  />
              </StackLayout>
            </SortableItem>
          )
        )}
      </div>
    );
  }
);

export default ArrangeColumns;
