// @flow
import React from 'react';
import { RepositoryFilesLink } from '@ncigdc/components/Links/RepositoryLink';
import { makeFilter } from '@ncigdc/utils/filters';
import { createDataCategoryColumns } from '@ncigdc/tableModels/utils';

import t from '@cqdg/locales/intl';
import Th from '@cqdg/components/table/Th';
import Td from '@cqdg/components/table/Td';

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
    sortable: false,
    downloadable: true,
    hidden: true,
    th: () => <Th>Study ID</Th>,
    td: ({ node }) => <Td>{node.study.hits.edges[0].node.study_id}</Td>,
  },
  {
    name: 'Donor',
    id: 'submitter_donor_id',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: () => <Th>Donor ID</Th>,
    td: ({ node }) => <Td>{node.submitter_donor_id}</Td>,
  },
  {
    name: 'Gender',
    id: 'gender',
    sortable: true,
    downloadable: true,
    th: () => (
      <Th key="gender">
        Gender
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
    sortable: false,
    downloadable: true,
    hidden: true,
    th: () => <Th>Ethnicity</Th>,
    td: ({ node }) => (
      <Td>{(node.ethnicity) || '--'}</Td>
    ),
  },
  {
    name: 'Vital Status',
    id: 'vital_status',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: () => <Th>Vital Status</Th>,
    td: ({ node }) => {
      return <Td>{node.vital_status}</Td>;
    },
  },
  {
    name: 'Age at recruitment',
    id: 'age_at_recruitment',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: () => <Th>Age at recruitment (years)</Th>,
    td: ({ node }) => <Td>{node.age_at_recruitment}</Td>,
  },
  {
    name: 'Age at diagnosis',
    id: 'diagnoses.age_at_diagnosis',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: () => <Th>Age at diagnosis (years)</Th>,
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
    sortable: false,
    downloadable: true,
    hidden: true,
    th: () => <Th>Diagnosis ICD Term</Th>,
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
    sortable: false,
    downloadable: true,
    hidden: true,
    th: () => <Th>Phenotype HPO Term</Th>,
    td: ({ node }) => <Td>{node.phenotypes ? node.phenotypes.hits.edges[0].node.hpo_term : '--'}</Td>,
  },
  {
    name: 'Number of files',
    id: 'files.count',
    sortable: false,
    downloadable: true,
    hidden: true,
    th: () => <Th>Number of Files</Th>,
    td: ({ node }) => (
      <Td>
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
      </Td>
    ),
  },
];

export default casesTableModel;
