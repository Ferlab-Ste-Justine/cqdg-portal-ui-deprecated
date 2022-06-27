const filters = [
  {
    full: 'file_id',
    title: 'facet.file',
    type: 'keyword',
  },
  {
    full: 'data_category',
    type: 'keyword',
  },
  {
    full: 'data_type',
    type: 'keyword',
  },
  {
    full: 'is_harmonized',
    type: 'choice',
  },
  {
    full: 'experimental_strategy',
    type: 'keyword',
  },
  {
    full: 'file_format',
    type: 'keyword',
  },
  {
    full: 'platform',
    type: 'keyword',
  },
  {
    full: 'data_access',
    type: 'keyword',
  },
];

const presetFilters = filters.map(f => ({
  ...f,
  field: f.full.replace(/__/g, '.'),
}));

export default presetFilters;
