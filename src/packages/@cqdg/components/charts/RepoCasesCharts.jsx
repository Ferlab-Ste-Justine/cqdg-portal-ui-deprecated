// @flow
import React from 'react';
import Relay from 'react-relay/classic';
import _ from 'lodash';
import { compose, withState } from 'recompose';

import PlusSign from 'react-icons/lib/go/plus';
import MinusSign from 'react-icons/lib/go/dash';

import { IBucket } from '@ncigdc/components/Aggregations/types';
import withRouter from '@cqdg/utils/withRouter';
import { parseFilterParam } from '@cqdg/utils/uri';

import StackLayout from 'cqdg-ui/core/layouts/StackLayout';
import t from '@cqdg/locales/intl';
import PieTitle from './PieTitle';
import ShowToggleBox from './ShowToggleBox';
import {
  SelfFilteringBars,
  SelfFilteringPie,
} from './index';

export type TProps = {
  push: Function;
  query: Record<string, any>;
  aggregations: {
    study__short_name_keyword: { buckets: [IBucket] };
    gender: { buckets: [IBucket] };
    ethnicity: { buckets: [IBucket] };
    diagnoses__mondo_term_keyword: { buckets: [IBucket] };
    phenotypes__hpo_category_keyword: { buckets: [IBucket] };
  };
  setShowingMore: Function;
  size: { width: number };
};

const enhance = compose(withRouter,
                        withState('showingMore', 'setShowingMore', false),);

const RepoCasesChartsComponent = ({
  aggregations,
  push,
  query,
  setShowingMore,
  showingMore,
}: TProps) => {
  const currentFilters =
    (query && parseFilterParam((query || {}).filters, {}).content) || [];
  const currentFieldNames = currentFilters.map(f => f.content.field);

  return (
    <div className="repo-charts">
      <div className="wrapped-grid">
        <div className="grid-pie-charts">
          <StackLayout className="column-center" vertical>
            <PieTitle>{t('charts.study')}</PieTitle>
            <SelfFilteringPie
              buckets={_.get(
                aggregations,
                'study__short_name_keyword.buckets'
              )}
              currentFieldNames={currentFieldNames}
              currentFilters={currentFilters}
              docTypeSingular="file"
              fieldName="study.short_name_keyword"
              height={125}
              path="doc_count"
              push={push}
              query={query}
              width={125}
              />
          </StackLayout>
          <StackLayout className="column-center" vertical>
            <PieTitle>{t('charts.gender')}</PieTitle>
            <SelfFilteringPie
              buckets={_.get(aggregations, 'gender.buckets')}
              currentFieldNames={currentFieldNames}
              currentFilters={currentFilters}
              docTypeSingular="case"
              fieldName="gender"
              height={125}
              path="doc_count"
              push={push}
              query={query}
              width={125}
              />
          </StackLayout>
          <StackLayout className="column-center" vertical>
            <PieTitle>{t('charts.ethnicity')}</PieTitle>
            <SelfFilteringPie
              buckets={_.get(aggregations, 'ethnicity.buckets')}
              currentFieldNames={currentFieldNames}
              currentFilters={currentFilters}
              docTypeSingular="case"
              fieldName="ethnicity"
              height={125}
              path="doc_count"
              push={push}
              query={query}
              width={125}
              />
          </StackLayout>
        </div>
        {showingMore && (
          <div className="grid-bar-charts">
            <StackLayout className="column-center" key="disease_type_bar_chart" vertical>
              <PieTitle>{t('charts.disease_type')}</PieTitle>
              <SelfFilteringBars
                buckets={_.get(
                  aggregations,
                  'diagnoses__mondo_term_keyword.buckets'
                )}
                currentFieldNames={currentFieldNames}
                currentFilters={currentFilters}
                docTypeSingular="case"
                fieldName="diagnoses.mondo_term_keyword"
                height={250}
                margin={{
                  top: 20,
                  right: 200,
                  bottom: 30,
                  left: 250,
                }}
                push={push}
                query={query}
                textFormatter={(id) => (id && id.indexOf(':') ? id.substr(id.indexOf(':') + 1, id.length) : id)}
                />
            </StackLayout>
            <StackLayout className="column-center" key="phenotype_category_bar_chart" vertical>
              <PieTitle>{t('charts.phenotype_category')}</PieTitle>
              <SelfFilteringBars
                buckets={_.get(
                  aggregations,
                  'phenotypes__hpo_category_keyword.buckets'
                )}
                currentFieldNames={currentFieldNames}
                currentFilters={currentFilters}
                docTypeSingular="case"
                fieldName="phenotypes.hpo_category_keyword"
                height={250}
                margin={{
                  top: 20,
                  right: 200,
                  bottom: 30,
                  left: 250,
                }}
                push={push}
                query={query}
                />
            </StackLayout>
          </div>
        )}
      </div>
      <StackLayout className="row-center">
        <ShowToggleBox className="show-toggle" onClick={() => setShowingMore(!showingMore)}>
          <span className="show-more">{t('global.show')}</span>
          {showingMore ? <MinusSign className="show-more-sign" /> : <PlusSign className="show-more-sign" />}
        </ShowToggleBox>
      </StackLayout>
    </div>
  );
};

export const RepoCasesChartsQuery = {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on CaseAggregations {
        study__short_name_keyword {
            buckets {
                doc_count
                key
            }
        }
        gender{
            buckets {
                doc_count
                key
            }
        }
        ethnicity{
            buckets {
                doc_count
                key
            }
        }
        diagnoses__mondo_term_keyword{
            buckets {
                doc_count
                key
            }
        }
        phenotypes__hpo_category_keyword{
            buckets {
                doc_count
                key
            }
        }
      }
    `,
  },
};


const RepoCasesCharts = Relay.createContainer(
  enhance(RepoCasesChartsComponent),
  RepoCasesChartsQuery,
);

export default RepoCasesCharts;
