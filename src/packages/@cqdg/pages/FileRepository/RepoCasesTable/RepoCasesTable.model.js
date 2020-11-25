// @flow
import React from 'react';
import { RepositoryCasesLink, RepositoryFilesLink } from '@ncigdc/components/Links/RepositoryLink';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import CaseLink from '@ncigdc/components/Links/CaseLink';
import { makeFilter } from '@ncigdc/utils/filters';
import ageDisplay from '@ncigdc/utils/ageDisplay';
import withRouter from '@ncigdc/utils/withRouter';
import { createDataCategoryColumns } from '@ncigdc/tableModels/utils';

import t from '@cqdg/locales/intl';
import Th from '@cqdg/components/table/Th';
import Td from '@cqdg/components/table/Td';
import TdNum from '@cqdg/components/table/TdNum';
import ThNum from '@cqdg/components/table/ThNum';

const youngestDiagnosis = (
  p: { age_at_diagnosis: number },
  c: { age_at_diagnosis: number },
): { age_at_diagnosis: number } =>
  (c.age_at_diagnosis < p.age_at_diagnosis ? c : p);

const dataCategoryColumns = createDataCategoryColumns({
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
});

const FilesLink = ({ node, fields = [], children }) =>
  (children === '0' ? (
    <span>0</span>
  ) : (
    <RepositoryFilesLink
      query={{
        filters: makeFilter([
          {
            field: 'study.study_id',
            value: [node.case_id],
          },
          ...fields,
        ]),
      }}
      >
      {children}
    </RepositoryFilesLink>
  ));

const getProjectIdFilter = projects =>
  makeFilter([
    {
      field: 'cases.study.study_id',
      value: projects.edges.map(({ node: p }) => p.study.hits.edges.node.study_id),
    },
  ]);

const casesTableModel = [
  // ...dataCategoryColumns,
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
    td: ({ node }) => <Td>{node.files && node.files.hits ? node.files.hits.total : 0}</Td>,
  },
];

export default casesTableModel;
