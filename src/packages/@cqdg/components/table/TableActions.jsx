import React from 'react';
import { compose, withState } from 'recompose';

import ArrangeColumnsButton from '@ncigdc/components/ArrangeColumnsButton';
import DownloadBiospecimenDropdown from '@ncigdc/modern_components/DownloadBiospecimenDropdown';
import DownloadClinicalDropdown from '@ncigdc/modern_components/DownloadClinicalDropdown';
import SetActions from '@ncigdc/components/SetActions';
import timestamp from '@ncigdc/utils/timestamp';
import withRouter from '@ncigdc/utils/withRouter';
import { IGroupFilter } from '@ncigdc/utils/filters/types';
import { IRawQuery } from '@ncigdc/utils/uri/types';
import { mergeQuery } from '@ncigdc/utils/filters';
import { Row } from '@ncigdc/uikit/Flex';
import { parseJSONParam, stringifyJSONParam, parseFilterParam } from '@ncigdc/utils/uri';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { withTheme } from '@ncigdc/theme';
import SortTableButton, {
  ISortTableOption,
  TSortTableButtonSortFunc,
} from '@ncigdc/components/SortTableButton';

import DownloadTableButton from '@cqdg/components/table/button/DownloadTableButton';


import './TableActions.css';

type TTableSortFuncCreator = (
  q: IRawQuery,
  sk: string,
  p: ({}) => void
) => TSortTableButtonSortFunc;
const tableSortFuncCreator: TTableSortFuncCreator = (
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

interface IProps {
  type: string;
  total: number;
  endpoint: string;
  downloadFields: string[];
  query?: IRawQuery;
  push?: ({}) => void;
  displayType?: string;
  arrangeColumnKey?: string;
  currentFilters: IGroupFilter;
  sortOptions?: ISortTableOption[];
  downloadable?: boolean;
  tsvSelector?: string;
  tsvFilename?: string;
  style?: React.CSSProperties;
  CreateSetButton?: React.ComponentType;
  RemoveFromSetButton?: React.ComponentType;
  idField?: string;
  selectedIds?: string[];
  theme?: object;
  totalCases?: number;
  // Todo: type these properly
  downloadTooltip?: string | JSX.Element;
  sort?: { field: string; order: string };
  score?: string;
  scope?: string;
  AppendSetButton?: React.ComponentClass;
  downloadClinical?: boolean;
  downloadBiospecimen?: boolean;
  hideColumns?: string[];
}

const TableActions: React.SFC<IProps> = ({
  type,
  displayType = type,
  arrangeColumnKey,
  total,
  sortOptions,
  downloadable = true,
  tsvSelector,
  tsvFilename,
  style,
  currentFilters,
  CreateSetButton,
  RemoveFromSetButton,
  idField,
  query = {},
  push = () => {},
  selectedIds,
  sort,
  score,
  AppendSetButton,
  scope,
  downloadClinical,
  downloadBiospecimen,
  hideColumns,
}: IProps) => {
  const fieldContains = ({
    field,
    filters,
  }: {
    filters: IGroupFilter;
    field: string;
  }) => {
    return ((filters || {}).content || []).some(f =>
      f.content.field.includes(field));
  };
  return (
    <Row className="test-table-actions" spacing="0.3rem" style={style}>
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
      {downloadBiospecimen && (
        <DownloadBiospecimenDropdown
          buttonStyles={{
            ...visualizingButton,
          }}
          filters={
            currentFilters || parseFilterParam((query || {}).filters, {})
          }
          inactiveText="Biospecimen"
          jsonFilename={`biospecimen.cases_selection.${timestamp()}.json`}
          selectedIds={selectedIds}
          shouldCreateSet={
            (scope === 'explore' &&
              fieldContains({
                filters: { ...currentFilters },
                field: 'gene',
              })) ||
            fieldContains({
              filters: { ...currentFilters },
              field: 'ssms',
            })
          }
          tsvFilename={`biospecimen.cases_selection.${timestamp()}.tar.gz`}
          />
      )}
      {downloadClinical && (
        <DownloadClinicalDropdown
          buttonStyles={{
            ...visualizingButton,
          }}
          filters={
            currentFilters || parseFilterParam((query || {}).filters, {})
          }
          inactiveText="Clinical"
          jsonFilename={`clinical.cases_selection.${timestamp()}.json`}
          scope={scope}
          selectedIds={selectedIds}
          tsvFilename={`clinical.cases_selection.${timestamp()}.tar.gz`}
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

      {CreateSetButton &&
        RemoveFromSetButton &&
        AppendSetButton &&
        idField && (
          <SetActions
            AppendSetButton={AppendSetButton}
            CreateSetButton={CreateSetButton}
            displayType={displayType}
            field={idField}
            filters={currentFilters}
            RemoveFromSetButton={RemoveFromSetButton}
            scope={scope}
            score={score}
            selectedIds={selectedIds || []}
            sort={sort}
            total={total}
            type={type}
            />
      )}
    </Row>
  );
};

export default compose(
  withRouter,
  withState('state', 'setState', {
    tsvDownloading: false,
    jsonDownloading: false,
  }),
  withTheme
)(TableActions);
