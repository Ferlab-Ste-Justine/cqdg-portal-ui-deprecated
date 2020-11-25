/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import { connect } from 'react-redux';
import { compose, setDisplayName } from 'recompose';
import { Row } from '@ncigdc/uikit/Flex';
import QueryLayout from '@cqdg/components/layouts/QueryLayout';
import TabbedLinks from '@ncigdc/components/TabbedLinks';
import NoResultsMessage from '@ncigdc/components/NoResultsMessage';
import RepoCasesTable from '@cqdg/pages/FileRepository/RepoCasesTable';
import CaseAggregations from '@cqdg/pages/FileRepository/CaseAggregations';
import FileAggregations from '@cqdg/pages/FileRepository/FileAggregations';

import FilesTable from '@cqdg/pages/FileRepository/FilesTable';
import { SaveIcon } from '@ncigdc/theme/icons';
import withFilters from '@ncigdc/utils/withFilters';
import formatFileSize from '@ncigdc/utils/formatFileSize';

import RepoCasesCharts from '@cqdg/components/charts/RepoCasesCharts';
import RepoFilesCharts from '@cqdg/components/charts/RepoFilesCharts';

import withRouter from '@ncigdc/utils/withRouter';
import t from '@cqdg/locales/intl';
import Tabs from '@ferlab-ui/core/containers/tabs';

import features from '../../../../features.json';

import './FileRepositoryPage.css';

export type TProps = {
  push: Function;
  relay: Record<string, any>;
  dispatch: Function;
  filters: any;
  cases_sort: any;
  viewer: {
    autocomplete_case: {
      hits: Array<Record<string, any>>;
    };
    autocomplete_file: {
      hits: Array<Record<string, any>>;
    };
    cart_summary: {
      aggregations: {
        fs: {
          value: number;
        };
      };
    };
    repository: {
      customCaseFacets: {
        facets: {
          facets: string;
        };
      };
      customFileFacets: {
        facets: {
          facets: string;
        };
      };
      cases: {
        aggregations: {};
        pies: {};
        hits: {
          total: number;
        };
      };
      files: {
        aggregations: {};
        pies: {};
        hits: {
          total: number;
        };
      };
    };
  };
};

const enhance = compose(
  setDisplayName('RepositoryPage'),
  connect(),
  withFilters(),
  withRouter,
);

export const RepositoryPageComponent = (props: TProps) => {
  const {
    filters, query, relay, viewer,
  } = props;
  const fileCount = viewer.File.hits.total;
  const caseCount = viewer.Case.hits.total;

  // PLA : hardcoding this to get page to load
  /* const fileSize = props.viewer.cart_summary.aggregations.fs.value; */
  const fileSize = 0;

  const facetTabPanes: TabPanes = [
    {
      component: <CaseAggregations relay={relay} />,
      id: 'participants',
      text: t('global.participants'),
    },
    {
      component: <FileAggregations relay={relay} />,
      id: 'files',
      text: t('global.files.title'),
    },
  ];

  const SidePanelComponent = (
    <Tabs
      defaultIndex={0}
      panes={facetTabPanes}
      queryParam="facetTab"
      />
  );

  return (
    <div id="RepositoryPage">
      <QueryLayout
        filtersLinkProps={{
          hideLinkOnEmpty: false,
          linkPathname: '/query',
          linkText: t('search.advanced.search'),
        }}
        results={(
          <div>

            {
              (Object.keys(query).length === 0 || query.searchTableTab === 'files') && caseCount ? <RepoFilesCharts aggregations={viewer.File.pies} />
              : query.searchTableTab === 'cases' && fileCount ? <RepoCasesCharts aggregations={viewer.Case.pies} />
              : <div />
            }
            <TabbedLinks
              defaultIndex={0}
              links={[
                {
                  id: 'files',
                  text: t('repo.tabs.files', { count: fileCount.toLocaleString() }),
                  component: fileCount ? (
                    <div>
                      <FilesTable />
                    </div>
                  ) : (
                    <NoResultsMessage>
                      {t('search.no.results')}
                    </NoResultsMessage>
                  ),
                },
                {
                  id: 'cases',
                  text: t('repo.tabs.cases', { count: caseCount.toLocaleString() }),
                  component: caseCount ? (
                    <div>
                      <RepoCasesTable />
                    </div>
                  ) : (
                    <NoResultsMessage>
                      {t('search.no.results')}
                    </NoResultsMessage>
                  ),
                },
              ]}
              queryParam="searchTableTab"
              tabToolbar={
                features.saveIcon && (
                  <Row spacing="2rem" style={{ alignItems: 'center' }}>
                    <span style={{ flex: 'none' }}>
                      <SaveIcon style={{ marginRight: 5 }} />
                      {' '}
                      <strong>{formatFileSize(fileSize)}</strong>
                    </span>
                  </Row>
              )
              }
              />
          </div>
        )}
        sidePanelComponent={SidePanelComponent}
        />
    </div>
  );
};
export const RepositoryPageQuery = {
  initialVariables: {
    cases_offset: null,
    cases_size: null,
    cases_sort: null,
    files_offset: null,
    files_size: null,
    files_sort: null,
    fileFilters: null,
    caseFilters: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
          File {
            pies: aggregations(filters: $fileFilters, aggregations_filter_themselves: true) {
                ${RepoFilesCharts.getFragment('aggregations')}
            }              
            hits(first: $files_size offset: $files_offset, filters: $fileFilters, sort: $files_sort) {
              total
            }
          }
          Case {
            pies: aggregations(filters: $caseFilters, aggregations_filter_themselves: true) {
                ${RepoCasesCharts.getFragment('aggregations')}
            }
            hits(first: $files_size offset: $files_offset, filters: $caseFilters, sort: $files_sort) {
              total
            }
          }
      }
    `,
  },
};

const RepositoryPage = Relay.createContainer(
  enhance(RepositoryPageComponent),
  RepositoryPageQuery,
);

export default RepositoryPage;
