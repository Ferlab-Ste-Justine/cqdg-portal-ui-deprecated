// @flow
import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange, withState } from 'recompose';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) => compose(
  withState('facetSearch', 'setFacetSearch', ''),
  withPropsOnChange(
    ['queryType', 'facetSearch'],
    ({ facetSearch, queryType }) => {
      const showCases = queryType === 'case';
      const showFiles = queryType === 'file';
      const wildFacetSearch = `${facetSearch}*`;
      const fields = [];

      if (showCases) {
        fields.push('files.file_name_keyword');
        fields.push('files.file_id');
        fields.push('submitter_donor_id');
      }

      if (showFiles) {
        fields.push('file_name_keyword');
        fields.push('file_id');
        fields.push('cases.submitter_donor_id');
      }

      const content = [];
      fields.forEach(field => {
        content.push(
          {
            op: 'in',
            content: {
              field,
              value: [wildFacetSearch],
            },
          }
        );
      });

      const filters = {
        op: 'or',
        content,
      };

      return {
        variables: {
          filters,
          showCases,
          showFiles,
        },
      };
    },
  ),
)((props: Record<string, any>) => {
  return (
    <Query
      Component={Component}
      parentProps={props}
      query={graphql`
          query FilterSearchInput_relayQuery($filters: JSON!, $showFiles: Boolean!, $showCases: Boolean!){
            facetSearchHits: viewer {  
              files: viewer @include(if: $showFiles) {
                File{
                  hits(filters: $filters, first: 10){
                    edges{
                      node{
                        id
                        file_id
                        file_name
                        cases{
                          hits(first: 10){
                            edges{
                              node{
                                submitter_donor_id
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              cases: viewer @include(if: $showCases) {
                Case{
                  hits(filters: $filters, first: 10){
                    edges{
                      node{
                        id
                        submitter_donor_id
                        study{
                          hits(first: 10){
                            edges{
                              node{
                                study_id
                              }
                            }
                          }
                        }
                        files{
                          hits(first: 10){
                            edges{
                              node{
                                file_id
                                file_name
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `}
      setFacetSearch={props.setFacetSearch}
      variables={props.variables}
      />
  );
});
