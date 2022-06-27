import isEqual from 'lodash/isEqual';
import every from 'lodash/every';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import mapValues from 'lodash/mapValues';
import some from 'lodash/some';
import {
  getCurrentQuery,
} from '@cqdg/store/query';
import { stringifyJSONParam } from '@cqdg/utils/uri';
import { removeEmptyKeys } from '@cqdg/utils/object';
import { stringify } from 'query-string';

interface ILinkQuery {
  offset: number;
  filters: {
    op: string;
    component: {
      op: string;
      content: {
        field: string;
        value: string[];
      };
    };
  };
}

enum MergeType {
  add = 'add',
  toggle = 'toggle',
}

type IMergeQueryCallback =
  (query: ILinkQuery | {}, contextQuery: object, merge?: MergeType, whitelist?: string[]) => object

export const createLinkContext = (
  query: ILinkQuery,
  mergeQuery: IMergeQueryCallback,
  merge: MergeType = MergeType.toggle,
  whitelist?: string[],
  forceResetOffset = false
) => {
  const contextQuery = getCurrentQuery();

  const mergedQuery =
    merge && mergeQuery
      ? mergeQuery(query, contextQuery, merge, whitelist)
      : query;

  const hasFilterChanged = some([
    isEqual(
      get(mergedQuery, 'filters'),
      get(mergeQuery({}, contextQuery), 'filters'),
    ),
    every(
      [get(contextQuery, 'filters'), get(mergedQuery, 'filters')],
      isNil,
    ),
  ]);

  const queryWithOffsetsReset = hasFilterChanged && !forceResetOffset
  ? mergedQuery
  : mapValues(
    mergedQuery,
    (value, paramName: string) => (paramName.endsWith('offset') || paramName.endsWith('size') ? 0 : value),
  );

  return queryWithOffsetsReset;
};

export const createSearchQuery = (query: ILinkQuery, search?: string) => {
  if (search) { return search; }
  const q0 = query || {};
  const f0 = q0.filters ? stringifyJSONParam(q0.filters) : null;

  const q1 = {
    ...q0,
    filters: f0,
  };

  const q = removeEmptyKeys(q1);

  return stringify(q);
};
