import React from 'react';
import { parse, stringify } from 'query-string';
import debounce from 'lodash/debounce';

import { parseIntParam } from '@ncigdc/utils/uri';
import withRouter from '@ncigdc/utils/withRouter';

import {
  compose, setDisplayName,
} from 'recompose';


import './ScrollableTable.css';

const ScrollableTable = ({
  children, className, history, item, itemToLoad = 20, resetScroll,
}) => {
  let scrollHander = null;

  const scrolledDiv = document.getElementById('table-scroll');
  if (scrolledDiv && resetScroll) {
    scrolledDiv.scrollTop = 0;
  }

  return (
    <div className="table-scrollable-container">
      <div
        className={`table-scrollable ${className}`}
        id="table-scroll"
        onScroll={(e) => {
          e.persist();

          if (!scrollHander) {
            scrollHander = debounce(() => {
              const isNearBottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50;
              if (isNearBottom) {
                const q = parse(window.location.search);
                const offsetSize = parseIntParam(q[item], itemToLoad);
                q[item] = offsetSize + itemToLoad;
                const stringified = stringify(q);
                history.push(`${window.location.pathname}?${stringified}`);
              }
            }, 150);
          }
          scrollHander();
        }}
        >
        {children}
      </div>
      <div className="scroll-overlay" />
    </div>
  );
};

export default compose(
  setDisplayName('ScrollableTable'),
  withRouter,
)(ScrollableTable);
