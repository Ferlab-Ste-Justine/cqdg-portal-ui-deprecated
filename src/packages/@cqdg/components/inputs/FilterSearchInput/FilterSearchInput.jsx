/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */

// Vendor
import React, { Fragment } from 'react';
import get from 'lodash/get';
import trim from 'lodash/trim';
import {
  compose,
  pure,
  withState,
  withHandlers,
  renameProp,
  withPropsOnChange,
} from 'recompose';

import fetchFileHistory from '@ncigdc/utils/fetchFileHistory';
// Custom
import { getFilterValue } from '@cqdg/utils/filters';
import withDropdown from '@cqdg/components/dropdown/withDropdown';
import Link from '@cqdg/components/Links/Link';
import withSelectableList from '@cqdg/utils/withSelectableList';
import namespace from '@ncigdc/utils/namespace';
import GeneSymbol from '@ncigdc/modern_components/GeneSymbol';
import SetId from '@ncigdc/components/SetId';
import { isUUID } from '@ncigdc/utils/string';

// Icons
import CheckCircleOIcon from 'react-icons/lib/fa/check';
import FileIcon from 'react-icons/lib/fa/file';

import {
  getCurrentFilters,
} from '@cqdg/store/query';

import StackLayout from 'cqdg-ui/core/layouts/StackLayout';
import SearchInput from 'cqdg-ui/core/input/Search';
import './FilterSearchInput.css';

const extractNodes = (obj) => {
  const nodes = [];
  if (obj) {
    Object.keys(obj).forEach((key) => {
      if (key === 'node') {
        nodes.push(obj[key]);
      } else {
        nodes.push(...extractNodes(obj[key]));
      }
    });
  }
  return nodes;
};

const extractResults = (obj) => {
  const list = get(obj, 'results');
  const nodes = extractNodes(list);

  return nodes || 'results';
};


