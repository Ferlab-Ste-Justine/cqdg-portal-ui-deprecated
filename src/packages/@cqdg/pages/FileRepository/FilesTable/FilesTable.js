/* @flow */

import React from 'react';
import {
  compose, setDisplayName, branch, renderComponent, withPropsOnChange,
} from 'recompose';
import { connect } from 'react-redux';

import FaFile from 'react-icons/lib/fa/file';
import SaveIcon from 'react-icons/lib/md/save';

import timestamp from '@ncigdc/utils/timestamp';
import formatFileSize, { EFileInputType } from '@cqdg/utils/formatFileSize';

import ScrollableTable from '@cqdg/components/table/ScrollableTable';
import Table from '@cqdg/components/table/Table';
import Tr from '@cqdg/components/table/Tr';

import TableActions from '@cqdg/components/table/TableActions';
import InlineCount from '@cqdg/components/countWithIcon/InlineCount';
import StackLayout from '@ferlab-ui/core/layouts/StackLayout';

import './FilesTable.css';
import Td from '@cqdg/components/table/Td';
import {
  addAllFilesInCart, removeAllInCart, toggleFilesInCart, toggleAddAllToCart,
} from '@ncigdc/dux/cart';
import Th from '@cqdg/components/table/Th';
import Button from '@ferlab-ui/core/buttons/button';
import CartIcon from '@cqdg/components/icons/CartIcon';


export default compose(
  setDisplayName('FilesTablePresentation'),
  connect(state => ({
    tableColumns: state.tableColumns.files,
    cartFiles: state.cart.files,
    addAllToCart: state.cart.addAllToCart,
  })),
  withPropsOnChange(['variables'], ({ variables: { files_size } }) => {
    return {
      resetScroll: !(files_size > 20),
    };
  }),
  branch(
    ({ viewer }) =>
      !viewer.File.hits ||
      !viewer.File.hits.edges.length,
    renderComponent(() => <div>No results found</div>)
  )
)(
  ({
    addAllToCart,
    cartFiles,
    dispatch,
    downloadable,
    entityType = 'files',
    resetScroll = false,
    tableColumns,
    tableHeader,
    viewer: { File: { aggregations: fileSummary, hits } },
  }) => {
    const tableInfo = tableColumns.slice().filter(x => !x.hidden);
    const fileInCart = (file) => cartFiles.some(f => f.file_id === file.file_id);
    if (addAllToCart === true && hits && hits.edges) {
      const delta = hits.edges.map(e => e.node).filter(
        file =>
          !cartFiles.some(
            cf => cf.file_id === file.file_id
          )
      );

      if (delta && delta.length > 0) {
        dispatch(addAllFilesInCart(delta, false));
      }
    }

    return (
      <div className="files-table">
        {tableHeader && (
          <h1 className="panel-title">
            {tableHeader}
          </h1>
        )}
        <StackLayout className="files-actions">
          <StackLayout>
            <InlineCount Icon={FaFile} label="global.files" total={hits.total} />
            <div className="separator" />
            <InlineCount Icon={SaveIcon} iconClassName="save-icon" total={formatFileSize(fileSummary.file_size.stats.sum, {}, EFileInputType.MB)} />
          </StackLayout>
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
        </StackLayout>
        <ScrollableTable item="files_size" resetScroll={resetScroll}>
          <Table
            body={(
              <tbody>
                {hits.edges.map((e, i) => (
                  <Tr index={i} key={e.node.id}>
                    {[
                      <Td key="add_to_cart">
                        <Button
                          active={fileInCart(e.node)}
                          className="files-table-cart-btn"
                          onClick={() => {
                            dispatch(toggleFilesInCart(e.node));
                            if (addAllToCart === true) {
                              dispatch(toggleAddAllToCart());
                            }
                          }}
                          >
                          <CartIcon />
                        </Button>
                      </Td>,
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
              <Th className="table-th" key="cart-toggle-all">
                <Button
                  active={addAllToCart}
                  className="files-table-cart-btn"
                  onClick={() => {
                    dispatch(toggleAddAllToCart());
                    dispatch(addAllToCart
                            ? removeAllInCart()
                            : addAllFilesInCart(hits.edges.map(e => e.node)));
                  }}
                  >
                  <CartIcon />
                </Button>
              </Th>,
              ...tableInfo.map(x => (
                <x.th hits={hits} key={x.id} />
              )),
            ]}
            id="repository-files-table"
            />
        </ScrollableTable>
      </div>
    );
  }
);
