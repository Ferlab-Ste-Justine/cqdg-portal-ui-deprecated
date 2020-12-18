/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import LocationSubscriber from '@ncigdc/components/LocationSubscriber';
import { Tab } from 'cqdg-ui/core/containers/tabs';

import 'cqdg-ui/core/containers/tabs/Tabs.css';

const Tabs: TTabbedLinks = ({
  defaultContent = <div>No Tabs</div>,
  defaultIndex = 0,
  panes,
  queryParam,
  side,
  tabToolbar,
  type,
  forceResetTable,
  containerClassName,
} = {}) => (
  <LocationSubscriber>
    {(ctx: { pathname: string; query: IRawQuery }) => {
      const selectedTab = panes.find((p) => p.id === ctx.query[queryParam]) || panes[defaultIndex];
      if (!selectedTab) return defaultContent;
      return (
        <Tab
          activeKey={selectedTab.id}
          containerClassName={containerClassName}
          forceResetTable={forceResetTable}
          panes={panes}
          side={side}
          tabsKey={queryParam}
          tabToolbar={tabToolbar}
          type={type}
          >
          {selectedTab.component}
        </Tab>
      );
    }}
  </LocationSubscriber>
);

export default Tabs;
