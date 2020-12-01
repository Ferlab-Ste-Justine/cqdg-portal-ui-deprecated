/* @flow */
import React from 'react';
import get from 'lodash/get';
import reject from 'lodash/reject';
import {
  compose,
  setDisplayName,
  withPropsOnChange,
  withState,
} from 'recompose';

import Modal from '@ncigdc/uikit/Modal';
import FacetSelection from '@ncigdc/modern_components/FacetSelection';
import FilterSearchInput from '@cqdg/components/inputs/FilterSearchInput';

import FilterContainer from '@ferlab-ui/core/containers/filters/FilterContainer';
import UploadSetButton from '@ncigdc/components/UploadSetButton';
import { withTheme } from '@ncigdc/theme';
import withFacetSelection from '@ncigdc/utils/withFacetSelection';
import escapeForRelay from '@ncigdc/utils/escapeForRelay';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';
import Header from '@ferlab-ui/core/containers/filters/FilterContainerHeader';

import { UploadCaseSet } from '@ncigdc/components/Modals/UploadSet';
import CaseIcon from '@ncigdc/theme/icons/Case';
import StackLayout from '@ferlab-ui/core/layouts/StackLayout';

import t from '@cqdg/locales/intl';
import features from '../../../../../features.json';

const presetFacets = [
  {
    title: t('facet.study.name'),
    field: 'study.short_name_keyword',
    full: 'study.short_name_keyword',
    type: 'keyword',
  },
  /* {
    title: 'Study Id',
    field: 'study.study_id_keyword',
    full: 'study.study_id_keyword',
    type: 'keyword',
  }, */
  {
    title: t('facet.study.domain'),
    field: 'study.domain',
    full: 'study.domain',
    type: 'keyword',
  },
  {
    title: t('facet.gender'),
    field: 'gender',
    full: 'gender',
    type: 'keyword',
  },
  {
    title: t('facet.ethnicity'),
    field: 'ethnicity',
    full: 'ethnicity',
    type: 'keyword',
  },
  {
    title: t('facet.age.at.recruitment'),
    field: 'age_at_recruitment',
    full: 'age_at_recruitment',
    type: 'long',
  },
  {
    title: t('facet.age.at.diagnosis'),
    field: 'diagnoses.age_at_diagnosis',
    full: 'diagnoses.age_at_diagnosis',
    type: 'long',
  },
  {
    title: t('facet.vital.status'),
    field: 'vital_status',
    full: 'vital_status',
    type: 'keyword',
  },
  {
    title: t('facet.icd.category'),
    field: 'diagnoses.icd_category_keyword',
    full: 'diagnoses.icd_category_keyword',
    type: 'keyword',
  },
  {
    title: t('facet.mondo.term'),
    field: 'diagnoses.mondo_term_keyword',
    full: 'diagnoses.mondo_term_keyword',
    type: 'keyword',
  },
  {
    title: t('facet.hpo.category'),
    field: 'phenotypes.hpo_category_keyword',
    full: 'phenotypes.hpo_category_keyword',
    type: 'keyword',
  },
  {
    title: t('facet.hpo.term'),
    field: 'phenotypes.hpo_term_keyword',
    full: 'phenotypes.hpo_term_keyword',
    type: 'keyword',
  },
];

const presetFacetFields = presetFacets.map((x) => x.field);
const entityType = 'Cases';

const enhance = compose(
  setDisplayName('RepoCaseAggregations'),
  withFacetSelection({
    entityType,
    presetFacetFields,
  }),
  withTheme,
  withState('caseIdCollapsed', 'setCaseIdCollapsed', false),
  withPropsOnChange(['viewer'], ({ viewer }) => ({
    parsedFacets: viewer.File ? tryParseJSON(viewer.File, {}) : {},
  }))
);

const styles = {
  link: {
    textDecoration: 'underline',
    color: '#2a72a5',
  },
};

const CaseAggregationsComponent = ({
  caseIdCollapsed,
  facetExclusionTest,
  handleRequestRemoveFacet,
  handleResetFacets,
  handleSelectFacet,
  parsedFacets,
  relay,
  setCaseIdCollapsed,
  setShouldShowFacetSelection,
  shouldShowFacetSelection,
  theme,
  userSelectedFacets,
  viewer,
}) => (
  <div className="case-aggregations">
    {features.caseAggregations && (
      <div
        className="text-right"
        style={{
          padding: '10px 15px',
          borderBottom: `1px solid ${theme.greyScale5}`,
        }}
        >
        {!!userSelectedFacets.length && (
          <span>
            <a onClick={handleResetFacets} style={styles.link}>
              Reset
            </a>
            {' '}
            &nbsp;|&nbsp;
          </span>
        )}
        <a
          onClick={() => setShouldShowFacetSelection(true)}
          style={styles.link}
          >
          Add a Case/Biospecimen Filter
        </a>
      </div>
    )}
    {features.caseAggregations && (
      <Modal
        isOpen={shouldShowFacetSelection}
        style={{
          content: {
            border: 0,
            padding: '15px',
            width: '65%',
          },
        }}
        >
        <FacetSelection
          additionalFacetData={parsedFacets}
          docType="cases"
          excludeFacetsBy={facetExclusionTest}
          isCaseInsensitive
          onRequestClose={() => setShouldShowFacetSelection(false)}
          onSelect={handleSelectFacet}
          title="Add a Case/Biospecimen Filter"
          />
      </Modal>
    )}
    {userSelectedFacets &&
      userSelectedFacets.map((facet) => (
        <FilterContainer
          aggregation={parsedFacets[facet.field]}
          facet={facet}
          isRemovable
          key={facet.full}
          onRequestRemove={() => handleRequestRemoveFacet(facet)}
          relayVarName="repoCaseCustomFacetFields"
          style={{ borderBottom: `1px solid ${theme.greyScale5}` }}
          />
      ))}

    {features.searchByCaseId && (
      <Header
        collapsed={caseIdCollapsed}
        description="Enter UUID or ID of Case, Sample, Portion, Slide, Analyte or Aliquot"
        field="cases.case_id"
        setCollapsed={setCaseIdCollapsed}
        title="Case"
        />
    )}
    {features.searchByCaseId && (
      <FilterSearchInput
        collapsed={caseIdCollapsed}
        doctype="cases"
        dropdownItem={(x) => (
          <StackLayout>
            <CaseIcon
              style={{
                paddingRight: '1rem',
                paddingTop: '1rem',
              }}
              />
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
        tooltip={t('facet.search_suggest_tooltip')}
        />
    )}
    {features.uploadCaseSet && (
      <UploadSetButton
        defaultQuery={{
          pathname: '/repository',
          query: { searchTableTab: 'cases' },
        }}
        idField="cases.case_id"
        style={{
          width: '100%',
          borderBottom: `1px solid ${theme.greyScale5}`,
          padding: '0 1.2rem 1rem',
        }}
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
        title={facet.title}
        />
    ))}
  </div>
);

export default enhance(CaseAggregationsComponent);
