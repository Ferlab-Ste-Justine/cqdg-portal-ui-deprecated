// @flow

// Vendor
import React from 'react';
import _ from 'lodash';
import { stringify } from 'query-string';

import { fetchApi } from '@ncigdc/utils/ajax';
import { notify } from '@ncigdc/dux/notification';
import { Column } from '@ncigdc/uikit/Flex';
import { center } from '@ncigdc/theme/mixins';
import { replaceFilters } from '@ncigdc/utils/filters';
import UnstyledButton from '@ncigdc/uikit/UnstyledButton';
import { API, IS_AUTH_PORTAL } from '@ncigdc/utils/constants';

import IoIosCloseCircleOutline from 'react-icons/lib/io/ios-close';
import FaExclamationCircle from 'react-icons/lib/fa/exclamation-circle';
import FaCheckCircle from 'react-icons/lib/fa/check-circle';

import t from '@cqdg/locales/intl';

/*----------------------------------------------------------------------------*/

export type TCartFile = {
  file_name: string;
  file_id: string;
  acl: Array<string>;
  state: string;
  access: string;
  file_size: number;
};

type TNotification = {
  fileText?: string;
  action: string;
  file: string | number;
  extraText?: any;
  prepositon: string;
  undo: {
    files: Array<TCartFile>;
    addAllToCart: boolean;
  };
};

export const UPDATE_CART = 'UPDATE_CART';
export const ADD_TO_CART = 'ADD_TO_CART';
export const CLEAR_CART = 'CLEAR_CART';
export const CART_FULL = 'CART_FULL';
export const TOGGLE_ADD_ALL = 'TOGGLE_ADD_ALL';
export const SAVE_ADD_ALL_STATE = 'SAVE_ADD_ALL_STATE';

export const MAX_CART_SIZE = 10000;

const DEFAULTS = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const getNotificationComponent = (
  action,
  id,
  notification: TNotification,
  dispatch,
) => ({
  action,
  id,
  component: (
    <div>
      <span
        style={{
          fontSize: '14px',
          lineHeight: '22px',
        }}
        >
        {action === 'add' && (
          <FaCheckCircle
            fill="#909500"
            height="14"
            style={{
              position: 'relative',
              top: '2px',
              verticalAlign: 'baseline',
              marginRight: '10px',
            }}
            width="14"
            />
        )}
        {action === 'remove' && (
          <FaExclamationCircle
            fill="#D19900"
            height="14"
            style={{
              position: 'relative',
              top: '2px',
              verticalAlign: 'baseline',
              marginRight: '10px',
            }}
            width="14"
            />
        )}
        <strong>
          {`${notification.fileCount} ${t('global.files')}`}
        </strong>
        {' '}
        {t(`cart.actions.${action}`)}
      </span>
      {notification.undo && (
        <span style={{ marginLeft: '15px' }}>
          <strong>
            <UnstyledButton
              onClick={() => {
                dispatch(toggleFilesInCart(notification.undo.files));
                dispatch(setAddAllToCart(notification.undo.addAllToCart));
              }}
              style={{
                display: 'inline-block',
                textDecoration: 'underline',
                textTransform: 'capitalize',
              }}
              >
              {t('cart.actions.undo')}
            </UnstyledButton>
            <i
              className="fa fa-undo"
              style={{
                marginLeft: '5px',
              }}
              />
          </strong>
        </span>
      )}
    </div>
  ),
});

const messageNotificationDispatcher = (
  action: string,
  message,
  dispatch: Function,
) => {
  dispatch(
    notify({
      action,
      id: `${new Date().getTime()}`,
      component: (
        <Column>
          <div>{message}</div>
        </Column>
      ),
    }),
  );
};

