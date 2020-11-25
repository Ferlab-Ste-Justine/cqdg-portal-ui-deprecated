/* @flow */

import React from 'react';
import {
  compose, setDisplayName, branch, renderComponent, withState,
} from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { parse, stringify } from 'query-string';

import FaFile from 'react-icons/lib/fa/file';

import { Row } from '@ncigdc/uikit/Flex';
import Table, { Tr } from '@ncigdc/uikit/Table';
import timestamp from '@ncigdc/utils/timestamp';
import {
  parseIntParam,
} from '@ncigdc/utils/uri';


import TableActions from '@cqdg/components/TableActions';
import InlineCount from '@cqdg/components/countWithIcon/InlineCount';

import './FilesTable.css';

export default compose(
  setDisplayName('FilesTablePresentation'),
  withRouter,
  connect(state => ({ tableColumns: state.tableColumns.files })),
  branch(
    ({ viewer }) =>
      !viewer.File.hits ||
      !viewer.File.hits.edges.length,
    renderComponent(() => <div>No results found</div>)
  )
)(
  ({
    canAddToCart = true,
    downloadable,
    entityType = 'files',
    history,
    location: { search },
    tableColumns,
    tableHeader,
    viewer: { File: { hits } },
  }) => {
    const tableInfo = tableColumns.slice().filter(x => !x.hidden);
    return (
      <div className="files-table">
        {tableHeader && (
          <h1 className="panel-title">
            {tableHeader}
          </h1>
        )}
        <Row className="files-actions">
          <InlineCount Icon={FaFile} label="global.files" total={hits.total} />
          <TableActions
            arrangeColumnKey={entityType}
            downloadable={downloadable}
            downloadFields={tableInfo
              .filter(x => x.downloadable)
              .map(x => x.field || x.id)}
            endpoint="files"
            scope="repository"
            sortOptions={tableInfo.filter(x => x.sortable)}
            total={hits.total}
            tsvFilename={`repository-files-table.${timestamp()}.tsv`}
            tsvSelector="#repository-files-table"
            type="file"
            />
        </Row>
        <div
          className="table-container"
          onScroll={(e) => {
            const isNearBottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50;
            console.log(e.target.scrollTop);
            if (isNearBottom) {
              e.target.scrollTop -= 25;
              const q = parse(search);
              const offsetSize = parseIntParam(q.files_size, 20);
              q.files_size = offsetSize + 20;
              const stringified = stringify(q);
              history.push(`${location.pathname}?${stringified}`);
            }
          }}
          >
          <Table
            body={(
              <tbody>
                {hits.edges.map((e, i) => (
                  <Tr index={i} key={e.node.id}>
                    {[
                      ...tableInfo
                        .filter(x => x.td)
                        .map(x => (
                          <x.td
                            index={i}
                            key={x.id}
                            node={e.node}
                            total={hits.total}
                            />
                        )),
                    ]}
                  </Tr>
                ))}
              </tbody>
            )}
            headings={[
              ...tableInfo.map(x => (
                <x.th canAddToCart={canAddToCart} hits={hits} key={x.id} />
              )),
            ]}
            id="repository-files-table"
            />
        </div>
      </div>
    );
  }
);
