/* @flow */

import React from 'react';
import {
  compose,
  defaultProps,
  setDisplayName,
} from 'recompose';

import AngleIcon from 'react-icons/lib/fa/angle-down';
import GoSearch from 'react-icons/lib/go/search';
import QuestionIcon from 'react-icons/lib/go/question';
import CloseIcon from 'react-icons/lib/md/close';

import { Tooltip } from '@cqdg/components/Tooltip';
import { internalHighlight } from '@ncigdc/uikit/Highlight';
import StackLayout from 'cqdg-ui/core/layouts/StackLayout';

import './FilterContainerHeader.css';

const FacetHeader = ({
  angleIconRight = false,
  collapsed,
  description,
  DescriptionComponent,
  handleRequestRemove,
  hasValueSearch,
  isRemovable,
  searchValue,
  setCollapsed,
  setShowingValueSearch,
  showingValueSearch,
  title,
}) => {
  const spanStyle = { cursor: 'pointer' };
  if (angleIconRight) {
    spanStyle.width = '100%';
  }
  return (
    <div
      className={`fui-filters-container-header ${collapsed ? 'collapsed' : ''}`}
      >
      <StackLayout onClick={() => setCollapsed(!collapsed)}>
        <Tooltip
          Component={
                  DescriptionComponent ? (
                    <div style={{ maxWidth: '24em' }}>{DescriptionComponent}</div>
                  ) : null
                }
          >
          {!angleIconRight && (
            <AngleIcon
              style={{
                transform: `rotate(${collapsed ? 270 : 0}deg)`,
              }}
              />
          )}
          {searchValue
                  ? internalHighlight(searchValue, title, {
                    backgroundColor: '#FFFF00',
                  })
                  : title}
          {angleIconRight && (
            <AngleIcon
              style={{
                display: 'flex',
                float: 'right',
                overflow: 'auto',
                transform: `rotate(${collapsed ? 270 : 0}deg)`,
              }}
              />
          )}
        </Tooltip>
      </StackLayout>
      <StackLayout>
        {description && (
          <Tooltip
            Component={description}
            >
            <QuestionIcon />
          </Tooltip>
        )}
        {hasValueSearch && (
          <GoSearch
            onClick={() => setShowingValueSearch(!showingValueSearch)}
            />
        )}
        {isRemovable && (
          <CloseIcon
            aria-label="Close"
            className="close-icon"
            onClick={handleRequestRemove}
            onKeyPress={event => event.key === 'Enter' && handleRequestRemove()}
            role="button"
            tabIndex="0"
            />
        )}
      </StackLayout>
    </div>
  );
};

export default compose(
  setDisplayName('EnhancedFacetHeader'),
  defaultProps({
    handleRequestRemove: () => { },
    hasValueSearch: false,
    isRemovable: false,
    setShowingValueSearch: () => { },
  }),
)(FacetHeader);