function toggleFilesInCart(
  incomingFile: TCartFile | Array<TCartFile>,
): Function {
  return (dispatch, getState) => {
    const incomingFileArray = Array.isArray(incomingFile)
      ? incomingFile
      : [incomingFile];
    const existingFiles = getState().cart.files;
    const nextFiles = _.xorBy(existingFiles, incomingFileArray, 'file_id');

    if (nextFiles.length > MAX_CART_SIZE) {
      dispatch({
        type: CART_FULL,
      });
      messageNotificationDispatcher(
        'warning',
        <div style={{ display: 'flex' }}>
          <IoIosCloseCircleOutline fill="#C54B38" height="21" width="21" />
          <div
            style={{
              marginLeft: '9px',
            }}
            >
            <h2
              style={{
                margin: '0',
                fontSize: '14px',
              }}
              >
              {t('cart.messages.max_items', {
                max: MAX_CART_SIZE,
              })}
            </h2>
            <p
              style={{
                margin: '0',
                fontSize: '14px',
              }}
              >
              {t('cart.messages.max_items.desc', {
                max: MAX_CART_SIZE,
              })}
            </p>
          </div>
        </div>,
        dispatch
      );
      return;
    }

    if (nextFiles.length > existingFiles.length) {
      dispatch(
        notify(
          getNotificationComponent(
            'add',
            `add/${incomingFile.file_name}`,
            {
              fileCount: incomingFileArray.length,
              undo: {
                files: incomingFile,
                addAllToCart: getState().cart.addAllToCart,
              },
            },
            dispatch,
          ),
        ),
      );
    }

    if (nextFiles.length < existingFiles.length) {
      console.log('removing', incomingFileArray);
      dispatch(
        notify(
          getNotificationComponent(
            'remove',
            `remove/${incomingFile.file_name}`,
            {
              fileCount: incomingFileArray.length,
              undo: {
                files: incomingFile,
                addAllToCart: getState().cart.addAllToCart,
              },
            },
            dispatch,
          ),
        ),
      );
    }

    dispatch({
      type: UPDATE_CART,
      payload: nextFiles,
    });
  };
}

function removeFilesFromCart(files: Array<TCartFile> | TCartFile): Function {
  return (dispatch, getState) => {
    const filesToRemove = Array.isArray(files) ? files : [files];
    const existingFiles = getState().cart.files;
    const nextFiles = _.differenceBy(existingFiles, filesToRemove, 'file_id');
    dispatch(
      notify(
        getNotificationComponent(
          'remove',
          `remove/${new Date().getTime()}`,
          {
            fileCount: filesToRemove.length,
            undo: {
              files: filesToRemove,
              addAllToCart: getState().cart.addAllToCart,
            },
          },
          dispatch,
        ),
      ),
    );

    dispatch({
      type: UPDATE_CART,
      payload: nextFiles,
    });
  };
}

function addAllFilesInCart(
  incomingFiles: Array<TCartFile> | TCartFile,
  notifyUser = true
): Function {
  return (dispatch, getState) => {
    const incomingFilesArray = Array.isArray(incomingFiles)
      ? incomingFiles
      : [incomingFiles];
    const existingFiles = getState().cart.files;
    const nextFiles = incomingFilesArray.filter(
      file =>
        !existingFiles.some(
          existingFile => existingFile.file_id === file.file_id,
        ),
    );
    const filesInCart = incomingFilesArray.length - nextFiles.length;

    if (nextFiles.length + existingFiles.length > MAX_CART_SIZE) {
      dispatch({
        type: CART_FULL,
      });

      if (notifyUser === true) {
        messageNotificationDispatcher(
          'warning',
          <div style={{ display: 'flex' }}>
            <IoIosCloseCircleOutline fill="#C54B38" height="21" width="21" />
            <div
              style={{
                marginLeft: '9px',
              }}
              >
              <h2
                style={{
                  margin: '0',
                  fontSize: '14px',
                }}
                >
                {t('cart.messages.max_items', {
                  max: MAX_CART_SIZE,
                })}
              </h2>
              <p
                style={{
                  margin: '0',
                  fontSize: '14px',
                }}
                >
                {t('cart.messages.max_items.desc', {
                  max: MAX_CART_SIZE,
                })}
              </p>
            </div>
          </div>,
          dispatch
        );
      }
      return;
    }

    if (notifyUser === true && nextFiles && nextFiles.length < incomingFilesArray.length) {
      dispatch(
        notify(
          getNotificationComponent(
            'add',
            `add/some${new Date().getTime()}`,
            {
              fileCount: nextFiles.length,
              undo: {
                files: nextFiles,
                addAllToCart: false,
              },
            },
            dispatch,
          ),
        ),
      );
    } else if (nextFiles) {
      if (notifyUser === true) {
        dispatch(
          notify(
            getNotificationComponent(
              'add',
              `add/all${new Date().getTime()}`,
              {
                fileCount: nextFiles.length,
                undo: {
                  files: nextFiles,
                  addAllToCart: false,
                },
              },
              dispatch,
            ),
          ),
        );
      }
    }
    dispatch({
      type: ADD_TO_CART,
      payload: nextFiles,
    });
  };
}

