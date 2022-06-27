/* @flow */
import React from 'react';
import get from 'lodash/get';
import reject from 'lodash/reject';
import {
  compose,
  setDisplayName,
  withPropsOnChange,
} from 'recompose';
import PersonIcon from 'react-icons/lib/md/person';
import { withRouter } from 'react-router-dom';

import FilterSearchInput from '@cqdg/components/inputs/FilterSearchInput';
import FilterContainer from 'cqdg-ui/core/containers/filters/FilterContainer';
import withFacetSelection from '@cqdg/utils/withFacetSelection';
import escapeForRelay from '@cqdg/relay/escapeForRelay';
import tryParseJSON from '@cqdg/utils/json/tryParseJSON';
import StackLayout from 'cqdg-ui/core/layouts/StackLayout';
import t from '@cqdg/locales/intl';
import {
  createLinkContext,
  createSearchQuery,
} from '@cqdg/components/Links/linkUtils';
import { mergeQuery as mq } from '@cqdg/utils/filters';

import facets from '@cqdg/pages/FileRepository/CaseAggregations/CaseAggregationsFilters';
import { getFacetType, getFilters, getSelectedFilters } from '@cqdg/pages/FileRepository/filtersUtils';
import translation from '../translation';
import features from '../../../../../features.json';


import '../Aggregations.css';

const presetFacets = facets.map(f => getFacetType(f));
const presetFacetFields = presetFacets.map((x) => x.field);
const entityType = 'Cases';

const onFilterSelectionChange = (push, filterGroup, selectedFilters) => {
  const pn = window.location.pathname;
  const query = selectedFilters.length === 0
                      ? {
                        offset: 0,
                        filters: {
                          op: 'and',
                          content: [
                            {
                              op: 'in',
                              content: {
                                field: filterGroup.field,
                                value: selectedFilters,
                              },
                            },
                          ],
                        },
                      }
                    : {};
  const contextQuery = createLinkContext(query, mq);
  const searchQuery = createSearchQuery(contextQuery);
  push(`${pn}?${searchQuery}`);
};

const enhance = compose(
  setDisplayName('RepoCaseAggregations'),
  withRouter,
  withFacetSelection({
    entityType,
    presetFacetFields,
  }),
  withPropsOnChange(['viewer'], ({ viewer }) => ({
    parsedFacets: viewer.File ? tryParseJSON(viewer.File, {}) : {},
  }))
);

const CaseAggregationsComponent = ({
  handleRequestRemoveFacet,
  parsedFacets,
  push,
  relay,
  userSelectedFacets,
  viewer,
}) => (
  <div className="case-aggregations">
    {userSelectedFacets &&
      userSelectedFacets.map((facet) => (
        <FilterContainer
          filterGroup={facet}
          filters={parsedFacets[facet.field]}
          isRemovable
          key={facet.full}
          onRemoveFilterContainer={() => handleRequestRemoveFacet(facet)}
          relayVarName="repoCaseCustomFacetFields"
          />
      ))}

    {features.searchByCaseId && (
      <FilterSearchInput
        doctype="cases"
        dropdownItem={(x) => (
          <StackLayout>
            <PersonIcon className="aggregations-search-icon" height="1.6em" width="1.6em" />
            <div>
              <div style={{ fontWeight: 'bold' }}>{x.submitter_donor_id}</div>
              <div style={{ fontSize: '80%' }}>
                {get(x, 'files.hits.edges', [])
                  .map((f) => f.node.file_name)
                  .join(', ')}
              </div>
              {get(x, 'study.hits.edges', [])
                .map((s) => s.node.study_id)
                .join(' | ')}
            </div>
          </StackLayout>
        )}
        fieldNoDoctype="submitter_donor_id"
        placeholder={t('facet.search')}
        queryType="case"
        title="Case"
        tooltip={t('facet.search_suggest_tooltip_donors')}
        />
    )}
    {reject(presetFacets, { full: 'donor_id' }).map((facet) => {
      const filters = getFilters(
        viewer.Case.aggregations[escapeForRelay(facet.field)]
      );
      const selectedFilters = getSelectedFilters(filters, facet);
      return (
        <FilterContainer
          dictionary={translation()}
          filterGroup={facet}
          filters={filters}
          key={facet.full}
          onChange={
            (filterGroup, newSelectedFilters) =>
              onFilterSelectionChange(push, filterGroup, newSelectedFilters)
          }
          relay={relay}
          searchEnabled={facet.visualType === 'checkbox' &&
            filters.filter(b => b.key !== '_missing')
              .length >= 10}
          selectedFilters={selectedFilters}
          title={t(facet.title) || t(`facet.${facet.full}`)}
          />
      );
    })}
  </div>
);

export default enhance(CaseAggregationsComponent);
