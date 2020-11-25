// @flow
import React from 'react';
import Relay from 'react-relay/classic';
import _ from 'lodash';
import {compose, withState} from 'recompose';

import withSize from '@ncigdc/utils/withSize';
import {IBucket} from '@ncigdc/components/Aggregations/types';
import withRouter from '@ncigdc/utils/withRouter';
import {parseFilterParam} from '@ncigdc/utils/uri';
import {
  PieTitle,
  SelfFilteringBars,
  SelfFilteringPie,
  ShowToggleBox
} from './index';
import t from "../../locales/intl";
import {withTheme} from "../../../@ncigdc/theme";
import Column from "../../../@ncigdc/uikit/Flex/Column";
import Row from "../../../@ncigdc/uikit/Flex/Row";

export type TProps = {
  push: Function,
  query: Object,
  aggregations: {
    study__short_name_keyword: { buckets: [IBucket] },
    gender: { buckets: [IBucket] },
    ethnicity: { buckets: [IBucket] },
    diagnoses__mondo_term_keyword: { buckets: [IBucket] },
    phenotypes__hpo_category_keyword: { buckets: [IBucket] },
  },
  setShowingMore: Function,
  size: { width: number },
  theme: Object
};

const enhance = compose(withRouter,
                        withState('showingMore', 'setShowingMore', false),
                        withSize(),
                        withTheme);

const RepoCasesChartsComponent = ({ aggregations,
                                  query,
                                  push,
                                  theme,
                                  showingMore,
                                  setShowingMore,
                                  size: { width }, }: TProps) => {
  const currentFilters =
    (query && parseFilterParam((query || {}).filters, {}).content) || [];
  const currentFieldNames = currentFilters.map(f => f.content.field);

  //The "-2" is the width taken by the left and right borders
  const pieColMinWidth = (width - 2) / 3;
  const chartColMinWidth = (width - 2) / 2;

  return (
    <div className="repo-charts">
      <Row style={{ maxWidth: `${width}px`, width: '100%' }} className="wrapped-row">
        <Column style={{ minWidth: `${pieColMinWidth}px` }} className="column-center">
          <PieTitle>{t('charts.study')}</PieTitle>
          <SelfFilteringPie
            buckets={_.get(
              aggregations,
              'study__short_name_keyword.buckets'
            )}
            fieldName="study.short_name_keyword"
            docTypeSingular="file"
            currentFieldNames={currentFieldNames}
            currentFilters={currentFilters}
            query={query}
            push={push}
            path="doc_count"
            height={125}
            width={125}
          />
        </Column>
        <Column style={{ minWidth: `${pieColMinWidth}px` }} className="column-center">
          <PieTitle>{t('charts.gender')}</PieTitle>
          <SelfFilteringPie
            buckets={_.get(aggregations, 'gender.buckets')}
            fieldName="gender"
            docTypeSingular="case"
            currentFieldNames={currentFieldNames}
            currentFilters={currentFilters}
            query={query}
            push={push}
            path="doc_count"
            height={125}
            width={125}
          />
        </Column>
        <Column style={{ minWidth: `${pieColMinWidth}px` }} className="column-center">
          <PieTitle>{t('charts.ethnicity')}</PieTitle>
          <SelfFilteringPie
            buckets={_.get(aggregations, 'ethnicity.buckets')}
            fieldName="ethnicity"
            docTypeSingular="case"
            currentFieldNames={currentFieldNames}
            currentFilters={currentFilters}
            query={query}
            push={push}
            path="doc_count"
            height={125}
            width={125}
          />
        </Column>

        {showingMore && [
          <Column style={{ minWidth: `${chartColMinWidth}px` }} className="column-center" key={"disease_type_bar_chart"}>
            <PieTitle>{t('charts.disease_type')}</PieTitle>
            <SelfFilteringBars
              buckets={_.get(
                aggregations,
                'diagnoses__mondo_term_keyword.buckets'
              )}
              fieldName="diagnoses.mondo_term_keyword"
              docTypeSingular="case"
              currentFieldNames={currentFieldNames}
              currentFilters={currentFilters}
              query={query}
              push={push}
              height={250}
              margin={{
                top: 20,
                right: 200,
                bottom: 30,
                left: 250,
              }}
              textFormatter={(id) => id && id.indexOf(':') ? id.substr(id.indexOf(':')+1, id.length) : id}
            />
          </Column>,
          <Column style={{ minWidth: `${chartColMinWidth}px` }} className="column-center" key={"phenotype_category_bar_chart"}>
            <PieTitle>{t('charts.phenotype_category')}</PieTitle>
            <SelfFilteringBars
              buckets={_.get(
                aggregations,
                'phenotypes__hpo_category_keyword.buckets'
              )}
              fieldName="phenotypes.hpo_category_keyword"
              docTypeSingular="case"
              currentFieldNames={currentFieldNames}
              currentFilters={currentFilters}
              query={query}
              push={push}
              height={250}
              margin={{
                top: 20,
                right: 200,
                bottom: 30,
                left: 250,
              }}
            />
          </Column>
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
