import { REHYDRATE } from 'redux-persist';
// Custom
import { default as tableModels } from '@cqdg/relay/models';
import { namespaceActions } from './utils';
/*----------------------------------------------------------------------------*/
const tableColumns = namespaceActions('tableColumns', [
  'TOGGLE_COLUMN',
  'RESTORE',
  'SET',
]);
const toggleColumn = ({
  entityType,
  index,
}) => ({
  type: tableColumns.TOGGLE_COLUMN,
  payload: {
    entityType,
    index,
  },
});
const restoreColumns = (entityType) => ({
  type: tableColumns.RESTORE,
  payload: { entityType },
});
const setColumns = ({
  entityType,
  order,
}) => ({
  type: tableColumns.SET,
  payload: {
    entityType,
    order,
  },
});
const initialState = Object.keys(tableModels).reduce(
  (acc, key) => ({
    ...acc,
    [key]: tableModels[key],
  }),
  { version: 5 }
);

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      const { version = -1, ...allTableColumns } =
        (action.payload && action.payload.tableColumns) || {};
      if (version !== state.version) {
        return { ...initialState };
      }
      return {
        ...state,
        ...Object.entries(
          allTableColumns || {}
        ).reduce((acc, [key, val]) => {
          const orderArray = val.map((v) => v.id);
          const order = Array.isArray(val)
            ? state[key]
              .slice()
              .sort(
                (a, b) =>
                  orderArray.indexOf(a.id) - orderArray.indexOf(b.id)
              )
            : state[key];

          return {
            ...acc,
            [key]: order.map((element, i) => {
              if (val[i] && val[i].hasOwnProperty('hidden')) {
                return {
                  ...element,
                  hidden: val[i].hidden,
                };
              }
              return element;
            }),
          };
        }, {}),
      };
    }
    case tableColumns.TOGGLE_COLUMN: {
      const { entityType, index } = action.payload;
      return {
        ...state,
        [entityType]: [
          ...state[entityType].slice(0, index),
          {
            ...state[entityType][index],
            hidden: !state[entityType][index].hidden,
          },
          ...state[entityType].slice(index + 1, Infinity),
        ],
      };
    }
    case tableColumns.RESTORE: {
      const { entityType } = action.payload;
      return {
        ...state,
        [entityType]: initialState[entityType],
      };
    }
    case tableColumns.SET: {
      const { entityType, order } = action.payload;
      return {
        ...state,
        [entityType]: order.slice(),
      };
    }
    default:
      return state;
  }
};
/*----------------------------------------------------------------------------*/
export { toggleColumn, restoreColumns, setColumns };
export default reducer;
