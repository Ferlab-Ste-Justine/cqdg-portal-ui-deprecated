import React from 'react';
import styled from '@ncigdc/theme/styled';
import {
  mergeQuery,
  makeFilter,
  inCurrentFilters,
} from '@ncigdc/utils/filters';
import PieChart from '@cqdg/components/charts/PieChart';
import { Row, Column } from '@ncigdc/uikit/Flex';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
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

export const ShowToggleBox = styled.div({
  border: ({ theme }) => `1px solid ${theme.greyScale4}`,
  padding: '0.25rem 0.5rem',
  marginBottom: '0.75rem',
  marginTop: '0.5rem',
  backgroundColor: ({ theme }) => theme.white,
  cursor: 'pointer',
  color: ({ theme }) => theme.primary,
});

export const PieTitle = styled.div({
  color: ({ theme }) => theme.primary || 'inherit',
  paddingTop: '1rem',
  fontWeight: '600',
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
