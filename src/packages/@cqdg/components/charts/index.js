import React from 'react';
import {
  mergeQuery,
  makeFilter,
  inCurrentFilters,
} from '@cqdg/utils/filters';
import PieChart from '@cqdg/components/charts/PieChart';
import { stringifyJSONParam } from '@cqdg/utils/uri';

import removeEmptyKeys from '@ncigdc/utils/removeEmptyKeys';

import HorizontalBarChart from './HorizontalBarChart';

const toPieData = (clickHandler, docTypeSingular) => bucket => ({
  id: bucket.key,
  doc_count: bucket.doc_count,
  clickHandler,
  tooltip: (
    <span>
      <b>{bucket.key}</b>
      <br />
      {bucket.doc_count.toLocaleString()}
      {' '}
      {docTypeSingular}
      {bucket.doc_count > 1 ? 's' : ''}
    </span>
  ),
});

function addFilter(query: Record<string, any>, push: Function): Function {
  return (field, values) => {
    const newQuery = mergeQuery(
      {
        filters: makeFilter([
          {
            field,
            value: Array.isArray(values) ? values : [values],
          },
        ]),
      },
      query,
      'toggle',
    );

    push({
      query: removeEmptyKeys({
        ...newQuery,
        filters: newQuery.filters && stringifyJSONParam(newQuery.filters),
      }),
    });
  };
}

export const SelfFilteringPie = ({
  buckets,
  currentFieldNames,
  currentFilters,
  docTypeSingular,
  fieldName,
  push,
  query,
  ...props
}) => (
  <PieChart
    data={(buckets || [])
      .filter(bucket => bucket.key !== '__missing__')
      .filter(
        bucket =>
          (currentFieldNames.includes(fieldName)
            ? inCurrentFilters({
              key: bucket.key,
              dotField: fieldName,
              currentFilters,
            })
            : true),
      )
      .map(
        toPieData(
          ({ data }) => addFilter(query, push)(fieldName, data.id),
          docTypeSingular,
        ),
    )}
    {...props}
    />
);

export const SelfFilteringBars = ({
  buckets,
  currentFieldNames,
  currentFilters,
  docTypeSingular,
  fieldName,
  push,
  query,
  ...props
}) => (
  <HorizontalBarChart
    data={(buckets || [])
      .filter(bucket => bucket.key !== '__missing__')
      .filter(
        bucket =>
          (currentFieldNames.includes(fieldName)
            ? inCurrentFilters({
              key: bucket.key,
              dotField: fieldName,
              currentFilters,
            })
            : true),
      )
      .slice(0, 10)
      .map(
        toPieData(
          (data) => addFilter(query, push)(fieldName, data.id),
          docTypeSingular,
        ),
    )}
    {...props}
    />
);
