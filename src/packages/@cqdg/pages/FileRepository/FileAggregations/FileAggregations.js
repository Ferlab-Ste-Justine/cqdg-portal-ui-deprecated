/* @flow */
/* eslint jsx-a11y/no-static-element-interactions: 0, max-len: 1 */

import React from 'react';
import reject from 'lodash/reject';

import {
  compose,
  setDisplayName,
  withPropsOnChange,
} from 'recompose';

import FilterSearchInput from '@cqdg/components/inputs/FilterSearchInput';
import FilterContainer
  from 'cqdg-ui/core/containers/filters/FilterContainer';

import withFacetSelection from '@cqdg/utils/withFacetSelection';
import escapeForRelay from '@cqdg/relay/escapeForRelay';
import tryParseJSON from '@cqdg/utils/json/tryParseJSON';

import DriveFileIcon from 'react-icons/lib/md/insert-drive-file';
import t from '@cqdg/locales/intl';
import StackLayout from 'cqdg-ui/core/layouts/StackLayout';

import facets
  from '@cqdg/pages/FileRepository/FileAggregations/FileAggregationsFilters';
import { getFacetType } from '@cqdg/pages/FileRepository/filtersUtils';
import features from '../../../../../features.json';

import '../Aggregations.css';

const presetFacets = facets.map(f => getFacetType(f));
const presetFacetFields = presetFacets.map(x => x.field);
const entityType = 'Files';

const enhance = compose(
  setDisplayName('RepoFileAggregations'),
  withFacetSelection({
    entityType,
    presetFacetFields,
    validFacetDocTypes: ['files'],
  }),
  withPropsOnChange(['viewer'], ({ viewer }) => ({
    parsedFacets: viewer.File.facets
      ? tryParseJSON(viewer.File.facets, {})
        : {},
  }))
);

const FileAggregations = ({
  handleRequestRemoveFacet,
  parsedFacets,
  relay,
  userSelectedFacets,
  viewer: { File: { aggregations } },
}) => {
  return (
    <div className="file-aggregations">
      {userSelectedFacets.map(facet => {
        const aggregation = parsedFacets[facet.field];
        return (
          <FilterContainer
            facet={facet}
            filters={aggregation && aggregation.buckets}
            isRemovable
            key={facet.full}
            onRemoveFilterContainer={() => handleRequestRemoveFacet(facet)}
            relayVarName="repoFileCustomFacetFields"
            searchEnabled={facet.type === 'terms' &&
              (aggregation || { buckets: [] }).buckets.filter(b => b.key !== '_missing')
                .length >= 10}
            />
        );
      })}
      {features.filesearch && (
        <FilterSearchInput
          doctype="files"
          dropdownItem={(x) => (
            <StackLayout>
              <DriveFileIcon
                className="aggregations-search-icon"
                height="1.6em"
                width="1.6em"
                />
              <div className="aggregations-search-container">
                <div className="aggregations-search-id">{x.file_id}</div>
                <div className="aggregations-search-donor">{x.submitter_donor_id}</div>
                {x.file_name}
              </div>
            </StackLayout>
          )}
          fieldNoDoctype="file_id"
          placeholder={t('facet.search')}
          queryType="file"
          title="File"
          tooltip={t('facet.search_suggest_tooltip_files')}
          />
      )}
      {reject(presetFacets, { full: 'file_id' }).map(facet => {
        const aggregation = aggregations[escapeForRelay(facet.field)];
        return (
          <FilterContainer
            facet={facet}
            filters={aggregation && aggregation.buckets}
            key={facet.full}
            relay={relay}
            searchEnabled={facet.type === 'terms' &&
            (aggregation || { buckets: [] }).buckets.filter(b => b.key !== '_missing')
              .length >= 10}
            title={t(facet.title) || t(`facet.${facet.field}`)}
            />
        );
      })}
    </div>
  );
};

export default enhance(FileAggregations);
