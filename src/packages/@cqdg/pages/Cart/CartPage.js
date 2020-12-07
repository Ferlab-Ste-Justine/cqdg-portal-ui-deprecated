// @flow

// Vendor
import React from 'react';
import { compose, setDisplayName } from 'recompose';
import { connect } from 'react-redux';
import Relay from 'react-relay/classic';

import FileIcon from 'react-icons/lib/fa/file-o';
import CaseIcon from 'react-icons/lib/fa/user';
import FileSizeIcon from 'react-icons/lib/fa/floppy-o';

// Custom
import formatFileSize from '@ncigdc/utils/formatFileSize';
import { withTheme } from '@ncigdc/theme';
import FilesTable from '@cqdg/pages/FileRepository/FilesTable';
import SummaryCard from '@ncigdc/components/SummaryCard';
import CountCard from '@ncigdc/components/CountCard';
import CartDownloadDropdown from '@ncigdc/components/CartDownloadDropdown';
import SparkMeterWithTooltip from '@ncigdc/components/SparkMeterWithTooltip';
import SampleSize from '@ncigdc/components/SampleSize';
import withFilters from '@ncigdc/utils/withFilters';
import withRouter from '@ncigdc/utils/withRouter';

import t from '@cqdg/locales/intl';
import CardContainerNotched from '@cqdg/components/cards/CardContainerNotched';

import StackLayout from '@ferlab-ui/core/layouts/StackLayout';
import CardContent from '@ferlab-ui/cards/CardContent';

import './CartPage.css';

export type TProps = {
  files: Array<Record<string, any>>;
  theme: Record<string, any>;
  user: Record<string, any>;
  viewer: {
    File: {
      files_summary: {
        study__short_name_keyword: {
          buckets: [{
            doc_count: number;
            key: string;
          }];
        };
        file_size: {
          stats: {
            sum: number;
          };
        };
      };
      hits: {
        total: number;
        edges: {
          node: [
            {
              file_id: string;
              file_name: string;
              file_size: number;
            }
          ];
        };
      };
    };
    Case: {
      cases_summary: {
        study__short_name_keyword: {
          buckets: [{
            doc_count: number;
            key: string;
          }];
        };
      };
      hits: {
        total: number;
      };
    };
  };
};

