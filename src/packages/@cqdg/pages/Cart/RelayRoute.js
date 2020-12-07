/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay/classic';
import { parse } from 'query-string';
import { connect } from 'react-redux';

import { handleStateChange } from '@ncigdc/dux/relayProgress';
import { parseIntParam, parseJSONParam } from '@ncigdc/utils/uri';
import { setFilter } from '@ncigdc/utils/filters';
import CartPage from './CartPage';

class CartRoute extends Relay.Route {
  static routeName = 'CartRoute';

  static queries = {
    viewer: () => Relay.QL`query { viewer }`,
  };

  static prepareParams = ({ files, location: { search } }) => {
    const q = parse(search);
    const fileIds = files.map(f => f.file_id);

    return {
      files_offset: parseIntParam(q.files_offset, 0),
      files_size: parseIntParam(q.files_size, 20),
      files_sort: parseJSONParam(q.files_sort, null),
      cart_file_filters: files.length
        ? setFilter({
          field: 'file_id',
          value: fileIds,
        })
        : null,
      cart_case_filters: files.length
        ? setFilter({
          field: 'files.file_id',
          value: fileIds,
        })
        : null,
    };
  };
}

export default connect(state => state.cart)((props: mixed) => (
  <Relay.Renderer
    Container={CartPage}
    environment={Relay.Store}
    onReadyStateChange={handleStateChange(props)}
    queryConfig={new CartRoute(props)}
    />
));
