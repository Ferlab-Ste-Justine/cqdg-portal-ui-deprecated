/* @flow */

import React from 'react';
import {
  compose, setDisplayName, branch, renderComponent, withPropsOnChange, withState,
} from 'recompose';
import { connect } from 'react-redux';
import MdPeople from 'react-icons/lib/md/people';

import { get } from 'lodash';
import withSelectIds from '@ncigdc/utils/withSelectIds';
import timestamp from '@ncigdc/utils/timestamp';
import { Tooltip } from '@cqdg/components/Tooltip';

import ScrollableTable from '@cqdg/components/table/ScrollableTable';
import TableActions from '@cqdg/components/table/TableActions';
import InlineCount from '@cqdg/components/countWithIcon/InlineCount';
import Table from '@cqdg/components/table/Table';
import Tr from '@cqdg/components/table/Tr';

import StackLayout from 'cqdg-ui/core/layouts/StackLayout';
import { addAllFilesInCart, toggleFilesInCart } from '@cqdg/store/dux/cart';
import Button from 'cqdg-ui/core/buttons/button';
import CartIcon from '@cqdg/components/icons/CartIcon';

import './CasesTable.css';
import Td from '@cqdg/components/table/Td';
import Th from '@cqdg/components/table/Th';
import t from '@cqdg/locales/intl';

export const CART_NO_MATCH = 'NO_MATCH';
export const CART_PARTIAL_MATCH = 'PARTIAL';
export const CART_EXACT_MATCH = 'EXACT';

export default compose(
  setDisplayName('RepoCasesTablePresentation'),
  connect(state => ({
    cartFiles: state.cart.files,
    tableColumns: state.tableColumns.cases,
  })),
  withPropsOnChange(['variables'], ({ variables: { cases_size } }) => ({
    resetScroll: !(cases_size > 20),
  })),
  withState('state', 'setState', {
    clinicalDataToggled: [],
    toggleAllClinicalFiles: false,
  }),
  branch(
    ({ viewer }) =>
      !viewer.Case.hits ||
      !viewer.Case.hits.edges.length,
    renderComponent(() => <div>No results found</div>)
  ),
  withSelectIds
)(
  ({
    cartFiles,
    dispatch,
    entityType = 'cases',
    resetScroll,
    selectedIds,
    setSelectedIds,
    setState,
    state,
    tableColumns,
    variables,
    viewer: { Case: { hits } },
  }) => {
    const { clinicalDataToggled, toggleAllClinicalFiles } = state;
    const tableInfo = tableColumns.slice().filter(x => !x.hidden);
    const getNbFilesMatchInCart = (files) => cartFiles.filter(cartFile => files.map(f => f.file_id).includes(cartFile.file_id)).length;
    const getCartState = (count, files) => (count === files.length ? CART_EXACT_MATCH : count > 0 ? CART_PARTIAL_MATCH : CART_NO_MATCH);
    return (
      <div className="cases-table">
        <StackLayout className="cases-actions">
          <InlineCount Icon={MdPeople} label="global.cases" total={hits.total} />
          <TableActions
            arrangeColumnKey={entityType}
            clinicalData={toggleAllClinicalFiles ? 'all' : clinicalDataToggled}
            currentFilters={variables.filters}
            downloadClinical={toggleAllClinicalFiles || clinicalDataToggled.length > 0}
            downloadFields={tableInfo
              .filter(x => x.downloadable)
              .map(x => x.field || x.id)}
            endpoint="cases"
            idField="cases.case_id"
            scope="repository"
            score={variables.score}
            selectedIds={selectedIds}
            showClinicalDownload
            sort={variables.cases_sort}
            sortOptions={tableInfo.filter(x => x.sortable)}
            total={hits.total}
            tsvFilename={`repository-cases-table.${timestamp()}.tsv`}
            tsvSelector="#repository-cases-table"
            type="case"
            />
        </StackLayout>
        <ScrollableTable item="cases_size" resetScroll={resetScroll}>
          <Table
            body={(
              <tbody>
                {hits.edges.map((e, i) => {
                  const fileHits = get(e.node, 'files.hits.edges', []).map(e => e.node);
                  const nbOfFilesMatchInCart = getNbFilesMatchInCart(fileHits);
                  const cartState = getCartState(nbOfFilesMatchInCart, fileHits);
                  return (
                    <Tr
                      index={i}
                      key={e.node.id}
                      style={{
                        ...(selectedIds.includes(e.node.case_id) && {
                          backgroundColor: '#ffffbe',
                        }),
                      }}
                      >
                      {[
                        <Td key="download_clinical_data">
                          <input
                            checked={toggleAllClinicalFiles || clinicalDataToggled.includes(i)}
                            className="clinical-checkbox"
                            onChange={() => {
                              let data = [...clinicalDataToggled];
                              const isToggled = clinicalDataToggled.includes(i);
                              if (isToggled) {
                                data = clinicalDataToggled.filter((id) => id !== i);
                              } else {
                                data.push(i);
                              }

                              setState({
                                ...state,
                                clinicalDataToggled: data,
                              });
                            }}
                            type="checkbox"
                            />
                        </Td>,
                        <Td key="add_to_cart">
                          <Button
                            active={cartState !== CART_NO_MATCH}
                            className={`cases-table-cart-btn ${cartState === CART_PARTIAL_MATCH ? 'partial-match' : ''}`}
                            onClick={() => dispatch(cartState === CART_PARTIAL_MATCH ? addAllFilesInCart(fileHits) : toggleFilesInCart(fileHits))}
                            >
                            {
                            cartState === CART_PARTIAL_MATCH
                              ? (
                                <Tooltip
                                  className="tooltip"
                                  Component={(
                                    <div>
                                      {t('cart.partial', {
                                        nbFilesInCart: nbOfFilesMatchInCart,
                                        nbFilesInSearchResult: fileHits.length,
                                      })}
                                    </div>
                                  )}
                                  >
                                  <CartIcon />
                                </Tooltip>
)
                              : <CartIcon />
                          }
                          </Button>
                        </Td>,
                        ...tableInfo
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
                          )),
                      ]}
                    </Tr>
                  );
                })}
              </tbody>
            )}
            headings={[
              <Th key="download-clinical-toggle-all">
                <input
                  checked={toggleAllClinicalFiles}
                  className="clinical-checkbox"
                  onChange={() => setState({
                    clinicalDataToggled: [],
                    toggleAllClinicalFiles: !toggleAllClinicalFiles,
                  })}
                  type="checkbox"
                  />
              </Th>,
              <Th key="cart-toggle-all">{t('cart.title')}</Th>,
              ...tableInfo
                .filter(x => !x.subHeading)
                .map(x => (
                  <x.th
                    key={x.id}
                    nodes={hits.edges}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    />
                )),
            ]}
            id="repository-cases-table"
            subheadings={tableInfo
              .filter(x => x.subHeading)
              .map(x => <x.th key={x.id} />)}
            />
        </ScrollableTable>
      </div>
    );
  }
);
