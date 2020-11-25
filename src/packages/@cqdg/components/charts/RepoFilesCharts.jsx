// @flow
import React from 'react';
import Relay from 'react-relay/classic';
import _ from 'lodash';
import { compose, withState } from 'recompose';
import t from '@cqdg/locales/intl';
import withSize from '@ncigdc/utils/withSize';
import { IBucket } from '@ncigdc/components/Aggregations/types';
import withRouter from '@ncigdc/utils/withRouter';
import { parseFilterParam } from '@ncigdc/utils/uri';
import {
  ColumnCenter,
  WrappedRow,
  BottomBorderedBox,
  PieTitle,
  SelfFilteringPie,
} from './index';

export type TProps = {
  push: Function,
  query: Object,
  aggregations: {
    data_category: { buckets: [IBucket] },
    data_type: { buckets: [IBucket] },
    study__short_name_keyword: { buckets: [IBucket] },
    file_format: { buckets: [IBucket] },
  },
  setShowingMore: Function,
  showingMore: boolean,
  size: { width: number },
};

const enhance = compose(
  withRouter,
  withState('showingMore', 'setShowingMore', false),
  withSize(),
);

const RepoFilesChartsComponent = ({
  aggregations,
  query,
  push,
  size: { width },
}: TProps) => {
  const currentFilters =
    (query && parseFilterParam((query || {}).filters, {}).content) || [];
  const currentFieldNames = currentFilters.map(f => f.content.field);
  const pieColMinWidth = (width - 2) / 4;
  return (
    <div className="repo-charts">
      <WrappedRow style={{maxWidth: `${width}px`, width: '100%'}}>
        <ColumnCenter
          style={{ minWidth: `${pieColMinWidth}px` }}
          className="test-primary-site-pie"
        >
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
        <ColumnCenter
          style={{ minWidth: `${pieColMinWidth}px` }}
          className="test-data-category-pie"
        >
          <PieTitle>{t('charts.data_category')}</PieTitle>
          <SelfFilteringPie
            buckets={_.get(aggregations, 'data_category.buckets')}
            fieldName="data_category"
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
        <ColumnCenter
          style={{ minWidth: `${pieColMinWidth}px` }}
          className="test-data-type"
        >
          <PieTitle>{t('charts.data_type')}</PieTitle>
          <SelfFilteringPie
            buckets={_.get(aggregations, 'data_type.buckets')}
            fieldName="data_type"
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
        <ColumnCenter
          style={{ minWidth: `${pieColMinWidth}px` }}
          className="test-file-format"
        >
          <PieTitle>{t('charts.file_format')}</PieTitle>
          <SelfFilteringPie
            buckets={_.get(aggregations, 'file_format.buckets')}
            fieldName="file_format"
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
      </WrappedRow>
    </div>
  );
};

export const RepoFilesChartsQuery = {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on FileAggregations {
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
        study__short_name_keyword {
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
      }
    `,
  },
};

const RepoFilesCharts = Relay.createContainer(
  enhance(RepoFilesChartsComponent),
  RepoFilesChartsQuery,
);

export default RepoFilesCharts;
