/* @flow */

import React from 'react';
import _ from 'lodash';
import { NavLink as Link } from 'react-router-dom';
import { stringify } from 'query-string';
import { stringifyJSONParam } from '@cqdg/utils/uri';
import { removeEmptyKeys } from '@cqdg/utils/object';

import validAttributes from '@cqdg/components/Links/validAttributes';
import { scrollToId } from '@cqdg/components/Links/deepLink';
import { createSearchQuery } from '@cqdg/components/Links/linkUtils';

import { TLinkProps } from './types';

const reactRouterLinkProps = [
  'to',
  'replace',
  'activeClassName',
  'activeStyle',
  'exact',
  'strict',
  'isActive',
];

const InternalLink = ({
  deepLink,
  pathname,
  query,
  search,
  ...rest
}: TLinkProps) => {
  const searchQuery = createSearchQuery(query, search);

  const validAttrProps = validAttributes(rest);
  const validLinkProps = _.pick(rest, reactRouterLinkProps);

  return (
    <Link
      to={{
        pathname,
        search: searchQuery,
      }}
      {...validAttrProps}
      {...validLinkProps}
      onClick={event => {
        if (validAttrProps.onClick) {
          validAttrProps.onClick(event);
        }
        if (deepLink) {
          scrollToId(deepLink);
        }
      }}
      />
  );
};

export default InternalLink;
