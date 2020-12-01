// @flow

// Vendor
import React from 'react';
import {compose, setDisplayName} from 'recompose';
import { connect } from 'react-redux';
import FileIcon from 'react-icons/lib/fa/file-o';
import CaseIcon from 'react-icons/lib/fa/user';
import FileSizeIcon from 'react-icons/lib/fa/floppy-o';

// Custom
import { setFilter } from '@ncigdc/utils/filters';
import formatFileSize from '@ncigdc/utils/formatFileSize';
import { getAuthCounts } from '@ncigdc/utils/auth';
import { Row, Column } from '@ncigdc/uikit/Flex';
import { withTheme } from '@ncigdc/theme';
import FilesTable from '@cqdg/pages/FileRepository/FilesTable';
import MetadataDownloadButton from '@ncigdc/components/MetadataDownloadButton';
import SampleSheetDownloadButton from '@ncigdc/components/SampleSheetDownloadButton';
import SummaryCard from '@ncigdc/components/SummaryCard';
import HowToDownload from '@ncigdc/components/HowToDownload';
import CountCard from '@ncigdc/components/CountCard';
import CartDownloadDropdown from '@ncigdc/components/CartDownloadDropdown';
import RemoveFromCartButton from '@ncigdc/components/RemoveFromCartButton';
import SparkMeterWithTooltip from '@ncigdc/components/SparkMeterWithTooltip';
import SampleSize from '@ncigdc/components/SampleSize';
import DownloadClinicalDropdown from '@ncigdc/modern_components/DownloadClinicalDropdown';
import DownloadBiospecimenDropdown from '@ncigdc/modern_components/DownloadBiospecimenDropdown/';
import timestamp from '@ncigdc/utils/timestamp';
import Relay from "react-relay/classic";
import withFilters from "@ncigdc/utils/withFilters";
import withRouter from "@ncigdc/utils/withRouter";

/*----------------------------------------------------------------------------*/

