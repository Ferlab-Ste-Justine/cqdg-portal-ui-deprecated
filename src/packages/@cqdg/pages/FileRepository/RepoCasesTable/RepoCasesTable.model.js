// @flow
import React from 'react';
import { RepositoryFilesLink } from '@ncigdc/components/Links/RepositoryLink';
import { makeFilter } from '@ncigdc/utils/filters';
import { createDataCategoryColumns } from '@ncigdc/tableModels/utils';

import t from '@cqdg/locales/intl';
import Th from '@cqdg/components/table/Th';
import ThNum from '@cqdg/components/table/ThNum';
import Td from '@cqdg/components/table/Td';
import TdNum from '@cqdg/components/table/TdNum';

/* const dataCategoryColumns = createDataCategoryColumns({
  title: 'Available Files per Data Category',
  countKey: 'file_count',
  Link: RepositoryFilesLink,
  getCellLinkFilters: node => [
    {
      field: 'cases.case_id',
      value: node.case_id,
    },
  ],
  getTotalLinkFilters: hits => [],
}); */


const casesTableModel = [
  {
    name: 'Study',
    id: 'study.study_id',
    sortable: true,
    downloadable: true,
    hidden: false,
    th: () => <Th>{t('facet.study.study_id')}</Th>,
    td: ({ node }) => <Td>{node.study.hits.edges[0].node.study_id}</Td>,
  },
  {
    name: 'Donor',
    id: 'submitter_donor_id',
    sortable: true,
    downloadable: true,
    hidden: false,
    th: () => <Th>{t('facet.submitter_donor_id')}</Th>,
    td: ({ node }) => <Td>{node.submitter_donor_id}</Td>,
  },
  {
    name: 'Gender',
    id: 'gender',
    sortable: true,
    downloadable: true,
    th: () => (
      <Th key="gender">
        {t('facet.gender')}
      </Th>
    ),
    td: ({ node }) => (
      <Td key="gender">
        {node.gender || '--'}
      </Td>
    ),
  },
  {
    name: 'Ethnicity',
    id: 'ethnicity',
    sortable: true,
    downloadable: true,
    hidden: false,
    th: () => <Th>{t('facet.ethnicity')}</Th>,
    td: ({ node }) => (
      <Td>{(node.ethnicity) || '--'}</Td>
    ),
  },
  {
    name: 'Vital Status',
    id: 'vital_status',
    sortable: true,
    downloadable: true,
    hidden: true,
    th: () => <Th>{t('facet.vital_status')}</Th>,
    td: ({ node }) => {
      return <Td>{node.vital_status}</Td>;
    },
  },
  {
    name: 'Age at recruitment',
    id: 'age_at_recruitment',
    sortable: true,
    downloadable: true,
    hidden: false,
    th: () => <Th>{t('facet.age_at_recruitment')}</Th>,
    td: ({ node }) => <Td>{node.age_at_recruitment}</Td>,
  },
  {
    name: 'Age at diagnosis',
    id: 'diagnoses.age_at_diagnosis',
    sortable: true,
    downloadable: true,
    hidden: false,
    th: () => <Th>{t('facet.diagnoses.age_at_diagnosis')}</Th>,
    td: ({ node }) => {
      // PLA - What if 2 diagnosis on the same year?
      // Use diagnosis with minimum age
      const age = Math.min.apply(Math, node.diagnoses.hits.edges.map((obj) => { return obj.node.age_at_diagnosis; }));
      return (
        <Td>{node.diagnoses ? /* ageDisplay(age) */ age : '--'}</Td>
      );
    },
  },
  {
    name: 'Diagnosis ICD Term',
    id: 'diagnoses.icd_term',
    sortable: true,
    downloadable: true,
    hidden: true,
    th: () => <Th>{t('facet.diagnoses.icd_term')}</Th>,
    td: ({ node }) => {
      // Use diagnosis with minimum age
      if (node) {
        const age = Math.min.apply(Math, node.diagnoses.hits.edges.map((obj) => { return obj.node.age_at_diagnosis; }));
        const result = node.diagnoses.hits.edges.find((obj) => { return obj.node.age_at_diagnosis === age; });

        return (
          <Td>{result && result.node ? result.node.icd_term : '--'}</Td>
        );
      }
      return (
        <Td>--</Td>
      );
    },
  },
  {
    name: 'Phenotype',
    id: 'phenotypes.hpo_term',
    sortable: true,
    downloadable: true,
    hidden: true,
    th: () => <Th>{t('facet.phenotypes.hpo_term')}</Th>,
    td: ({ node }) => <Td>{node.phenotypes ? node.phenotypes.hits.edges[0].node.hpo_term : '--'}</Td>,
  },
  {
    name: 'Number of files',
    id: 'files.count',
    sortable: true,
    downloadable: true,
    hidden: false,
    th: () => <ThNum>{t('facet.files.count')}</ThNum>,
    td: ({ node }) => (
      <TdNum>
        <RepositoryFilesLink
          query={{
            filters: makeFilter([
              {
                field: 'cases.submitter_donor_id',
                value: [node.submitter_donor_id],
              },
            ]),
          }}
          >
          {node.files.hits.total}
        </RepositoryFilesLink>
      </TdNum>
    ),
  },
];

export default casesTableModel;
