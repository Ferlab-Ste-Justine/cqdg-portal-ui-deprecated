/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Tab } from 'cqdg-ui/core/containers/tabs';

import 'cqdg-ui/core/containers/tabs/Tabs.css';

const Tabs = ({
  defaultContent = <div>No Tabs</div>,
  preSelectedTab,
  defaultIndex = 0,
  panes,
  queryParam,
  side,
  tabToolbar,
  type,
  forceResetTable,
  containerClassName,
} = {}) => {
  const selectedTab = panes.find((p) => p.id === preSelectedTab) || panes[defaultIndex];
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
};

export default Tabs;
