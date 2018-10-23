/* @flow */

import { TUriQuery } from '@ncigdc/utils/uri/types';
import { TMergeQuery, TMergeEnum } from '@ncigdc/utils/filters/types';
import { TRemoveEmptyKeys } from '@ncigdc/utils/removeEmptyKeys';

export type TListLinkProps = {
  children?: mixed,
  merge?: TMergeEnum,
  mergeQuery?: TMergeQuery,
  pathname?: string,
  query?: TUriQuery,
  removeEmptyKeys?: TRemoveEmptyKeys,
  whitelist?: Array<string>,
};

export type TIdLinkProps = {
  uuid: string,
} & TListLinkProps;

export type TLinkProps = TListLinkProps | TIdLinkProps;
