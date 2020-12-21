// @flow

import React from 'react';
import { graphql } from 'react-relay';
import {
  compose, withPropsOnChange, branch, renderComponent,
} from 'recompose';
import { BaseQuery } from '@cqdg/relay/Query';
import { makeFilter } from '@cqdg/utils/filters';

export default (Component: ReactClass<*>) =>
  compose(
    branch(
      ({ geneId }) => !geneId,
      renderComponent(() => (
        <div>
          <pre>geneId</pre>
          {' '}
must be provided
        </div>
      )),
    ),
    withPropsOnChange(['geneId'], ({ geneId }) => {
      return {
        variables: {
          filters: makeFilter([
            {
              field: 'genes.gene_id',
              value: [geneId],
            },
          ]),
        },
      };
    }),
  )((props: Record<string, any>) => {
    return (
      <BaseQuery
        Component={Component}
        parentProps={props}
        query={graphql`
          query GeneSymbol_relayQuery($filters: JSON) {
            viewer {
              explore {
                genes {
                  hits(filters: $filters, first: 1) {
                    edges {
                      node {
                        symbol
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
