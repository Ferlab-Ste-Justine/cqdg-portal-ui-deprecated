/* @flow */
import React from 'react';
import get from 'lodash/get';
import reject from 'lodash/reject';
import {
  compose,
  setDisplayName,
  withPropsOnChange,
} from 'recompose';

import FilterSearchInput from '@cqdg/components/inputs/FilterSearchInput';

import FilterContainer from 'cqdg-ui/core/containers/filters/FilterContainer';
import UploadSetButton from '@ncigdc/components/UploadSetButton';
import withFacetSelection from '@cqdg/utils/withFacetSelection';
import escapeForRelay from '@cqdg/relay/escapeForRelay';
import tryParseJSON from '@cqdg/utils/json/tryParseJSON';

import { UploadCaseSet } from '@ncigdc/components/Modals/UploadSet';
import PersonIcon from 'react-icons/lib/md/person';
import StackLayout from 'cqdg-ui/core/layouts/StackLayout';

import t from '@cqdg/locales/intl';
import presetFacets from '@cqdg/pages/FileRepository/CaseAggregations/CaseAggregationsFilters';
import features from '../../../../../features.json';

import '../Aggregations.css';

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
          aggregation={parsedFacets[facet.field]}
          facet={facet}
          isRemovable
          key={facet.full}
          onRequestRemove={() => handleRequestRemoveFacet(facet)}
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
    {features.uploadCaseSet && (
      <UploadSetButton
        defaultQuery={{
          pathname: '/repository',
          query: { searchTableTab: 'cases' },
        }}
        idField="cases.case_id"
        type="case"
        UploadModal={UploadCaseSet}
        >
        Upload Case Set
      </UploadSetButton>
    )}
    {reject(presetFacets, { full: 'donor_id' }).map((facet) => (
      <FilterContainer
        additionalProps={facet.additionalProps}
        aggregation={viewer.Case.aggregations[escapeForRelay(facet.field)]}
        facet={facet}
        key={facet.full}
        relay={relay}
        title={t(facet.title) || t(`facet.${facet.field}`)}
        />

    ))}
  </div>
);

export default enhance(CaseAggregationsComponent);
