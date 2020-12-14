import React from 'react';
import { compose, withState } from 'recompose';

import timestamp from '@ncigdc/utils/timestamp';
import withRouter from '@ncigdc/utils/withRouter';
import { visualizingButton } from '@ncigdc/theme/mixins';
import SortTableButton from '@ncigdc/components/SortTableButton';

import StackLayout from '@ferlab-ui/core/layouts/StackLayout';

import { mergeQuery } from '@cqdg/utils/filters';
import { parseJSONParam, stringifyJSONParam } from '@cqdg/utils/uri';
import ArrangeColumnsButton from '@cqdg/components/table/button/ArrangeColumnsButton';
import DownloadTableButton from '@cqdg/components/table/button/DownloadTableButton';
import t from '@cqdg/locales/intl';

import './TableActions.css';

const tableSortFuncCreator = (
  query,
  sortKey,
  push
) => selectedSort => {
  // Construct the new query by merging existing filters/query
  const newQuery = mergeQuery(
    { [sortKey]: stringifyJSONParam(selectedSort) },
    query,
    true
  );

  // If there are filters the stringify them otherwise remove the key
  if (Object.keys(newQuery.filters || {}).length > 0) {
    newQuery.filters = stringifyJSONParam(newQuery.filters);
  } else {
    delete newQuery.filters;
  }

  // Push the new query
  push({ query: newQuery });
};

const TableActions = ({
  type,
  arrangeColumnKey,
  sortOptions,
  downloadable = true,
  tsvSelector,
  tsvFilename,
  style,
  query = {},
  push = () => {},
  showClinicalDownload = false,
  downloadClinical = false,
  clinicalData,
  hideColumns,
}) => (
  <StackLayout className="test-table-actions" style={style}>
    {showClinicalDownload && (
      <React.Fragment>
        <DownloadTableButton
          className="table-actions-buttons"
          filename={`clinical.cases_selection.${timestamp()}.tsv`}
          isDisabled={!downloadClinical}
          portionData={clinicalData}
          selector={tsvSelector}
          >
          <span className="clinical-download-text">{t('global.tables.actions.clinical.data')}</span>
        </DownloadTableButton>
        <div className="separator" />
      </React.Fragment>
    )}
    {arrangeColumnKey && (
      <ArrangeColumnsButton
        buttonClassName="table-actions-buttons"
        entityType={arrangeColumnKey}
        hideColumns={hideColumns}
        style={{
          ...visualizingButton,
        }}
        />
    )}
    {sortOptions && (
      <SortTableButton
        buttonClassName="table-actions-buttons"
        initialState={
            query[`${type}s_sort`]
              ? { sortSelection: parseJSONParam(query[`${type}s_sort`]) }
              : { sortSelection: [] }
          }
        isDisabled={!sortOptions.length}
        options={sortOptions}
        sortFunction={tableSortFuncCreator(query, `${type}s_sort`, push)}
        style={{
          ...visualizingButton,
        }}
        />
    )}
    {downloadable && tsvSelector &&
        tsvFilename && (
          <DownloadTableButton
            className="table-actions-buttons"
            filename={tsvFilename}
            selector={tsvSelector}
            />
    )}
  </StackLayout>
);


export default compose(
  withRouter,
  withState('state', 'setState', {
    tsvDownloading: false,
    jsonDownloading: false,
  }),
)(TableActions);
