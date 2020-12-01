import React from 'react';
import { compose, withHandlers } from 'recompose';

import GoThreeBar from 'react-icons/lib/go/three-bars';
import Button from '@ferlab-ui/core/buttons/button';
import t from '@cqdg/locales/intl';
import Link from '@ferlab-ui/core/buttons/link';

import './SidePanel.css';

const SidePanel = ({
  children, collapsedStatus, onRef, toggleCollapseStatus,
}) => {
  return (
    <div className={`side-panel ${collapsedStatus() ? 'side-panel-collapsed' : ''}`} ref={onRef}>
      <div className="side-panel-header">
        <Button onClick={() => toggleCollapseStatus()} type="text">
          <GoThreeBar />
        </Button>
      </div>
      <div className="side-panel-content">{children}</div>
      <div className="side-panel-footer">
        <Link defaultIcon={false} href="mailto:support@cqdg.ca">{t('short_footer.info')}</Link>
        <div className="spacer" />
        <Link defaultIcon={false} href={t('footer.logo.genome.link')} target="_blank">
          Génome Québec
        </Link>
        <div className="spacer" />
        <Link defaultIcon={false} href={t('footer.logo.chusj.link')} target="_blank">
          CHU Sainte-Justine
        </Link>
      </div>
    </div>
  );
};

export default compose(
  withHandlers((props) => {
    let myRef = null;
    let isCollapsed = props.isCollapsed || false;
    return {
      onRef: () => (ref) => { myRef = ref; },
      collapsedStatus: () => () => isCollapsed,
      toggleCollapseStatus: () => () => {
        isCollapsed = !isCollapsed;
        myRef.classList.toggle('side-panel-collapsed');
      },
    };
  })
)(SidePanel);
