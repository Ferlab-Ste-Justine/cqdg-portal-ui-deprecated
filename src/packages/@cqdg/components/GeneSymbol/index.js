import PropTypes from 'prop-types';
import LoadableWithLoading from '@cqdg/relay/ui/LoadableWithLoading';
import createRenderer from './GeneSymbol.relay';

const Component = LoadableWithLoading({
  loader: () => import('./GeneSymbol'),
});

const GeneSymbol = createRenderer(Component);
GeneSymbol.propTypes = {
  geneId: PropTypes.string,
};
export default GeneSymbol;
