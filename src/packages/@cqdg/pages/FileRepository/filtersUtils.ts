import includes from 'lodash/includes';
import some from 'lodash/some';

import { IFilterGroup } from 'cqdg-ui/core/containers/filters/Filters';

export const getFacetType = (facet: IFilterGroup) => {
  let type = 'terms';

  if (facet.type === 'choice' || facet.type === 'terms' || facet.type === 'exact') {
    type = facet.type;
  }

  if (some([
    '_id',
    '_uuid',
    'md5sum',
    'file_name',
  ], idSuffix => includes(facet.field, idSuffix))) {
    type = 'exact';
  }

  if (facet.type === 'long' || facet.type === 'float') {
    type = 'range';
  }

  facet.visualType = type;
  return facet;
};
