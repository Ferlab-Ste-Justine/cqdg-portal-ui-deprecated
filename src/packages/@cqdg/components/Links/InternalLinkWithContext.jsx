/* @flow */
import React from 'react';
import { createLinkContext } from '@cqdg/components/Links/linkUtils';

import { mergeQuery as mq } from '@cqdg/utils/filters';

import {
} from '@cqdg/store/query';
import InternalLink from './InternalLink';

import { TLinkProps } from './types';

const InternalLinkWithContext = ({
  forceResetOffset = false,
  merge,
  mergeQuery = mq,
  pathname,
  query,
  whitelist,
  ...rest
}: TLinkProps) => {
  const { location } = window;
  const pn = pathname || location.pathname;
  const contextQuery = createLinkContext(query, mergeQuery, merge, whitelist, forceResetOffset);
  return (
    <InternalLink pathname={pn} query={contextQuery} {...rest} />
  );
};

// InternalLinkWithContext.defaultProps = {
//   mergeQuery: mq,
// };

export default InternalLinkWithContext;
