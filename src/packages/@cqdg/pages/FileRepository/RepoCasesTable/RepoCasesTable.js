/* @flow */

import React from 'react';
import {
  compose, setDisplayName, branch, renderComponent,
} from 'recompose';
import { connect } from 'react-redux';
import MdPeople from 'react-icons/lib/md/people';

import Pagination from '@ncigdc/components/Pagination';
import Showing from '@ncigdc/components/Pagination/Showing';
import { Row } from '@ncigdc/uikit/Flex';
import tableModels from '@ncigdc/tableModels';
import { CreateRepositoryCaseSetButton, AppendRepositoryCaseSetButton, RemoveFromRepositoryCaseSetButton } from '@ncigdc/modern_components/withSetAction';


import { theme } from '@ncigdc/theme';
import withSelectIds from '@ncigdc/utils/withSelectIds';
import timestamp from '@ncigdc/utils/timestamp';

import TableActions from '@cqdg/components/table/TableActions';
import InlineCount from '@cqdg/components/countWithIcon/InlineCount';
import Table from '@cqdg/components/table/Table';
import Tr from '@cqdg/components/table/Tr';

import './CasesTable.css';

export default compose(
  setDisplayName('RepoCasesTablePresentation'),
  connect(state => ({ tableColumns: state.tableColumns.cases })),
  branch(
    ({ viewer }) =>
      !viewer.Case.hits ||
      !viewer.Case.hits.edges.length,
    renderComponent(() => <div>No results found</div>)
  ),
  withSelectIds
)(
  ({
    entityType = 'cases',
    selectedIds,
    setSelectedIds,
    tableColumns,
    variables,
    viewer: { Case: { hits } },
  }) => {
    const tableInfo = tableColumns.slice().filter(x => !x.hidden);

    return (
      <div className="cases-table">
        <Row
          style={{
            backgroundColor: 'white',
            padding: '1rem',
            justifyContent: 'space-between',
          }}
          >
          <InlineCount Icon={MdPeople} label="global.cases" total={hits.total} />
          <TableActions
            arrangeColumnKey={entityType}
            currentFilters={variables.filters}
            downloadFields={tableInfo
              .filter(x => x.downloadable)
              .map(x => x.field || x.id)}
            endpoint="cases"
            idField="cases.case_id"
            scope="repository"
            score={variables.score}
            selectedIds={selectedIds}
            sort={variables.cases_sort}
            sortOptions={tableInfo.filter(x => x.sortable)}
            // CreateSetButton={CreateRepositoryCaseSetButton}
            // AppendSetButton={AppendRepositoryCaseSetButton}
            // RemoveFromSetButton={RemoveFromRepositoryCaseSetButton}
            total={hits.total}
            tsvFilename={`repository-cases-table.${timestamp()}.tsv`}
            tsvSelector="#repository-cases-table"
            type="case"
            />
        </Row>
        <div style={{ overflowX: 'auto' }}>
          <Table
            body={(
              <tbody>
                {hits.edges.map((e, i) => (
                  <Tr
                    index={i}
                    key={e.node.id}
                    style={{
                      ...(selectedIds.includes(e.node.case_id) && {
                        backgroundColor: theme.tableHighlight,
                      }),
                    }}
                    >
                    {tableInfo
                      .filter(x => x.td)
                      .map(x => (
                        <x.td
                          edges={hits.edges}
                          index={i}
                          key={x.id}
                          node={e.node}
                          selectedIds={selectedIds}
                          setSelectedIds={setSelectedIds}
                          total={hits.total}
                          />
                      ))}
                  </Tr>
                ))}
              </tbody>
            )}
            headings={tableInfo
              .filter(x => !x.subHeading)
              .map(x => (
                <x.th
                  key={x.id}
                  nodes={hits.edges}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  />
              ))}
            id="repository-cases-table"
            subheadings={tableInfo
              .filter(x => x.subHeading)
              .map(x => <x.th key={x.id} />)}
            />
        </div>
      </div>
    );
  }
);
