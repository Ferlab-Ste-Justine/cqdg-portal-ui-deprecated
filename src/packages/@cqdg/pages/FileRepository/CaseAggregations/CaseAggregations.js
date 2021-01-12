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

import FilterSearchInput from '@cqdg/components/inputs/FilterSearchInput';
import FilterContainer from 'cqdg-ui/core/containers/filters/FilterContainer';
import withFacetSelection from '@cqdg/utils/withFacetSelection';
import escapeForRelay from '@cqdg/relay/escapeForRelay';
import tryParseJSON from '@cqdg/utils/json/tryParseJSON';
import StackLayout from 'cqdg-ui/core/layouts/StackLayout';
import t from '@cqdg/locales/intl';

import facets from '@cqdg/pages/FileRepository/CaseAggregations/CaseAggregationsFilters';
import { getFacetType } from '@cqdg/pages/FileRepository/filtersUtils';

import features from '../../../../../features.json';

import '../Aggregations.css';

const presetFacets = facets.map(f => getFacetType(f));
const presetFacetFields = presetFacets.map((x) => x.field);
const entityType = 'Cases';

const enhance = compose(
  setDisplayName('RepoCaseAggregations'),
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
  relay,
  userSelectedFacets,
  viewer,
}) => (
  <div className="case-aggregations">
    {userSelectedFacets &&
      userSelectedFacets.map((facet) => (
        <FilterContainer
          facet={facet}
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
      const aggregation = viewer.Case.aggregations[escapeForRelay(facet.field)];
      return (
        <FilterContainer
          facet={facet}
          filters={aggregation && aggregation.buckets}
          key={facet.full}
          relay={relay}
          searchEnabled={facet.visualType === 'terms' &&
            (aggregation || { buckets: [] }).buckets.filter(b => b.key !== '_missing')
              .length >= 10}
          title={t(facet.title) || t(`facet.${facet.field}`)}
          />
      );
    })}
  </div>
);

export default enhance(CaseAggregationsComponent);