const FilterSearchInput = compose(
  withDropdown,
  withState('inputValue', 'setInputValue', ''),
  withState('historyResults', 'setHistoryResults', []),
  withPropsOnChange(
    ['facetSearchHits'],
    async ({
      facetSearch, facetSearchHits, queryType, setHistoryResults,
    }) => {
      if (
        facetSearch &&
        queryType === 'file' &&
        !facetSearchHits.files.length &&
        isUUID(facetSearch)
      ) {
        const history = await fetchFileHistory(trim(facetSearch));
        await setHistoryResults(history);
        return null;
      }
      return facetSearchHits;
    },
  ),
  renameProp('facetSearchHits', 'results'),
  withHandlers({
    // TODO: use router push
    handleSelectItem: () => item => {
      document.querySelector(`[data-link-id="${item.id}"]`).click();
    },
  }),
  namespace(
    'selectableList',
    withSelectableList(
      {
        keyHandlerName: 'handleKeyEvent',
        listSourcePropPath: extractResults,
      },
      {
        onSelectItem: (item, { handleSelectItem }) => handleSelectItem(item),
      },
    ),
  ),
  pure,
)(
  ({
    active,
    collapsed,
    doctype,
    dropdownItem,
    facetSearch,
    fieldNoDoctype,
    historyResults,
    inputValue,
    loading,
    placeholder,
    results,
    selectableList,
    setActive,
    setFacetSearch,
    setInputValue,
    tooltip,
  }) => {
    const query = v => ({
      offset: 0,
      filters: {
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: `${doctype}.${fieldNoDoctype}`,
              value: [v],
            },
          },
        ],
      },
    });

    const getCheckedValue = v => {
      if (v.includes('set_id:')) {
        return <SetId set={v} />;
      }
      if (fieldNoDoctype === 'gene_id') {
        return <GeneSymbol geneId={v} />;
      }
      return v;
    };
    const currentFilters = getCurrentFilters({ content: [] }).content;
    const currentValues = getFilterValue({
      currentFilters,
      dotField: `${doctype}.${fieldNoDoctype}`,
    }) || { content: { value: [] } };

    return (
      <StackLayout className="filter-search-input" vertical>
        {!collapsed && (
          <Fragment>
            {[].concat(currentValues.content.value || []).map(v => (
              // added search items
              <Link
                className="filter-search-selected-item"
                key={v}
                merge="toggle"
                query={{
                  offset: 0,
                  filters: {
                    op: 'and',
                    content: [
                      {
                        op: 'in',
                        content: {
                          field: `${doctype}.${fieldNoDoctype}`,
                          value: [v],
                        },
                      },
                    ],
                  },
                }}
                title={v}
                >
                <CheckCircleOIcon style={{ paddingRight: '0.5rem' }} />
                {getCheckedValue(v)}
              </Link>
            ))}
            <Fragment>
              <SearchInput
                aria-activedescendant={
                  active
                    ? get(
                      selectableList,
                        `focusedItem.${fieldNoDoctype}`,
                    )
                    : null // false gets stringify, so value needs to be `null` or `undefined`
                }
                autoComplete="off"
                id={fieldNoDoctype}
                name={fieldNoDoctype}
                onChange={e => {
                  const { value } = e.target;
                  setInputValue(value);
                  setActive(!!value);
                  if (value) {
                    setFacetSearch(value);
                  }
                }}
                onKeyDown={selectableList.handleKeyEvent}
                placeholder={placeholder}
                position="topRight"
                tooltip={tooltip}
                value={inputValue}
                {...active && {
                  'aria-owns': `${fieldNoDoctype}-options`,
                }}
                />
              {active && (
                <StackLayout
                  className="filter-search-dropdown"
                  id={`${fieldNoDoctype}-options`}
                  onClick={e => e.stopPropagation()}
                  vertical
                  >
                  {
                    get(results, `[${doctype}][${Object.keys(results[doctype])[0]}].hits.edges`, []).map(x => (
                      <StackLayout
                        key={x.node.id}
                        onClick={() => {
                          setInputValue('');
                          setActive(false);
                        }}
                        onMouseOver={() => selectableList.setFocusedItem(x.node)}
                        style={{ alignItems: 'center' }}
                        vertical
                        >
                        <Link
                          className="filter-search-results-list"
                          data-link-id={x.node.id}
                          id={x.node[fieldNoDoctype]}
                          linkIsActive={selectableList.focusedItem === x.node}
                          merge="add"
                          query={query(x.node[fieldNoDoctype])}
                          >
                          {dropdownItem(x.node)}
                        </Link>
                      </StackLayout>
                    ))
                  }
                  {!(results[doctype] || []).length &&
                    !!(historyResults || []).length &&
                    historyResults
                      .filter(result => result.file_change === 'released')
                      .map((result) => (
                        <StackLayout
                          key={result.uuid}
                          onClick={() => {
                            setInputValue('');
                            setActive(false);
                          }}
                          onMouseOver={() =>
                            selectableList.setFocusedItem(result)}
                          style={{ alignItems: 'center' }}
                          vertical
                          >
                          <Link
                            className="filter-search-results-list"
                            data-link-id={result.uuid}
                            id={result.uuid}
                            linkIsActive={
                              selectableList.focusedItem === result
                            }
                            merge="add"
                            query={query(result.uuid)}
                            >
                            <FileIcon
                              style={{
                                paddingRight: '1rem',
                                paddingTop: '1rem',
                              }}
                              />
                            {result.uuid}
                            <br />
                            File version
                            {' '}
                            {' '}
                            <span style={{ fontWeight: 'bold' }}>
                              {facetSearch}
                            </span>
                            {' '}
                            was updated
                          </Link>
                        </StackLayout>
                      ))}
                  {(!!results && get(results, doctype, [])).length === 0 &&
                    historyResults.length === 0 && (
                      <div>
                        {loading ? 'Loading' : 'No matching items found'}
                      </div>
                  )}
                </StackLayout>
              )}
            </Fragment>
          </Fragment>
        )}
      </StackLayout>
    );
  },
);

export default FilterSearchInput;