type TCartPage = (props: TProps) => React.Element<*>;
const CartPageComponent: TCartPage = (props: TProps) => {
  const {
    cart_file_filters, files, tableColumns, theme, viewer,
  } = props;

  const summaryData = new Map();
  const nbOfStudies = viewer.File.files_summary.study__short_name_keyword.buckets.length;
  const tableInfo = tableColumns.slice().filter(x => !x.hidden);

  viewer.Case.cases_summary.study__short_name_keyword.buckets.forEach(bucket => {
    const item = {
      study: bucket.key,
      case_count: bucket.doc_count,
      case_count_meter: (
        <SparkMeterWithTooltip
          part={bucket.doc_count}
          whole={viewer.Case.hits.total}
          />
      ),
    };
    summaryData.set(bucket.key, item);
  });

  viewer.File.files_summary.study__short_name_keyword.buckets.forEach(bucket => {
    const item = summaryData.get(bucket.key);
    if (item) {
      item.file_count = bucket.doc_count;
      item.file_count_meter = (
        <SparkMeterWithTooltip
          part={bucket.doc_count}
          whole={viewer.File.hits.total}
          />
      );
      item.tooltip = `${bucket.key}: ${bucket.doc_count} files`;

      summaryData.set(bucket.key, item);
    }
  });

  const styles = {
    header: {
      padding: '1rem',
      borderBottom: `1px solid ${theme.greyScale4}`,
      color: theme.primary,
    },
  };

  const caseCount = viewer.Case.hits.total;
  const fileSize = viewer.File.files_summary.file_size.stats.sum;

  return (
    <StackLayout className="cart-page" id="cart-details" vertical>
      {!files.length && <h1>Your cart is empty.</h1>}
      {!!files.length && (
        <React.Fragment>
          <StackLayout className="cart-statistics" horizontal>
            <StackLayout className="cart-statistics" vertical>
              <CountCard
                count={files.length}
                icon={(
                  <FileIcon
                    style={{
                      width: '2rem',
                      height: '2rem',
                    }}
                    />
                )}
                style={{
                  backgroundColor: 'transparent',
                  padding: '0 1rem 1rem 1rem',
                }}
                title={String(t('global.files')).toUpperCase()}
                />
              <CountCard
                count={caseCount}
                icon={(
                  <CaseIcon
                    style={{
                      width: '2rem',
                      height: '2rem',
                    }}
                    />
                )}
                style={{ backgroundColor: 'transparent' }}
                title={String(t('global.donors')).toUpperCase()}
                />
              <CountCard
                count={formatFileSize(fileSize * 1000000, { exponent: 2 })}
                icon={(
                  <FileSizeIcon
                    style={{
                      width: '2rem',
                      height: '2rem',
                    }}
                    />
                )}
                style={{ backgroundColor: 'transparent' }}
                title={String(t('cart.details.summary.file_size')).toUpperCase()}
                />
            </StackLayout>
            <SummaryCard
              data={Array.from(summaryData.values())}
              footer={`${nbOfStudies} ${nbOfStudies > 1 ? t('global.studies') : t('global.study')}`}
              headings={[
                {
                  key: 'study',
                  title: t('global.study'),
                  color: true,
                  style: { textTransform: 'capitalize' },
                },
                {
                  key: 'case_count',
                  title: t('global.cases'),
                  style: {
                    textAlign: 'right',
                    textTransform: 'capitalize',
                  },
                },
                {
                  key: 'case_count_meter',
                  title: <SampleSize n={caseCount} />,
                  thStyle: {
                    width: 1,
                    textAlign: 'center',
                  },
                  style: { textAlign: 'left' },
                },
                {
                  key: 'file_count',
                  title: t('global.files'),
                  style: {
                    textAlign: 'right',
                    textTransform: 'capitalize',
                  },
                },
                {
                  key: 'file_count_meter',
                  title: <SampleSize n={files.length} />,
                  thStyle: {
                    width: 1,
                    textAlign: 'center',
                  },
                  style: { textAlign: 'left' },
                },
              ]}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                height: '20em',
                overflow: 'auto',
                minWidth: '20em',
                flexShrink: 0,
                marginLeft: '3rem',
                marginRight: '3rem',
              }}
              tableTitle={t('cart.details.summary.count_per_study')}
              />
            <CardContainerNotched className="how-to-download" type="hovered">
              <CardContent cardType="stack">
                <h2>{t('cart.details.how_to_download.title')}</h2>
                <strong>{t('cart.details.how_to_download.manifest.title')}</strong>
                {t('cart.details.how_to_download.manifest.description')}
                <br />
                <strong>{t('cart.details.how_to_download.cart.title')}</strong>
                {t('cart.details.how_to_download.cart.description')}
              </CardContent>
            </CardContainerNotched>
          </StackLayout>

          <StackLayout className="cart-actions" horizontal>
            <CartDownloadDropdown
              excludedColumns={[
                'th_cart_toggle_all',
                'data_access',
                'data_category',
                'file_format',
                'is_harmonized',
                'data_type',
                'experimental_strategy',
                'platform',
                'cases.hits.edges.submitter_donor_id',
              ]}
              files={files}
              />
          </StackLayout>

          <FilesTable
            downloadable={false}
            downloadClinical={false}
            entityType="cartTableFiles"
            filters={cart_file_filters}
            tableColumns={tableInfo}
            />
        </React.Fragment>
      )}
    </StackLayout>
  );
};

export const CartPageQuery = {
  initialVariables: {
    cases_offset: null,
    cases_size: null,
    cases_sort: null,
    files_offset: null,
    files_size: null,
    files_sort: null,
    cart_file_filters: null,
    cart_case_filters: null,
  },
  fragments: {
    viewer: () => Relay.QL`
        fragment on Root {
            File {
                files_summary: aggregations(filters: $cart_file_filters, aggregations_filter_themselves: true) {
                    study__short_name_keyword{
                        buckets{
                            doc_count
                            key
                        }
                    }
                    file_size{
                        stats{
                            sum
                        }
                    }
                }
                hits(first: $files_size offset: $files_offset, filters: $cart_file_filters, sort: $files_sort) {
                    total
                    edges{
                        node{
                            file_id
                            file_name
                            file_size
                        }
                    }
                }
            }
            Case {
                cases_summary: aggregations(filters: $cart_case_filters, aggregations_filter_themselves: true) {
                    study__short_name_keyword{
                        buckets{
                            doc_count
                            key
                        }
                    }
                }
                hits(first: $files_size offset: $files_offset, filters: $cart_case_filters, sort: $files_sort) {
                    total
                }
            }
        }
    `,
  },
};

const enhance = compose(
  setDisplayName('CartPage'),
  connect(state => ({
    ...state.cart,
    ...state.auth,
    tableColumns: state.tableColumns.cartTableFiles,
  })),
  withFilters(),
  withRouter,
  withTheme,
);

const CartPage = Relay.createContainer(
  enhance(CartPageComponent),
  CartPageQuery,
);

export default CartPage;