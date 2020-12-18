/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay/classic';
import { connect } from 'react-redux';
import { parse } from 'query-string';

import { handleStateChange } from '@cqdg/store/dux/relayProgress';
import RepositoryPage from '@cqdg/pages/FileRepository/FileRepositoryPage';
import {
  repoPageCaseToFileFiltersMapping,
  repoPageFileToCaseFiltersMapping,
} from '@cqdg/pages/FileRepository/FilterMapping';
import {
  parseIntParam,
  parseFilterParam,
  parseJSONParam,
} from '@cqdg/utils/uri';

import { mapFilter } from '@cqdg/utils/filters';
import { viewerQuery } from '../../../@ncigdc/routes/queries';

class RepositoryRoute extends Relay.Route {
  static routeName = 'RepositoryRoute';

  static queries = viewerQuery;

  static prepareParams = ({ location: { search } }) => {
    const q = parse(search);

    const fileFilters = parseFilterParam(q.filters, null);
    const caseFilters = parseFilterParam(q.filters, null);

    mapFilter(fileFilters, repoPageCaseToFileFiltersMapping);
    mapFilter(caseFilters, repoPageFileToCaseFiltersMapping);

    return {
      cases_offset: parseIntParam(q.cases_offset, 0),
      cases_size: parseIntParam(q.cases_size, 20),
      cases_sort: parseJSONParam(q.cases_sort, null),
      files_offset: parseIntParam(q.files_offset, 0),
      files_size: parseIntParam(q.files_size, 20),
      files_sort: parseJSONParam(q.files_sort, null),
      caseFilters,
      fileFilters,
    };
  };
}

export default connect()((props: mixed) => (
  <Relay.Renderer
    Container={RepositoryPage}
    environment={Relay.Store}
    onReadyStateChange={handleStateChange(props)}
    queryConfig={new RepositoryRoute(props)}
    />
));
