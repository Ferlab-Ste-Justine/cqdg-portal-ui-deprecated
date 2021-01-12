
const presetFilters = [
  {
    title: 'facet.study.name',
    field: 'study.short_name_keyword',
    full: 'study.short_name_keyword',
    type: 'keyword',
  },
  {
    field: 'study.domain',
    full: 'study.domain',
    type: 'keyword',
  },
  {
    field: 'gender',
    full: 'gender',
    type: 'keyword',
  },
  {
    field: 'ethnicity',
    full: 'ethnicity',
    type: 'keyword',
  },
  {
    field: 'age_at_recruitment',
    full: 'age_at_recruitment',
    type: 'long',
  },
  {
    field: 'diagnoses.age_at_diagnosis',
    full: 'diagnoses.age_at_diagnosis',
    type: 'long',
  },
  {
    field: 'vital_status',
    full: 'vital_status',
    type: 'keyword',
  },
  {
    title: 'facet.diagnoses.icd_term',
    field: 'diagnoses.icd_category_keyword',
    full: 'diagnoses.icd_category_keyword',
    type: 'keyword',
  },
  {
    title: 'facet.mondo.term',
    field: 'diagnoses.mondo_term_keyword',
    full: 'diagnoses.mondo_term_keyword',
    type: 'keyword',
  },
  {
    title: 'facet.hpo.category',
    field: 'phenotypes.hpo_category_keyword',
    full: 'phenotypes.hpo_category_keyword',
    type: 'keyword',
  },
  {
    title: 'facet.hpo.term',
    field: 'phenotypes.hpo_term_keyword',
    full: 'phenotypes.hpo_term_keyword',
    type: 'keyword',
  },
];

export default presetFilters;
