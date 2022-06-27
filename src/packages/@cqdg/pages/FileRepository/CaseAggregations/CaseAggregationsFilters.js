import t from '@cqdg/locales/intl';

const filters = [
  {
    title: 'facet.study.name',
    full: 'study.short_name_keyword',
    type: 'keyword',
  },
  {
    full: 'study.domain',
    type: 'keyword',
  },
  {
    full: 'gender',
    type: 'keyword',
  },
  {
    full: 'ethnicity',
    type: 'keyword',
  },
  {
    full: 'age_at_recruitment',
    type: 'long',
    range: {
      rangeTypes: [
        {
          key: 'years',
          name: t('facet.range.years'),
        },
        {
          key: 'days',
          name: t('facet.range.days'),
        },
      ],
    },
  },
  {
    full: 'diagnoses.age_at_diagnosis',
    type: 'long',
    range: {
      rangeTypes: [
        {
          key: 'years',
          name: t('facet.range.years'),
        },
        {
          key: 'days',
          name: t('facet.range.days'),
        },
      ],
    },
  },
  {
    full: 'vital_status',
    type: 'keyword',
  },
  {
    title: 'facet.diagnoses.icd_term',
    full: 'diagnoses.icd_category_keyword',
    type: 'keyword',
  },
  {
    title: 'facet.mondo.term',
    full: 'diagnoses.mondo_term_keyword',
    type: 'keyword',
  },
  {
    title: 'facet.hpo.category',
    full: 'phenotypes.hpo_category_keyword',
    type: 'keyword',
  },
  {
    title: 'facet.hpo.term',
    full: 'phenotypes.hpo_term_keyword',
    type: 'keyword',
  },
];

const presetFilters = filters.map(f => ({
  ...f,
  field: f.full.replace(/__/g, '.'),
}));

export default presetFilters;
