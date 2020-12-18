// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { connect } from 'react-redux';
import { parse } from 'query-string';
import Query from '@cqdg/relay/Query';
import { parseFilterParam } from '@cqdg/utils/uri';
import withRouter from '@cqdg/utils/withRouter';
import { repoPageFileToCaseFiltersMapping } from '@cqdg/pages/FileRepository/FilterMapping';
import { mapFilter } from '@cqdg/utils/filters';

const entityType = 'Files';
export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(
      ['location'],
      ({ defaultFilters = null, location: { search } }) => {
        const q = parse(search);
        const filters = parseFilterParam(q.filters, defaultFilters);
        return {
          filters,
        };
      },
    ),
    connect((state) => ({
      userSelectedFacets: state.customFacets[entityType],
    })),
    withPropsOnChange(
      ['userSelectedFacets', 'filters'],
      ({ filters, userSelectedFacets }) => {
        return {
          variables: {
            filters,
            repoCaseCustomFacetFields: userSelectedFacets
              .map(({ field }) => field)
              .join(','),
          },
        };
      },
    ),
  )((props) => {
    if (props && props.variables && props.variables.filters) {
      mapFilter(props.variables.filters, repoPageFileToCaseFiltersMapping);
    }

    return (
      <Query
        Component={Component}
        minHeight={578}
        parentProps={props}
        query={graphql`
          query CaseAggregations_relayQuery(
            $filters: JSON
          ) {
            viewer {
              Case { 
                  aggregations(
                    filters: $filters
                    aggregations_filter_themselves: false
                  ) {
                    study__short_name_keyword{
                      buckets{
                        doc_count
                        key
                      }
                    }
                    study__study_id_keyword{
                      buckets{
                        doc_count
                        key
                      }
                    }
                    study__domain{
                      buckets{
                        doc_count
                        key
                      }
                    }
                    gender{
                      buckets{
                        doc_count
                        key
                      }
                    }
                    ethnicity{
                      buckets{
                        doc_count
                        key
                      }
                    }
                    vital_status{
                      buckets{
                        doc_count
                        key
                      }
                    }
                    diagnoses__icd_category_keyword{
                      buckets{
                        doc_count
                        key
                      }
                    }
                    phenotypes__hpo_category_keyword{
                      buckets{
                        doc_count
                        key
                      }
                    }
                    phenotypes__hpo_term_keyword{
                      buckets{
                        doc_count
                        key
                      }
                    }
                    diagnoses__mondo_term_keyword{
                      buckets{
                        doc_count
                        key
                      }
                    }
                  }
                }
              }
          }
        `}
        variables={props.variables}
        />
    );
  });