export type TProps = {
  files: Array<Object>,
  theme: Object,
  user: Object,
  viewer: {
    File: {
      files_summary: {
        study__study_id_keyword:{
          buckets: {
            doc_count: number
          }
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
        study__study_id_keyword: {
          buckets: {
            doc_count: number,
            key: string
          }
        }
      },
      hits: {
        total: number
      }
    }
  },
};

type TCartPage = (props: TProps) => React.Element<*>;
const CartPageComponent: TCartPage = ({ viewer, files, user, theme } = {}) => {
  const authCounts = getAuthCounts({ user, files });

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

  const filters = files.length
    ? setFilter({
        field: 'files.file_id',
        value: files.map(f => f.file_id),
      })
    : null;

  return (
    <Column style={styles.container} className="test-cart-page">
      {!files.length && <h1>Your cart is empty.</h1>}
      {!!files.length && (
        <Column>
          {/*<Row style={{ marginBottom: '2rem', flexWrap: 'wrap' }}>*/}
          {/*  <Column spacing="0.8rem" style={{ marginRight: '1rem' }}>*/}
          {/*    <CountCard*/}
          {/*      title="FILES"*/}
          {/*      count={files.length}*/}
          {/*      icon={<FileIcon style={{ width: '4rem', height: '4rem' }} />}*/}
          {/*      style={{ backgroundColor: 'transparent' }}*/}
          {/*    />*/}
          {/*    <CountCard*/}
          {/*      title="CASES"*/}
          {/*      count={caseCount}*/}
          {/*      icon={<CaseIcon style={{ width: '4rem', height: '4rem' }} />}*/}
          {/*      style={{ backgroundColor: 'transparent' }}*/}
          {/*    />*/}
          {/*    <CountCard*/}
          {/*      title="FILE SIZE"*/}
          {/*      count={formatFileSize(fileSize)}*/}
          {/*      icon={*/}
          {/*        <FileSizeIcon style={{ width: '4rem', height: '4rem' }} />*/}
          {/*      }*/}
          {/*      style={{ backgroundColor: 'transparent' }}*/}
          {/*    />*/}
          {/*  </Column>*/}
          {/*  <SummaryCard*/}
          {/*    style={{*/}
          {/*      flex: 1,*/}
          {/*      backgroundColor: 'transparent',*/}
          {/*      height: '19em',*/}
          {/*      overflow: 'auto',*/}
          {/*      minWidth: '30em',*/}
          {/*      flexShrink: 0,*/}
          {/*      marginLeft: '1rem',*/}
          {/*      marginRight: '1rem',*/}
          {/*    }}*/}
          {/*    tableTitle="File Counts by Project"*/}
          {/*    pieChartTitle="File Counts by Project"*/}
          {/*    data={viewer.summary.aggregations.project__project_id.buckets.map(*/}
          {/*      item => ({*/}
          {/*        project: item.key,*/}
          {/*        case_count: item.case_count,*/}
          {/*        case_count_meter: (*/}
          {/*          <SparkMeterWithTooltip*/}
          {/*            part={item.case_count}*/}
          {/*            whole={caseCount}*/}
          {/*          />*/}
          {/*        ),*/}
          {/*        file_count: item.doc_count.toLocaleString(),*/}
          {/*        file_count_meter: (*/}
          {/*          <SparkMeterWithTooltip*/}
          {/*            part={item.doc_count}*/}
          {/*            whole={files.length}*/}
          {/*          />*/}
          {/*        ),*/}
          {/*        file_size: formatFileSize(item.file_size),*/}
          {/*        file_size_meter: (*/}
          {/*          <SparkMeterWithTooltip*/}
          {/*            part={item.file_size}*/}
          {/*            whole={fileSize}*/}
          {/*          />*/}
          {/*        ),*/}
          {/*        tooltip: `${item.key}: ${item.doc_count.toLocaleString()}`,*/}
          {/*      }),*/}
          {/*    )}*/}
          {/*    footer={`${viewer.summary.aggregations.project__project_id.buckets*/}
          {/*      .length} Projects `}*/}
          {/*    path="file_count"*/}
          {/*    headings={[*/}
          {/*      { key: 'project', title: 'Project', color: true },*/}
          {/*      {*/}
          {/*        key: 'case_count',*/}
          {/*        title: 'Cases',*/}
          {/*        style: { textAlign: 'right' },*/}
          {/*      },*/}
          {/*      {*/}
          {/*        key: 'case_count_meter',*/}
          {/*        title: <SampleSize n={caseCount} />,*/}
          {/*        thStyle: {*/}
          {/*          width: 1,*/}
          {/*          textAlign: 'center',*/}
          {/*        },*/}
          {/*        style: { textAlign: 'left' },*/}
          {/*      },*/}
          {/*      {*/}
          {/*        key: 'file_count',*/}
          {/*        title: 'Files',*/}
          {/*        style: { textAlign: 'right' },*/}
          {/*      },*/}
          {/*      {*/}
          {/*        key: 'file_count_meter',*/}
          {/*        title: <SampleSize n={files.length} />,*/}
          {/*        thStyle: {*/}
          {/*          width: 1,*/}
          {/*          textAlign: 'center',*/}
          {/*        },*/}
          {/*        style: { textAlign: 'left' },*/}
          {/*      },*/}
          {/*      {*/}
          {/*        key: 'file_size',*/}
          {/*        title: 'File Size',*/}
          {/*        style: { textAlign: 'right' },*/}
          {/*      },*/}
          {/*      {*/}
          {/*        key: 'file_size_meter',*/}
          {/*        title: (*/}
          {/*          <SampleSize*/}
          {/*            n={fileSize}*/}
          {/*            formatter={formatFileSize}*/}
          {/*            symbol="∑"*/}
          {/*          />*/}
          {/*        ),*/}
          {/*        thStyle: {*/}
          {/*          width: 1,*/}
          {/*          textAlign: 'center',*/}
          {/*        },*/}
          {/*        style: { textAlign: 'left' },*/}
          {/*      },*/}
          {/*    ]}*/}
          {/*  />*/}
          {/*  <SummaryCard*/}
          {/*    style={{*/}
          {/*      flex: 1,*/}
          {/*      backgroundColor: 'transparent',*/}
          {/*      height: '19em',*/}
          {/*      overflow: 'auto',*/}
          {/*      minWidth: '23em',*/}
          {/*      flexShrink: 0,*/}
          {/*      marginLeft: '1rem',*/}
          {/*      marginRight: '1rem',*/}
          {/*    }}*/}
          {/*    tableTitle="File Counts by Authorization Level"*/}
          {/*    pieChartTitle="File Counts by Authorization Level"*/}
          {/*    data={authCounts.map(x => ({*/}
          {/*      ...x,*/}
          {/*      file_count_meter: (*/}
          {/*        <SparkMeterWithTooltip*/}
          {/*          part={x.doc_count}*/}
          {/*          whole={files.length}*/}
          {/*        />*/}
          {/*      ),*/}
          {/*      file_size: formatFileSize(x.file_size),*/}
          {/*      file_size_meter: (*/}
          {/*        <SparkMeterWithTooltip part={x.file_size} whole={fileSize} />*/}
          {/*      ),*/}
          {/*      tooltip: `${x.key}: ${formatFileSize(x.file_size)}`,*/}
          {/*    }))}*/}
          {/*    footer={`${authCounts.length} Authorization Levels`}*/}
          {/*    path="doc_count"*/}
          {/*    headings={[*/}
          {/*      {*/}
          {/*        key: 'key',*/}
          {/*        title: 'Level',*/}
          {/*        color: true,*/}
          {/*        tdStyle: { textTransform: 'capitalize' },*/}
          {/*      },*/}
          {/*      {*/}
          {/*        key: 'doc_count',*/}
          {/*        title: 'Files',*/}
          {/*        style: { textAlign: 'right' },*/}
          {/*      },*/}
          {/*      {*/}
          {/*        key: 'file_count_meter',*/}
          {/*        title: <SampleSize n={files.length} />,*/}
          {/*        thStyle: {*/}
          {/*          width: 1,*/}
          {/*          textAlign: 'center',*/}
          {/*        },*/}
          {/*        style: { textAlign: 'left' },*/}
          {/*      },*/}
          {/*      {*/}
          {/*        key: 'file_size',*/}
          {/*        title: 'File Size',*/}
          {/*        style: { textAlign: 'right' },*/}
          {/*      },*/}
          {/*      {*/}
          {/*        key: 'file_size_meter',*/}
          {/*        title: (*/}
          {/*          <SampleSize*/}
          {/*            n={fileSize}*/}
          {/*            formatter={formatFileSize}*/}
          {/*            symbol="∑"*/}
          {/*          />*/}
          {/*        ),*/}
          {/*        thStyle: {*/}
          {/*          width: 1,*/}
          {/*          textAlign: 'center',*/}
          {/*        },*/}
          {/*        style: { textAlign: 'left' },*/}
          {/*      },*/}
          {/*    ]}*/}
          {/*  />*/}
          {/*  <HowToDownload*/}
          {/*    style={{*/}
          {/*      flex: 1,*/}
          {/*      backgroundColor: 'transparent',*/}
          {/*      minWidth: '18em',*/}
          {/*      flexShrink: 0,*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</Row>*/}
          {/*<Row style={{ marginBottom: '6rem' }}>*/}
          {/*  <Row style={{ marginLeft: 'auto' }} spacing="1rem">*/}
          {/*    <DownloadBiospecimenDropdown*/}
          {/*      buttonStyles={{ marginLeft: '1em' }}*/}
          {/*      dropdownStyles={{*/}
          {/*        minWidth: '126px',*/}
          {/*        width: '126px',*/}
          {/*        left: '14px',*/}
          {/*        marginTop: '2px',*/}
          {/*      }}*/}
          {/*      filters={filters}*/}
          {/*      tsvFilename={`biospecimen.cart.${timestamp()}.tar.gz`}*/}
          {/*      jsonFilename={`biospecimen.cart.${timestamp()}.json`}*/}
          {/*      inactiveText={'Biospecimen'}*/}
          {/*    />*/}
          {/*    <DownloadClinicalDropdown*/}
          {/*      dropdownStyles={{*/}
          {/*        width: '90px',*/}
          {/*        left: '13px',*/}
          {/*        marginTop: '2px',*/}
          {/*      }}*/}
          {/*      buttonStyles={{ margin: '0 1em' }}*/}
          {/*      filters={filters}*/}
          {/*      tsvFilename={`clinical.cart.${timestamp()}.tar.gz`}*/}
          {/*      jsonFilename={`clinical.cart.${timestamp()}.json`}*/}
          {/*      inactiveText={'Clinical'}*/}
          {/*    />*/}
          {/*    <SampleSheetDownloadButton files={{ files }} />*/}
          {/*    <MetadataDownloadButton files={{ files }} />*/}
          {/*    <CartDownloadDropdown files={files} user={user} />*/}
          {/*    <RemoveFromCartButton user={user} />*/}
          {/*  </Row>*/}
          {/*</Row>*/}
          <FilesTable
            downloadable={false}
            canAddToCart={false}
            tableHeader={'Cart Items'}
            filters={filters}
          />
        </Column>
      )}
    </Column>
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
    fileFilters: null,
    caseFilters: null,
  },
  fragments: {
    viewer: () => Relay.QL`
        fragment on Root {
            File {
                files_summary: aggregations(filters: $fileFilters, aggregations_filter_themselves: true) {
                    study__study_id_keyword{
                        buckets{
                            doc_count
                        }
                    }
                    file_size{
                        stats{
                            sum
                        }
                    }
                }
                hits(first: $files_size offset: $files_offset, filters: $fileFilters, sort: $files_sort) {
                    total
                }
            }
            Case {
                cases_summary: aggregations(filters: $caseFilters, aggregations_filter_themselves: true) {
                    study__study_id_keyword{
                        buckets{
                            doc_count
                            key
                        }
                    }
                }
                hits(first: $files_size offset: $files_offset, filters: $caseFilters, sort: $files_sort) {
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