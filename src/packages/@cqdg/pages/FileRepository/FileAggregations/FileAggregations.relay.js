// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { connect } from 'react-redux';
import Query from '@ncigdc/modern_components/Query';
import { parseFilterParam } from '@cqdg/utils/uri';
import withRouter from '@cqdg/utils/withRouter';
import { parse } from 'query-string';
import { mapFilter } from '@cqdg/utils/filters';
import { repoPageCaseToFileFiltersMapping } from '@cqdg/pages/FileRepository/FilterMapping';

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
            repoFileCustomFacetFields: userSelectedFacets
              .map(({ field }) => field)
              .join(','),
          },
        };
      },
    ),
  )((props) => {
    if (props && props.variables && props.variables.filters) {
      mapFilter(props.variables.filters, repoPageCaseToFileFiltersMapping);
    }

    return (
      <Query
        Component={Component}
        parentProps={props}
        query={graphql`
          query FileAggregations_relayQuery(
            $filters: JSON
          ) {
            viewer {
                File {
                  aggregations(
                    filters: $filters
                    aggregations_filter_themselves: false
                  ) {
                    data_category {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    data_type {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    is_harmonized{
                      buckets{
                        doc_count
                        key
                        key_as_string
                      }
                    }   
                    experimental_strategy {
                      buckets {
                        doc_count
                        key
                      }
                    }             
                    file_format {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    data_access {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    platform {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    file_variant_class{
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
