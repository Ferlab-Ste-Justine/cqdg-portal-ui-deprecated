// @flow
import reactSize from 'react-sizeme';

const withSize = (options = {}) =>
  reactSize({
    refreshRate: 200,
    ...options,
  });

export const WithSize = withSize()(({ children, size }) => children(size));

export default withSize;
