/* eslint-disable sort-keys */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
// @flow

import React from 'react';
import MdLock from 'react-icons/lib/md/lock';
import MdLockOutline from 'react-icons/lib/md/lock-outline';
import MdLockOpen from 'react-icons/lib/md/lock-open';

import { RepositoryCasesLink } from '@cqdg/components/Links/RepositoryLink';
import { makeFilter } from '@cqdg/utils/filters';

import Th from '@cqdg/components/table/Th';
import Td from '@cqdg/components/table/Td';
import TdNum from '@cqdg/components/table/TdNum';
import ThNum from '@cqdg/components/table/ThNum';
import FileLink from '@cqdg/components/Links/FileLink';
import filesizeInput, { EFileInputType } from '@cqdg/utils/formatFileSize';

import t from '@cqdg/locales/intl';

import features from '../../../../../features.json';
import './FilesTable.css';

const filesTableModel = [
  {
    name: 'File UUID',
    id: 'file_id',
    th: ({ id }) => <Th id={id}>{t('facet.file_id')}</Th>,
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
    th: ({ id }) => <Th id={id}><MdLock className="files-table-locks" /></Th>,
    td: ({ node }) => (
      <Td>
        {node.data_access.toLowerCase() === 'open' && <MdLockOpen className="files-table-locks files-table-lock-open" />}
        {node.data_access.toLowerCase() === 'controled' && <MdLockOutline className="files-table-locks files-table-lock" />}
      </Td>
    ),
  },
  {
    name: 'File Name',
    id: 'file_name_keyword',
    sortable: true,
    downloadable: true,
    th: ({ id }) => <Th id={id}>{t('facet.file_name_keyword')}</Th>,
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
            {node.file_name_keyword}
          </FileLink>
        ) : (node.file_name_keyword)}
      </Td>
    ),
  },
  {
    name: 'Data Category',
    id: 'data_category',
    th: ({ id }) => <Th id={id}>{t('facet.data_category')}</Th>,
    td: ({ node }) => <Td>{node.data_category || '--'}</Td>,
    sortable: true,
    downloadable: true,
  },
  {
    name: 'Data Format',
    id: 'file_format',
    th: ({ id }) => <Th id={id}>{t('facet.file_format')}</Th>,
    td: ({ node }) => <Td>{node.file_format || '--'}</Td>,
    sortable: true,
    downloadable: true,
  },
  {
    name: 'Harmonized',
    id: 'is_harmonized',
    th: ({ id }) => <Th id={id}>{t('facet.is_harmonized')}</Th>,
    td: ({ node }) => (
      <Td>{node.is_harmonized ? 'true' : 'false'}</Td>
    ),
    sortable: true,
    downloadable: true,
  },
  {
    name: 'Data Type',
    id: 'data_type',
    th: ({ id }) => <Th id={id}>{t('facet.data_type')}</Th>,
    td: ({ node }) => <Td>{node.data_type || '--'}</Td>,
    sortable: true,
    downloadable: true,
    hidden: true,
  },
  {
    name: 'Experimental Strategy',
    id: 'experimental_strategy',
    th: ({ id }) => <Th id={id}>{t('facet.experimental_strategy')}</Th>,
    td: ({ node }) => <Td>{node.experimental_strategy || '--'}</Td>,
    sortable: true,
    downloadable: true,
    hidden: true,
  },
  {
    name: 'Platform',
    id: 'platform',
    th: ({ id }) => <Th id={id}>{t('facet.platform')}</Th>,
    td: ({ node }) => <Td>{node.platform || '--'}</Td>,
    sortable: true,
    downloadable: true,
    hidden: false,
  },
  {
    name: 'Number of donors',
    id: 'cases.hits.edges.submitter_donor_id',
    th: ({ id }) => <ThNum id={id}>{t('facet.cases.hits.edges.submitter_donor_id')}</ThNum>,
    td: ({ node }) => (
      <TdNum>
        <RepositoryCasesLink
          query={{
            filters: makeFilter([
              {
                field: 'cases.submitter_donor_id',
                value: [node.cases.hits.edges[0].node.submitter_donor_id],
              },
            ]),
          }}
          >
          {node.cases.hits.total}
        </RepositoryCasesLink>
      </TdNum>
    ),
    sortable: false,
    downloadable: true,
    hidden: false,
  },
  {
    name: 'Size',
    id: 'file_size',
    th: ({ id }) => <ThNum id={id}>{t('facet.file_size')}</ThNum>,
    td: ({ node }) => (
      <TdNum>
        <span>{filesizeInput(node.file_size, {}, EFileInputType.MB)}</span>
      </TdNum>
    ),
    sortable: true,
    downloadable: true,
  },
];

export default filesTableModel;
