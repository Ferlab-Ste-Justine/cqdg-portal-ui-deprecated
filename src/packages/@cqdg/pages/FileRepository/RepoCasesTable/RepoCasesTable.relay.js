/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
/* @flow */

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { withRouter } from 'react-router-dom';
import { parse } from 'query-string';
import {
  parseIntParam,
  parseFilterParam,
  parseJSONParam,
} from '@ncigdc/utils/uri';
import Query from '@ncigdc/modern_components/Query';
import { repoPageFileToCaseFiltersMapping } from '@cqdg/pages/FileRepository/FilterMapping';
import { mapFilter } from '@ncigdc/utils/filters';

export default (Component: React.Class<*>) =>
  compose(
    withRouter,
    withPropsOnChange(
      ['location', 'defaultFilters'],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // eslint-disable-next-line no-unused-vars
      ({ defaultSize = 10, filters = null, location }) => {
        const q = parse(location.search);

        return {
          variables: {
            cases_offset: parseIntParam(q.cases_offset, 0),
            cases_size: parseIntParam(q.cases_size, 20),
            cases_sort: parseJSONParam(q.cases_sort, null),
            filters: parseFilterParam(q.filters, filters),
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
        minHeight={387}
        name="RepoCasesTable"
        parentProps={props}
        query={graphql`
          query RepoCasesTable_relayQuery(
            $cases_size: Int
            $cases_offset: Int
            $cases_sort: [Sort]
            $filters: JSON
          ) {
              viewer{
                Case{
                  hits(
                      first: $cases_size
                      offset: $cases_offset
                      sort: $cases_sort
                      filters: $filters
                    ){
                    total
                    edges{
                      node{
                        id
                        submitter_donor_id
                        gender
                        ethnicity
                        vital_status
                        age_at_recruitment
                        study{
                          hits(first: 1){
                            edges{
                              node{
                                study_id
                                short_name_keyword
                                domain
                                population
                              }
                            }
                          }
                        }
                        
                        diagnoses{
                          hits(first: 99){
                            total
                            edges{
                              node{
                                age_at_diagnosis
                                icd_category_keyword
                                icd_term
                              }
                            }
                          }
                        }
                        
                        phenotypes{
                          hits(first: 99){
                            total
                            edges{
                              node{
                                hpo_term
                              }
                            }
                          }
                        }
                        
                        files{
                          hits(first: 99){
                            total
                            edges{
                              node{
                                file_id
                                file_name
                                file_name_keyword
                                file_size
                                data_access
                                data_category
                                file_format
                                data_type
                                experimental_strategy
                                platform
                                is_harmonized
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
        variables={props.variables}
        />
    );
  });
