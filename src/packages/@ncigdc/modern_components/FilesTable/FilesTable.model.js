// @flow

import React from 'react';
import { uniq } from 'lodash';
import {
  Th, Td, TdNum, ThNum,
} from '@ncigdc/uikit/Table';
import CaseLink from '@ncigdc/components/Links/CaseLink';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import { RepositoryCasesLink } from '@ncigdc/components/Links/RepositoryLink';
import FileLink from '@ncigdc/components/Links/FileLink';
import { makeFilter } from '@ncigdc/utils/filters';
import FileSize from '@ncigdc/components/FileSize';
import CopyToClipboardButton from '@ncigdc/modern_components/CopyToClipboardButton/CopyToClipboardButton';
import t from '@ncigdc/locales/intl';
import features from '../../../../features';

const filesTableModel = [
  {
    name: 'File UUID',
    id: 'file_id',
    th: () => <Th>{t('global.tables.columns.file_id')}</Th>,
    td: ({ node }) => (
      <Td>
        {features.fileLinking ? (
          <FileLink
            style={{
              whiteSpace: 'pre-line',
              wordBreak: 'break-all',
            }}
            uuid={node.file_id}
            >
            {node.file_id}
          </FileLink>
) : (node.file_id)}
      </Td>
    ),
    sortable: false,
    downloadable: true,
    hidden: true,
  },
  {
    name: 'Access',
    id: 'data_access',
    sortable: true,
    downloadable: true,
    th: () => <Th>{t('global.tables.columns.data_access')}</Th>,
    td: ({ node }) => (
      <Td>
        {node.data_access === 'open' && <i className="fa fa-unlock-alt" />}
        {node.data_access === 'controlled' && <i className="fa fa-lock" />}
        <span
          style={{
            marginLeft: '0.3rem',
          }}
          >
          {node.data_access}
        </span>
      </Td>
    ),
  },
  {
    name: 'File Name',
    id: 'file_name_keyword',
    sortable: true,
    downloadable: true,
    th: () => <Th>{t('global.tables.columns.file_name_keyword')}</Th>,
    td: ({ node }) => (
      <Td>
        <CopyToClipboardButton text={node.file_name_keyword} />
        {features.fileLinking ? (
          <FileLink
            style={{
              whiteSpace: 'pre-line',
              wordBreak: 'break-all',
            }}
            uuid={node.file_id}
            >
            {node.file_name_keyword}
          </FileLink>
        ) : (node.file_name_keyword)}
      </Td>
    ),
  },
  {
    name: 'Data Category',
    id: 'data_category',
    th: () => <Th>{t('global.tables.columns.data_category')}</Th>,
    td: ({ node }) => <Td>{node.data_category || '--'}</Td>,
    sortable: true,
    downloadable: true,
  },
  {
    name: 'Data Format',
    id: 'file_format',
    th: () => <Th>{t('global.tables.columns.file_format')}</Th>,
    td: ({ node }) => <Td>{node.file_format || '--'}</Td>,
    sortable: true,
    downloadable: true,
  },
  {
    name: 'Size',
    id: 'file_size',
    th: () => <ThNum>{t('global.tables.columns.file_size')}</ThNum>,
    td: ({ node }) => (
      <TdNum>
        <FileSize bytes={node.file_size * 1000000} />
      </TdNum>
    ),
    sortable: true,
    downloadable: true,
  },
  {
    name: 'Harmonized',
    id: 'is_harmonized',
    th: () => <Th>{t('global.tables.columns.is_harmonized')}</Th>,
    td: ({ node }) => (
      <Td style={{ textAlign: 'center' }}>{node.is_harmonized ? 'true' : 'false'}</Td>
    ),
    sortable: true,
    downloadable: true,
  },
  {
    name: 'Data Type',
    id: 'data_type',
    th: () => <Th>{t('global.tables.columns.data_type')}</Th>,
    td: ({ node }) => <Td>{node.data_type || '--'}</Td>,
    sortable: true,
    downloadable: true,
    hidden: true,
  },
  {
    name: 'Experimental Strategy',
    id: 'experimental_strategy',
    th: () => <Th>{t('global.tables.columns.data_category')}</Th>,
    td: ({ node }) => <Td>{node.experimental_strategy || '--'}</Td>,
    sortable: true,
    downloadable: true,
    hidden: true,
  },
  {
    name: 'Platform',
    id: 'platform',
    th: () => <Th>{t('global.tables.columns.platform')}</Th>,
    td: ({ node }) => <Td>{node.platform || '--'}</Td>,
    sortable: true,
    downloadable: true,
    hidden: false,
  },
  {
	  name: 'Number of donors',
	  id: 'cases.hits.edges.submitter_donor_id',
	  th: () => <Th>{t('global.tables.columns.cases.hits.edges.submitter_donor_id')}</Th>,
	  td: ({ node }) => <Td style={{ textAlign: 'center' }}>{node.cases.hits.total}</Td>,
	  sortable: false,
	  downloadable: true,
	  hidden: false,
  },
];

export default filesTableModel;
