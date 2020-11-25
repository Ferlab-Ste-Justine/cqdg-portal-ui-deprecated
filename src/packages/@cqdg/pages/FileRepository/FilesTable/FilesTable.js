/* @flow */

import React from 'react';
import {
  compose, setDisplayName, branch, renderComponent,
} from 'recompose';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import { parse, stringify } from 'query-string';

import FaFile from 'react-icons/lib/fa/file';

import { Row } from '@ncigdc/uikit/Flex';
import timestamp from '@ncigdc/utils/timestamp';
import {
  parseIntParam,
} from '@ncigdc/utils/uri';


import Table from '@cqdg/components/table/Table';
import Tr from '@cqdg/components/table/Tr';

import TableActions from '@cqdg/components/table/TableActions';
import InlineCount from '@cqdg/components/countWithIcon/InlineCount';

import './FilesTable.css';

export default compose(
  setDisplayName('FilesTablePresentation'),
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
            e.persist();

            if (!this.scrollHander) {
              this.scrollHander = debounce(() => {
                const isNearBottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50;
                if (isNearBottom) {
                  const q = parse(window.location.search);
                  const offsetSize = parseIntParam(q.files_size, 20);
                  q.files_size = offsetSize + 20;
                  const stringified = stringify(q);
                  history.push(`${window.location.pathname}?${stringified}`);
                }
              }, 150);
            }
            this.scrollHander();
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
