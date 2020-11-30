// @flow
import React from 'react';
import Relay from 'react-relay/classic';
import _ from 'lodash';
import { compose, withState } from 'recompose';

import withSize from '@ncigdc/utils/withSize';
import { IBucket } from '@ncigdc/components/Aggregations/types';
import withRouter from '@ncigdc/utils/withRouter';
import { parseFilterParam } from '@ncigdc/utils/uri';
import { withTheme } from '@ncigdc/theme';
import Column from '@ncigdc/uikit/Flex/Column';
import Row from '@ncigdc/uikit/Flex/Row';
import t from '@cqdg/locales/intl';
import {
  PieTitle,
  SelfFilteringBars,
  SelfFilteringPie,
  ShowToggleBox,
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
  theme: Record<string, any>;
};

const enhance = compose(withRouter,
                        withState('showingMore', 'setShowingMore', false),
                        withSize(),
                        withTheme);

const RepoCasesChartsComponent = ({
  aggregations,
  push,
  query,
  setShowingMore,
  showingMore,
  size: { width },
  theme,
}: TProps) => {
  const currentFilters =
    (query && parseFilterParam((query || {}).filters, {}).content) || [];
  const currentFieldNames = currentFilters.map(f => f.content.field);

  // The "-2" is the width taken by the left and right borders
  const pieColMinWidth = (width - 2) / 3;
  const chartColMinWidth = (width - 2) / 2;

  return (
    <div className="repo-charts">
      <Row
        className="wrapped-row"
        style={{
          maxWidth: `${width}px`,
          width: '100%',
        }}
        >
        <Column className="column-center" style={{ minWidth: `${pieColMinWidth}px` }}>
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
        </Column>
        <Column className="column-center" style={{ minWidth: `${pieColMinWidth}px` }}>
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
        </Column>
        <Column className="column-center" style={{ minWidth: `${pieColMinWidth}px` }}>
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
        </Column>

        {showingMore && [
          <Column className="column-center" key="disease_type_bar_chart" style={{ minWidth: `${chartColMinWidth}px` }}>
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
          </Column>,
          <Column className="column-center" key="phenotype_category_bar_chart" style={{ minWidth: `${chartColMinWidth}px` }}>
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
          </Column>,
        ]}
      </Row>
      <Row className="row-center">
        <ShowToggleBox onClick={() => setShowingMore(!showingMore)}>
          {showingMore ? t('global.less') : t('global.more')}
        </ShowToggleBox>
      </Row>
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
