
import t from '@cqdg/locales/intl';

const facetFieldDisplayMapper = field => {
  const map = {
    'genes.symbol': 'Gene Symbol',
    'genes.gene_id': 'Gene',
    'cases.case_id': 'Case'
  };
  return t(`aggregation.${map[field]}`) || t(`aggregation.${field}`) || map[field] || field;
};

export default facetFieldDisplayMapper;