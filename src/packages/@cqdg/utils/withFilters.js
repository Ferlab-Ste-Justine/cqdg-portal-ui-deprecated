// @flow

import { withPropsOnChange, compose } from 'recompose';

import withRouter from '@cqdg/utils/withRouter';
import { parseJSONParam } from '@cqdg/utils/uri';

type TArgs = {
  propName: string;
  defaults: mixed;
};
export default ({ defaults = null, propName = 'filters' }: TArgs = {}) =>
  compose(
    withRouter,
    withPropsOnChange(
      ({ location }, { location: previousLocation }) =>
        location.search !== previousLocation.search,
      ({ query: { filters } }) => ({
        [propName]: parseJSONParam(filters, defaults),
      }),
    ),
  );