function fetchFilesAndAdd(currentFilters: ?Record<string, any>, total: number): Function {
  return async dispatch => {
    // if the total requested in filters is larger than max cart then don't bother fetching
    // otherwise need the IDs to tell if they are already in the cart
    if (total <= MAX_CART_SIZE) {
      messageNotificationDispatcher(
        'info',
        <span>
          Adding
          {' '}
          <b>{total}</b>
          {' '}
files to cart
        </span>,
        dispatch,
      );

      const search = stringify({
        filters: currentFilters && JSON.stringify(currentFilters),
        size: total,
        fields: 'acl,state,access,file_id,file_size',
      });
      const { data } = await fetchApi(`files?${search}`);
      const files = data.hits.map(({ cases, ...rest }) => ({
        ...rest,
      }));
      dispatch(addAllFilesInCart(files));
    } else {
      dispatch({
        type: CART_FULL,
      });
      messageNotificationDispatcher(
        'warning',
        <div style={{ display: 'flex' }}>
          <IoIosCloseCircleOutline fill="#C54B38" height="21" width="21" />
          <div
            style={{
              marginLeft: '9px',
            }}
            >
            <h2
              style={{
                margin: '0',
                fontSize: '14px',
              }}
              >
              {t('cart.messages.max_items', {
                max: MAX_CART_SIZE,
              })}
            </h2>
            <p
              style={{
                margin: '0',
                fontSize: '14px',
              }}
              >
              {t('cart.messages.max_items.desc', {
                max: MAX_CART_SIZE,
              })}
            </p>
          </div>
        </div>,
        dispatch
      );
    }
  };
}

function fetchFilesAndRemove(currentFilters: ?Record<string, any>, size: number): Function {
  return async (dispatch, getState) => {
    const existingFiles = getState().cart.files;

    if (!existingFiles.length) {
      dispatch(
        notify({
          action: 'warning',
          component: (
            <Column>
              <span>There are no files in the cart to remove.</span>
            </Column>
          ),
        }),
      );

      return;
    }

    messageNotificationDispatcher(
      'info',
      <span>Removing files from cart</span>,
      dispatch,
    );

    const filters =
      size > MAX_CART_SIZE
        ? replaceFilters(
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: {
                  field: 'files.file_id',
                  value: existingFiles.map(f => f.file_id),
                },
              },
            ],
          },
          currentFilters,
        )
        : currentFilters;

    const search = {
      headers: { 'Content-Type': 'application/json' },
      body: {
        filters,
        size: Math.min(size, MAX_CART_SIZE),
        fields: 'file_id,file_name',
      },
    };
    const { data } = await fetchApi('files', search);
    dispatch(removeFilesFromCart(data.hits));
  };
}

function removeAllInCart(): Function {
  return (dispatch, getState) => {
    const existingFiles = getState().cart.files;

    if (existingFiles.length) {
      dispatch(
        notify(
          getNotificationComponent(
            'remove',
            `remove/all${new Date().getTime()}`,
            {
              fileCount: existingFiles.length,
              undo: {
                files: existingFiles,
                addAllToCart: getState().cart.addAllToCart,
              },
            },
            dispatch,
          ),
        ),
      );

      dispatch({
        type: CLEAR_CART,
        payload: [],
      });
    } else {
      dispatch(
        notify({
          action: 'remove',
          id: 'remove/nofile',
          component: (
            <Column>
              <span>There are no files in the cart</span>
            </Column>
          ),
        }),
      );
    }
  };
}

function toggleAddAllToCart(): Function {
  return dispatch => {
    dispatch({
      type: TOGGLE_ADD_ALL,
    });
  };
}

function setAddAllToCart(val: Record<string, any>): Function {
  return dispatch => {
    dispatch({
      type: SAVE_ADD_ALL_STATE,
      payload: val,
    });
  };
}

const initialState = {
  files: [],
  addAllToCart: false,
};

export function reducer(state: Record<string, any> = initialState, action: Record<string, any>): Record<string, any> {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        files: state.files.concat(
          action.payload.map(file => ({
            acl: file.acl,
            state: file.state,
            access: file.access,
            file_id: file.file_id,
            file_size: file.file_size,
          })),
        ),
      };
    case SAVE_ADD_ALL_STATE:
      return {
        ...state,
        addAllToCart: action.payload,
      };
    case TOGGLE_ADD_ALL:
      return {
        ...state,
        addAllToCart: !state.addAllToCart,
      };
    case CLEAR_CART:
      return {
        ...state,
        files: [],
      };
    case UPDATE_CART:
      return {
        ...state,
        files: action.payload.map(file => ({
          acl: file.acl,
          state: file.state,
          access: file.access,
          file_id: file.file_id,
          file_size: file.file_size,
        })),
      };
    case CART_FULL:
      return state;
    default:
      return state;
  }
}

/*----------------------------------------------------------------------------*/

export {
  toggleFilesInCart,
  toggleAddAllToCart,
  addAllFilesInCart,
  removeAllInCart,
  removeFilesFromCart,
  fetchFilesAndAdd,
  fetchFilesAndRemove,
};

export default reducer;
