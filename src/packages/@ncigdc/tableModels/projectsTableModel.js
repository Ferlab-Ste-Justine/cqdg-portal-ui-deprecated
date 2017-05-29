// @flow
import React from "react";
import {
  RepositoryCasesLink,
  RepositoryFilesLink
} from "@ncigdc/components/Links/RepositoryLink";
import ProjectLink from "@ncigdc/components/Links/ProjectLink";
import { Th, Td } from "@ncigdc/uikit/Table";
import { findDataCategory, CATEGORY_MAP } from "@ncigdc/utils/data";
import { makeFilter } from "@ncigdc/utils/filters";
import formatFileSize from "@ncigdc/utils/formatFileSize";
import withRouter from "@ncigdc/utils/withRouter";
import styled from "@ncigdc/theme/styled";

const NumTh = styled(Th, { textAlign: "right" });
const NumTd = styled(Td, { textAlign: "right" });

type TLinkProps = { node: Object, fields?: Array<Object>, children?: mixed };
type TLink = (props: TLinkProps) => any;

const CasesLink: TLink = ({ node, fields = [], children }) =>
  children === "0"
    ? <span>0</span>
    : <RepositoryCasesLink
        query={{
          filters: makeFilter(
            [
              { field: "cases.project.project_id", value: [node.project_id] },
              ...fields
            ],
            false
          )
        }}
      >
        {children}
      </RepositoryCasesLink>;

const getProjectIdFilter = projects =>
  makeFilter(
    [
      {
        field: "cases.project.project_id",
        value: projects.edges.map(({ node: p }) => p.project_id)
      }
    ],
    false
  );

