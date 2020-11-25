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
  BottomBorderedBox,
  ColumnCenter,
  PieTitle,
  RowCenter,
  SelfFilteringBars,
  SelfFilteringPie,
  ShowToggleBox,
  WrappedRow
} from './index';
import t from "../../locales/intl";
import {withTheme} from "../../../@ncigdc/theme";

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

const RepoCasesPiesComponent = ({ aggregations,
                                  query,
                                  push,
                                  theme,
                                  showingMore,
                                  setShowingMore,
                                  size: { width }, }: TProps) => {
  const currentFilters =
    (query && parseFilterParam((query || {}).filters, {}).content) || [];
  const currentFieldNames = currentFilters.map(f => f.content.field);
  const pieColMinWidth = width / 3;
  const chartColMinWidth = width / 2;

  return (
    <div className="test-repo-cases-pies">
      <BottomBorderedBox>
        <WrappedRow style={{ maxWidth: `${width}px`, width: '100%' }}>
          <ColumnCenter style={{ minWidth: `${pieColMinWidth}px` }} className="test-primary-site-pie">
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
          </ColumnCenter>
          <ColumnCenter style={{ minWidth: `${pieColMinWidth}px` }} className="test-project-pie">
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
          </ColumnCenter>
          <ColumnCenter style={{ minWidth: `${pieColMinWidth}px` }} className="test-disease-type-pie">
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
          </ColumnCenter>

          {showingMore && [
            <ColumnCenter style={{ minWidth: `${chartColMinWidth}px` }} className="test-gender-pie" key={"disease_type_bar_chart"}>
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
                  bottom: 65,
                  left: 250,
                }}
                textFormatter={(id) => id && id.indexOf(':') ? id.substr(id.indexOf(':')+1, id.length) : id}
              />
            </ColumnCenter>,
            <ColumnCenter style={{ minWidth: `${chartColMinWidth}px` }} className="test-vital-status-pie" key={"phenotype_category_bar_chart"}>
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
                  bottom: 65,
                  left: 250,
                }}
              />
            </ColumnCenter>
          ]}
        </WrappedRow>
      </BottomBorderedBox>
      <RowCenter style={{ marginTop: '-1.5rem' }}>
        <ShowToggleBox onClick={() => setShowingMore(!showingMore)}>
          {t('global.show')} {showingMore ? t('global.less') : t('global.more')}
        </ShowToggleBox>
      </RowCenter>
    </div>
  );
};

export const RepoCasesPiesQuery = {
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



const RepoCasesPies = Relay.createContainer(
  enhance(RepoCasesPiesComponent),
  RepoCasesPiesQuery,
);

export default RepoCasesPies;
