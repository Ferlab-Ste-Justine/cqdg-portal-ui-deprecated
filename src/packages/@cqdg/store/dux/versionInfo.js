// @flow
import { handleActions } from 'redux-actions';
import { UI_VERSION, UI_COMMIT_HASH } from '@cqdg/utils/constants';

// Action Types

export const VERSION_INFO_SUCCESS = 'gdc/VERSION_INFO_SUCCESS';

// Action Creator
export function fetchApiVersionInfo(): Function {
  return async (dispatch, getState) => {
//    const { tag, commit, data_release } = await fetchApi('status', {
//      credentials: 'same-origin',
//    });
//    const apiVersionInfo = {
//      apiVersion: tag,
//      apiCommitHash: commit,
//      dataRelease: data_release,
//    };
//
//    const versionInfo = {
//      ...getState().versionInfo,
//      ...apiVersionInfo,
//    };
//
//    logVersionInfo(versionInfo);
//

    const apiVersionInfo = {
      apiCommitHash: '585cd1079835b7d5bec5c4dfd154fd9adde5f18e',
      dataRelease: 'Data Release 22.0 - January 16, 2020',
      apiVersion: '2.0.0',
    };
    dispatch({
      type: VERSION_INFO_SUCCESS,
      payload: apiVersionInfo,
    });
  };
}

// Reducer
const initialState = {
  uiVersion: UI_VERSION,
  uiCommitHash: UI_COMMIT_HASH,
  apiVersion: '',
  apiCommitHash: '',
  dataRelease: '',
};

export default handleActions(
  {
    [VERSION_INFO_SUCCESS]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  initialState,
);
