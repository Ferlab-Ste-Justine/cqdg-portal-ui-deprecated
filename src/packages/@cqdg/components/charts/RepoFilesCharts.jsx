// @flow
import React from 'react';
import Relay from 'react-relay/classic';
import _ from 'lodash';
import { compose, withState } from 'recompose';

import { IBucket } from '@ncigdc/components/Aggregations/types';
import withRouter from '@ncigdc/utils/withRouter';

import t from '@cqdg/locales/intl';
import StackLayout from '@ferlab-ui/core/layouts/StackLayout';
import { parseFilterParam } from '@cqdg/utils/uri';
import PieTitle from './PieTitle';

import {
  SelfFilteringPie,
} from './index';

export type TProps = {
  push: Function;
  query: Record<string, any>;
  aggregations: {
    data_category: { buckets: [IBucket] };
    data_type: { buckets: [IBucket] };
    study__short_name_keyword: { buckets: [IBucket] };
    file_format: { buckets: [IBucket] };
  };
  setShowingMore: Function;
  showingMore: boolean;
  size: { width: number };
};

const enhance = compose(
  withRouter,
  withState('showingMore', 'setShowingMore', false),
);

const RepoFilesChartsComponent = ({
  aggregations,
  push,
  query,
}: TProps) => {
  const currentFilters =
    (query && parseFilterParam((query || {}).filters, {}).content) || [];
  const currentFieldNames = currentFilters.map(f => f.content.field);
  return (
    <div className="repo-charts">
      <div className="wrapped-grid">
        <div className="grid-file-pie-charts">
          <StackLayout
            className="column-center"
            vertical
            >
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
          <StackLayout
            className="column-center"
            vertical
            >
            <PieTitle>{t('charts.data_category')}</PieTitle>
            <SelfFilteringPie
              buckets={_.get(aggregations, 'data_category.buckets')}
              currentFieldNames={currentFieldNames}
              currentFilters={currentFilters}
              docTypeSingular="file"
              fieldName="data_category"
              height={125}
              path="doc_count"
              push={push}
              query={query}
              width={125}
              />
          </StackLayout>
          <StackLayout
            className="column-center"
            vertical
            >
            <PieTitle>{t('charts.data_type')}</PieTitle>
            <SelfFilteringPie
              buckets={_.get(aggregations, 'data_type.buckets')}
              currentFieldNames={currentFieldNames}
              currentFilters={currentFilters}
              docTypeSingular="file"
              fieldName="data_type"
              height={125}
              path="doc_count"
              push={push}
              query={query}
              width={125}
              />
          </StackLayout>
          <StackLayout
            className="column-center"
            vertical
            >
            <PieTitle>{t('charts.file_format')}</PieTitle>
            <SelfFilteringPie
              buckets={_.get(aggregations, 'file_format.buckets')}
              currentFieldNames={currentFieldNames}
              currentFilters={currentFilters}
              docTypeSingular="file"
              fieldName="file_format"
              height={125}
              path="doc_count"
              push={push}
              query={query}
              width={125}
              />
          </StackLayout>
        </div>
      </div>
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
