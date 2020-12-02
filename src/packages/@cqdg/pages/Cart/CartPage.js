// @flow

// Vendor
import React from 'react';
import {compose, setDisplayName} from 'recompose';
import {connect} from 'react-redux';
import FileIcon from 'react-icons/lib/fa/file-o';
import CaseIcon from 'react-icons/lib/fa/user';
import FileSizeIcon from 'react-icons/lib/fa/floppy-o';

// Custom
import formatFileSize from '@ncigdc/utils/formatFileSize';
import {withTheme} from '@ncigdc/theme';
import FilesTable from '@cqdg/pages/FileRepository/FilesTable';
import SummaryCard from '@ncigdc/components/SummaryCard';
import CountCard from '@ncigdc/components/CountCard';
import CartDownloadDropdown from '@ncigdc/components/CartDownloadDropdown';
import SparkMeterWithTooltip from '@ncigdc/components/SparkMeterWithTooltip';
import SampleSize from '@ncigdc/components/SampleSize';
import Relay from "react-relay/classic";
import withFilters from "@ncigdc/utils/withFilters";
import withRouter from "@ncigdc/utils/withRouter";
import StackLayout from "@ferlab-ui/core/layouts/StackLayout";
import t from '@cqdg/locales/intl';
import './CartPage.css';
import CardContent from "../../../@ferlab-ui/cards/CardContent";
import CardContainerNotched from "../../components/cards/CardContainerNotched";

export type TProps = {
  files: Array<Object>,
  theme: Object,
  user: Object,
  viewer: {
    File: {
      files_summary: {
        study__short_name_keyword:{
          buckets: [{
            doc_count: number,
            key: string
          }]
        },
        file_size: {
          stats: {
            sum: number
          }
        }
      },
      hits: {
        total: number
      }
    },
    Case: {
      cases_summary: {
        study__short_name_keyword: {
          buckets: [{
            doc_count: number,
            key: string
          }]
        }
      },
      hits: {
        total: number
      }
    }
  },
};

type TCartPage = (props: TProps) => React.Element<*>;
const CartPageComponent: TCartPage = (props: TProps) => {

  const {
    viewer, files, user, theme, cart_file_filters
  } = props;

  const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  const summaryData = new Map;
  const nbOfStudies = viewer.File.files_summary.study__short_name_keyword.buckets.length;

  viewer.Case.cases_summary.study__short_name_keyword.buckets.forEach(bucket => {
    const item = {
      study: bucket.key,
      case_count: bucket.doc_count,
      case_count_meter: (
        <SparkMeterWithTooltip
          part={bucket.doc_count}
          whole={viewer.Case.hits.total}
        />
      )
    }
    summaryData.set(bucket.key, item);
  });

  viewer.File.files_summary.study__short_name_keyword.buckets.forEach(bucket => {
    const item = summaryData.get(bucket.key);
    if(item){
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
    container: {
      padding: '2rem 2.5rem 13rem',
    },
    header: {
      padding: '1rem',
      borderBottom: `1px solid ${theme.greyScale4}`,
      color: theme.primary,
    },
  };

  const caseCount = viewer.Case.hits.total;
  const fileSize = viewer.File.files_summary.file_size.stats.sum;

  return (
    <div style={styles.container} className="test-cart-page">
      {!files.length && <h1>Your cart is empty.</h1>}
      {!!files.length && (
        <div>
          <StackLayout className="cart-statistics" horizontal={true}>
            <StackLayout className="cart-statistics" vertical={true}>
              <CountCard
                title={String(t('global.files')).toUpperCase()}
                count={files.length}
                icon={<FileIcon style={{ width: '2rem', height: '2rem' }} />}
                style={{ backgroundColor: 'transparent', padding: '0 1rem 1rem 1rem' }}
              />
              <CountCard
                title={String(t('global.donors')).toUpperCase()}
                count={caseCount}
                icon={<CaseIcon style={{ width: '2rem', height: '2rem' }} />}
                style={{ backgroundColor: 'transparent' }}
              />
              <CountCard
                title={String(t('cart.details.summary.file_size')).toUpperCase()}
                count={formatFileSize(fileSize*1000000, {exponent: 2})}
                icon={
                  <FileSizeIcon style={{ width: '2rem', height: '2rem' }} />
                }
                style={{ backgroundColor: 'transparent' }}
              />
            </StackLayout>
            <SummaryCard
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
              data={Array.from(summaryData.values())}
              footer={`${nbOfStudies} ${nbOfStudies > 1 ? t('global.studies') : t('global.study')}`}
              headings={[
                {
                  key: 'study',
                  title: capitalize(t('global.study')),
                  color: true
                },
                {
                  key: 'case_count',
                  title: capitalize(t('global.cases')),
                  style: { textAlign: 'right' },
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
                  title: capitalize(t('global.files')),
                  style: { textAlign: 'right' },
                },
                {
                  key: 'file_count_meter',
                  title: <SampleSize n={files.length} />,
                  thStyle: {
                    width: 1,
                    textAlign: 'center',
                  },
                  style: { textAlign: 'left' },
                }
              ]}
            />
            <CardContainerNotched type="hovered" className="how-to-download">
              <CardContent cardType="stack">
                  <h2>{t('cart.details.how_to_download.title')}</h2>
                  <strong>{t('cart.details.how_to_download.manifest.title')}</strong>
                  {t('cart.details.how_to_download.manifest.description')}
                  <br/>
                  <strong>{t('cart.details.how_to_download.cart.title')}</strong>
                {t('cart.details.how_to_download.cart.description')}
              </CardContent>
            </CardContainerNotched>
          </StackLayout>

          <StackLayout className="cart-actions" horizontal={true}>
            <CartDownloadDropdown files={files} user={user} />
          </StackLayout>

          <FilesTable
            downloadable={false}
            canAddToCart={false}
            filters={cart_file_filters}
          />
        </div>
      )}
    </div>
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