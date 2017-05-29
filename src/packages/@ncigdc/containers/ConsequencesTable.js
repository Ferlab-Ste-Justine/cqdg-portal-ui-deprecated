// @flow
import React from "react";
import Relay from "react-relay/classic";
import { compose, withPropsOnChange } from "recompose";
import { sortBy, groupBy, get, find } from "lodash";
import externalReferenceLinks from "@ncigdc/utils/externalReferenceLinks";
import EntityPageHorizontalTable
  from "@ncigdc/components/EntityPageHorizontalTable";
import { Tooltip } from "@ncigdc/uikit/Tooltip";
import { tableToolTipHint } from "@ncigdc/theme/mixins";
import CollapsibleList from "@ncigdc/uikit/CollapsibleList";
import GeneLink from "@ncigdc/components/Links/GeneLink";
import BubbleIcon from "@ncigdc/theme/icons/BubbleIcon";
import MinusIcon from "@ncigdc/theme/icons/Minus";
import PlusIcon from "@ncigdc/theme/icons/Plus";
import { ExternalLink } from "@ncigdc/uikit/Links";
import { withTheme } from "@ncigdc/theme";

const strandIconMap = {
  "-1": <MinusIcon />,
  // $FlowIgnore
  1: <PlusIcon />
};

type TProps = {
  consequenceDataGrouped: Object,
  theme: Object,
  functionalImpactTranscript: Object,
  canonicalTranscriptId: string
};

const ConsequencesTableComponent = compose(
  withTheme,
  withPropsOnChange(["node"], ({ node }) => {
    const consequenceOfInterest = node.consequence.hits.edges.find(
      consequence => get(consequence, "node.transcript.annotation.impact"),
      {}
    );
    const functionalImpactTranscript = get(
      consequenceOfInterest,
      "node.transcript",
      {}
    );

    const canonicalTranscriptId = (find(
      node.consequence.hits.edges,
      "node.transcript.is_canonical"
    ) || { node: { transcript: { transcript_id: "" } } }).node.transcript
      .transcript_id;

    const consequenceDataGrouped = groupBy(node.consequence.hits.edges, c => {
      const { transcript: t } = c.node;
      return `${t.gene.symbol}${t.aa_change}${t.consequence_type}${t.annotation.hgvsc}${t.gene.gene_strand}`;
    });

    return {
      functionalImpactTranscript,
      canonicalTranscriptId,
      consequenceDataGrouped
    };
  })
)(
  (
    {
      consequenceDataGrouped,
      canonicalTranscriptId,
      functionalImpactTranscript,
      theme
    }: TProps = {}
  ) => (
    <EntityPageHorizontalTable
      style={{ width: "100%", minWidth: "450px" }}
      headings={[
        { key: "symbol", title: "Gene" },
        {
          key: "aa_change",
          title: "AA Change",
          tdStyle: { wordBreak: "break-all", whiteSpace: "pre-line" }
        },
        {
          key: "consequence",
          title: (
            <Tooltip
              Component={"SO Term: consequence type"}
              style={tableToolTipHint()}
            >
              Consequence
            </Tooltip>
          )
        },
        {
          key: "coding_dna_change",
          title: "Coding DNA Change",
          tdStyle: { wordBreak: "break-all", whiteSpace: "pre-line" }
        },
        { key: "strand", title: "Strand" },
        { key: "transcripts", title: "Transcript(s)" }
      ]}
      data={Object.values(consequenceDataGrouped).map(d => {
        const first = d[0].node.transcript;
        const transcripts = d.map(n => n.node.transcript.transcript_id);
        return {
          symbol: (
            <GeneLink uuid={first.gene.gene_id}>{first.gene.symbol}</GeneLink>
          ),
          aa_change: first.aa_change,
          consequence: first.consequence_type,
          coding_dna_change: first.annotation.hgvsc,
          strand: first.gene.gene_strand
            ? strandIconMap[first.gene.gene_strand.toString(10)]
            : "--",
          transcripts: (
            <CollapsibleList
              data={sortBy(
                transcripts,
                t => t !== canonicalTranscriptId
              ).map(t => (
                <span>
                  <ExternalLink
                    key={t}
                    style={{
                      paddingRight: "0.5em",
                      fontWeight: t === functionalImpactTranscript.transcript_id
                        ? "bold"
                        : "normal"
                    }}
                    href={externalReferenceLinks.ensembl(t)}
                  >
                    {t}
                  </ExternalLink>
                  {t === canonicalTranscriptId &&
                    <BubbleIcon
                      text="C"
                      toolTipText="Canonical"
                      backgroundColor={theme.primary}
                    />}
                </span>
              ))}
            />
          )
        };
      })}
    />
  )
);

export const ConsequencesTableQuery = {
  fragments: {
    node: () => Relay.QL`
      fragment on Ssm {
        cosmic_id
        consequence {
          hits(first: 99) {
            edges {
              node {
                transcript {
                  transcript_id
                  aa_change
                  is_canonical
                  consequence_type
                  annotation {
                    hgvsc
                    impact
                  }
                  gene {
                    gene_id
                    symbol
                    gene_strand
                  }
                }
              }
            }
          }
        }
      }
    `
  }
};

const ConsequencesTable = Relay.createContainer(
  ConsequencesTableComponent,
  ConsequencesTableQuery
);

export default ConsequencesTable;