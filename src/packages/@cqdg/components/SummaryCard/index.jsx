// @flow

// Vendor
import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { compose, withPropsOnChange } from 'recompose';
import withSize from '@cqdg/utils/withSize';

// Custom
import StackLayout from 'cqdg-ui/core/layouts/StackLayout';
import NoResultsMessage from '@cqdg/components/NoResultsMessage';
import Table from '@cqdg/components/table/Table';
import Th from '@cqdg/components/table/Th';
import Tr from '@cqdg/components/table/Tr';
import Td from '@cqdg/components/table/Td';

import './style.css';

/*----------------------------------------------------------------------------*/

const SummaryCard = compose(
  withSize({ monitorHeight: true }),
  withPropsOnChange(['size'], ({ size }) => ({
    pieDiameter: Math.max(Math.min(size.width, size.height - 100), 120),
  })),
)(
  ({
    data,
    footer,
    headings,
    path,
    tableTitle,
    title,
    ...props
  }) => {
    console.log(data);
    return (
      <div className={`${props.className} test-summary-card`}>
        <StackLayout vertical>
          <StackLayout className="summary-card-title">
            <span
              style={{
                flexGrow: 1,
                fontSize: '1.7rem',
              }}
              >
              {tableTitle || title}
            </span>
          </StackLayout>
          {!data.length && <NoResultsMessage style={{ textAlign: 'center' }} />}

          {!!data.length && (
            <Table
              body={(
                <tbody>
                  {data.map((d, k) => (
                    <Tr
                      key={k}
                      >
                      {headings.map((h, i) => [].concat(get(d, h.key, '--')).map((v, j) => (
                        <Td
                          className={h.className || ''}
                          key={`${h.key}-${j}`}
                          style={{
                            ...(h.tdStyle || h.style || {}),
                          }}

                          >
                          {v || '--'}
                        </Td>
                      )))}
                    </Tr>
                  ))}
                </tbody>
              )}
              headings={headings.map(obj => (<Th key={obj.key} style={obj.style}>{obj.title}</Th>))}
              style={{
                overflow: 'hidden',
                borderLeft: 0,
                borderTop: 0,
              }}
              />
          )}
        </StackLayout>
      </div>
    );
  }
);

SummaryCard.propTypes = {
  data: PropTypes.array,
  footer: PropTypes.node,
  path: PropTypes.string,
  style: PropTypes.object,
  table: PropTypes.object,
  title: PropTypes.string,
};

/*----------------------------------------------------------------------------*/

export default SummaryCard;
