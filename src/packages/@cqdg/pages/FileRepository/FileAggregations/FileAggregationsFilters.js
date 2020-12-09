import t from '@cqdg/locales/intl';

const presetFilters = [
  {
    title: 'facet.file',
    field: 'file_id',
    full: 'file_id',
    type: 'keyword',
  },
  {
    field: 'data_category',
    full: 'data_category',
    type: 'keyword',
  },
  {
    field: 'data_type',
    full: 'data_type',
    type: 'keyword',
  },
  {
    field: 'is_harmonized',
    full: 'is_harmonized',
    type: 'choice',
  },
  {
    field: 'experimental_strategy',
    full: 'experimental_strategy',
    type: 'keyword',
  },
  {
    field: 'file_format',
    full: 'file_format',
    type: 'keyword',
  },
  {
    field: 'platform',
    full: 'platform',
    type: 'keyword',
  },
  {
    field: 'data_access',
    full: 'data_access',
    type: 'keyword',
  },
];

export default presetFilters;
