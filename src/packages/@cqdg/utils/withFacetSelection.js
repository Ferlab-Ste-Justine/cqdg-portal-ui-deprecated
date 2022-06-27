/* @flow */
/* eslint fp/no-this: 0, max-len: 1 */
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  compose,
  setDisplayName,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { add, remove, reset } from '@cqdg/store/dux/customFacets';
import withRouter from '@cqdg/utils/withRouter';
import { removeFilter } from '@cqdg/store/query';
import { parseFilterParam, stringifyJSONParam } from '@cqdg/utils/uri';
import { removeEmptyKeys } from '@cqdg/utils/object';

type TProps = {
  entityType: string;
  presetFacetFields: Array<string>;
  validFacetDocTypes: Array<string>;
  validFacetPrefixes?: Array<string>;
};

export default ({
  entityType,
  presetFacetFields,
  validFacetDocTypes,
  validFacetPrefixes,
}: TProps) => compose(
  setDisplayName('WithFacetSelection'),
  connect((state, props) => ({
    userSelectedFacets: state.customFacets[entityType],
  })),
  withState('shouldShowFacetSelection', 'setShouldShowFacetSelection', false),
  withProps(({ userSelectedFacets }) => ({
    facetExclusionTest: facet => {
      // The list of facets that should be excluded. But for explore case tab, user selected facets have been replaced in clinical tab.
      // So if entityType is 'ExploreCases', ignore the userSelectedFacets.
      const facetFieldNamesToExclude =
        entityType === 'ExploreCases'
          ? presetFacetFields
          : presetFacetFields.concat(userSelectedFacets.map(x => x.field));

      const match = _.some([
        !_.includes(validFacetDocTypes, facet.docType),
        _.includes(facetFieldNamesToExclude, facet.field),
        validFacetPrefixes &&
        !_.includes(validFacetPrefixes.map(p => facet.full.indexOf(p)), 0),
      ]);
      return match;
    },
  })),
  withRouter,
  withHandlers({
    handleSelectFacet: ({
      dispatch,
      setShouldShowFacetSelection,
    }) => facet => {
      setShouldShowFacetSelection(false);
      dispatch(add({
        entityType,
        facet,
      }));
    },
    handleResetFacets: ({ dispatch }) => () => {
      dispatch(reset({ entityType }));
    },
    handleRequestRemoveFacet: ({
      dispatch,
      push,
      query,
    }) => facet => {
      dispatch(remove({
        entityType,
        field: facet.field,
      }));
      const newFilters = removeFilter(
        facet.full,
        parseFilterParam(query.filters),
      );

      return push({
        query: removeEmptyKeys({
          ...query,
          filters: newFilters && stringifyJSONParam(newFilters),
        }),
      });
    },
  }),
);