const projectsTableModel = [
  {
    name: "Project ID",
    id: "project_id",
    sortable: true,
    downloadable: true,
    th: <Th key="project_id" rowSpan="2">Project ID</Th>,
    td: ({ node }) => (
      <Td key="project_id">
        <ProjectLink uuid={node.project_id}>
          {node.project_id}
        </ProjectLink>
      </Td>
    )
  },
  {
    name: "Disease Type",
    id: "disease_type",
    sortable: true,
    downloadable: true,
    th: <Th key="disease_type" rowSpan="2">Disease Type</Th>,
    td: ({ node }) => (
      <Td key={node.disease_type} style={{ whiteSpace: "normal" }}>
        {node.disease_type}
      </Td>
    )
  },
  {
    name: "Primary Site",
    id: "primary_site",
    sortable: true,
    downloadable: true,
    th: <Th key="primary_site" rowSpan="2">Primary Site</Th>,
    td: ({ node }) => <Td key="primary_site">{node.primary_site}</Td>
  },
  {
    name: "Program",
    id: "program.name",
    sortable: true,
    downloadable: true,
    th: <Th key="program" rowSpan="2">Program</Th>,
    td: ({ node }) => <Td key="program">{node.program.name}</Td>
  },
  {
    name: "Cases",
    id: "summary.case_count",
    sortable: true,
    downloadable: true,
    th: <NumTh key="cases" rowSpan="2">Cases</NumTh>,
    td: ({ node }) => (
      <NumTd key="cases">
        <CasesLink
          node={node}
          fields={[{ field: "files.data_category", value: CATEGORY_MAP.Seq }]}
        >
          {node.summary.case_count.toLocaleString()}
        </CasesLink>
      </NumTd>
    ),
    total: withRouter(({ hits, query }) => (
      <NumTd>
        <RepositoryCasesLink
          query={{
            filters: query.filters ? getProjectIdFilter(hits) : null
          }}
        >
          {hits.edges
            .reduce((acc, val) => acc + val.node.summary.case_count, 0)
            .toLocaleString()}
        </RepositoryCasesLink>
      </NumTd>
    ))
  },
  {
    name: "Data Categories",
    id: "data_category",
    th: (
      <Th key="data_category" colSpan="6" style={{ textAlign: "center" }}>
        Available Cases per Data Category
      </Th>
    ),
    subHeadingIds: ["seq", "exp", "snv", "cnv", "clinical", "bio"]
  },
  {
    name: "Seq",
    id: "seq",
    subHeading: true,
    parent: "data_category",
    th: <NumTh key="seq">Seq</NumTh>,
    td: ({ node }) => (
      <NumTd key="seq">
        <CasesLink
          node={node}
          fields={[{ field: "files.data_category", value: CATEGORY_MAP.Seq }]}
        >
          {findDataCategory(
            "Seq",
            node.summary.data_categories
          ).case_count.toLocaleString()}
        </CasesLink>
      </NumTd>
    ),
    total: ({ hits }) => (
      <NumTd>
        <RepositoryCasesLink
          query={{
            filters: makeFilter(
              [
                {
                  field: "cases.project.project_id",
                  value: hits.edges.map(({ node: p }) => p.project_id)
                },
                { field: "files.data_category", value: CATEGORY_MAP.Seq }
              ],
              false
            )
          }}
        >
          {hits.edges
            .reduce(
              (acc, val) =>
                acc +
                findDataCategory("Seq", val.node.summary.data_categories)
                  .case_count,
              0
            )
            .toLocaleString()}
        </RepositoryCasesLink>
      </NumTd>
    )
  },
  {
    name: "Exp",
    id: "exp",
    subHeading: true,
    parent: "data_category",
    th: <NumTh key="exp">Exp</NumTh>,
    td: ({ node }) => (
      <NumTd key="exp">
        <CasesLink
          node={node}
          fields={[{ field: "files.data_category", value: CATEGORY_MAP.Exp }]}
        >
          {findDataCategory(
            "Exp",
            node.summary.data_categories
          ).case_count.toLocaleString()}
        </CasesLink>
      </NumTd>
    ),
    total: ({ hits }) => (
      <NumTd>
        <RepositoryCasesLink
          query={{
            filters: makeFilter(
              [
                {
                  field: "cases.project.project_id",
                  value: hits.edges.map(({ node: p }) => p.project_id)
                },
                { field: "files.data_category", value: CATEGORY_MAP.Exp }
              ],
              false
            )
          }}
        >
          {hits.edges
            .reduce(
              (acc, val) =>
                acc +
                findDataCategory("Exp", val.node.summary.data_categories)
                  .case_count,
              0
            )
            .toLocaleString()}
        </RepositoryCasesLink>
      </NumTd>
    )
  },
  {
    name: "Snv",
    id: "snv",
    subHeading: true,
    parent: "data_category",
    th: <NumTh key="snv">SNV</NumTh>,
    td: ({ node }) => (
      <NumTd key="snv">
        <CasesLink
          node={node}
          fields={[{ field: "files.data_category", value: CATEGORY_MAP.SNV }]}
        >
          {findDataCategory(
            "SNV",
            node.summary.data_categories
          ).case_count.toLocaleString()}
        </CasesLink>
      </NumTd>
    ),
    total: ({ hits }) => (
      <NumTd>
        <RepositoryCasesLink
          query={{
            filters: makeFilter(
              [
                {
                  field: "cases.project.project_id",
                  value: hits.edges.map(({ node: p }) => p.project_id)
                },
                { field: "files.data_category", value: CATEGORY_MAP.SNV }
              ],
              false
            )
          }}
        >
          {hits.edges
            .reduce(
              (acc, val) =>
                acc +
                findDataCategory("SNV", val.node.summary.data_categories)
                  .case_count,
              0
            )
            .toLocaleString()}
        </RepositoryCasesLink>
      </NumTd>
    )
  },
  {
    name: "Cnv",
    id: "cnv",
    subHeading: true,
    parent: "data_category",
    th: <NumTh key="cnv">CNV</NumTh>,
    td: ({ node }) => (
      <NumTd key="cnv">
        <CasesLink
          node={node}
          fields={[{ field: "files.data_category", value: CATEGORY_MAP.CNV }]}
        >
          {findDataCategory(
            "CNV",
            node.summary.data_categories
          ).case_count.toLocaleString()}
        </CasesLink>
      </NumTd>
    ),
    total: ({ hits }) => (
      <NumTd>
        <RepositoryCasesLink
          query={{
            filters: makeFilter(
              [
                {
                  field: "cases.project.project_id",
                  value: hits.edges.map(({ node: p }) => p.project_id)
                },
                { field: "files.data_category", value: CATEGORY_MAP.CNV }
              ],
              false
            )
          }}
        >
          {hits.edges
            .reduce(
              (acc, val) =>
                acc +
                findDataCategory("CNV", val.node.summary.data_categories)
                  .case_count,
              0
            )
            .toLocaleString()}
        </RepositoryCasesLink>
      </NumTd>
    )
  },
  {
    name: "Clinical",
    id: "clinical",
    subHeading: true,
    parent: "data_category",
    th: <NumTh key="clinical">Clinical</NumTh>,
    td: ({ node }) => (
      <NumTd key="clinical">
        <CasesLink
          node={node}
          fields={[
            { field: "files.data_category", value: CATEGORY_MAP.Clinical }
          ]}
        >
          {findDataCategory(
            "Clinical",
            node.summary.data_categories
          ).case_count.toLocaleString()}
        </CasesLink>
      </NumTd>
    ),
    total: ({ hits }) => (
      <NumTd>
        <RepositoryCasesLink
          query={{
            filters: makeFilter(
              [
                {
                  field: "cases.project.project_id",
                  value: hits.edges.map(({ node: p }) => p.project_id)
                },
                { field: "files.data_category", value: CATEGORY_MAP.Clinical }
              ],
              false
            )
          }}
        >
          {hits.edges
            .reduce(
              (acc, val) =>
                acc +
                findDataCategory("Clinical", val.node.summary.data_categories)
                  .case_count,
              0
            )
            .toLocaleString()}
        </RepositoryCasesLink>
      </NumTd>
    )
  },
  {
    name: "Bio",
    id: "bio",
    subHeading: true,
    parent: "data_category",
    th: <NumTh key="bio">Bio</NumTh>,
    td: ({ node }) => (
      <NumTd key="bio">
        <CasesLink
          node={node}
          fields={[{ field: "files.data_category", value: CATEGORY_MAP.Bio }]}
        >
          {findDataCategory(
            "Bio",
            node.summary.data_categories
          ).case_count.toLocaleString()}
        </CasesLink>
      </NumTd>
    ),
    total: ({ hits }) => (
      <NumTd>
        <RepositoryCasesLink
          query={{
            filters: makeFilter(
              [
                {
                  field: "cases.project.project_id",
                  value: hits.edges.map(({ node: p }) => p.project_id)
                },
                { field: "files.data_category", value: CATEGORY_MAP.Bio }
              ],
              false
            )
          }}
        >
          {hits.edges
            .reduce(
              (acc, val) =>
                acc +
                findDataCategory("Bio", val.node.summary.data_categories)
                  .case_count,
              0
            )
            .toLocaleString()}
        </RepositoryCasesLink>
      </NumTd>
    )
  },
  {
    name: "Files",
    id: "summary.file_count",
    sortable: true,
    downloadable: true,
    th: <NumTh key="files" rowSpan="2">Files</NumTh>,
    td: ({ node }) => (
      <NumTd key="files">
        <RepositoryFilesLink
          query={{
            filters: makeFilter(
              [{ field: "cases.project.project_id", value: node.project_id }],
              false
            )
          }}
        >
          {node.summary.file_count.toLocaleString()}
        </RepositoryFilesLink>
      </NumTd>
    ),
    total: withRouter(({ hits, query }) => (
      <NumTd>
        <RepositoryFilesLink
          query={{
            filters: query.filters ? getProjectIdFilter(hits) : null
          }}
        >
          {hits.edges
            .reduce((acc, val) => acc + val.node.summary.file_count, 0)
            .toLocaleString()}
        </RepositoryFilesLink>
      </NumTd>
    ))
  },
  {
    name: "File size",
    id: "summary.file_size",
    sortable: true,
    hidden: true,
    downloadable: true,
    th: <NumTh key="file_size" rowSpan="2">File Size</NumTh>,
    td: ({ node }) => (
      <NumTd key="file_size">
        {formatFileSize(node.summary.file_size)}
      </NumTd>
    ),
    total: ({ hits }) => (
      <NumTd>
        {formatFileSize(
          hits.edges.reduce((acc, val) => acc + val.node.summary.file_size, 0)
        )}
      </NumTd>
    )
  }
];

export default projectsTableModel;