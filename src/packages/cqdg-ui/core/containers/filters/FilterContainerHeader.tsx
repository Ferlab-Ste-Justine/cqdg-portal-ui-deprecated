import React from 'react';

import AngleIcon from 'react-icons/lib/fa/angle-down';
import GoSearch from 'react-icons/lib/go/search';
import QuestionIcon from 'react-icons/lib/go/question';
import CloseIcon from 'react-icons/lib/md/close';

import { Tooltip } from '@cqdg/components/Tooltip';
import StackLayout from 'cqdg-ui/core/layouts/StackLayout';

import './FilterContainerHeader.css';

interface IFilterContainerHeaderProps {
  collapsed?: boolean;
  onRemoveFilterContainer: (event?: React.SyntheticEvent<EventTarget>) => void;
  searchEnabled?: boolean;
  helpTooltip?: null | string | React.Component;
  isRemovable?: boolean;
  mouseOverTooltip: null | string | React.Component;
  onClick: (v: boolean) => void;
  onSearchClick: (v: boolean) => void;
  searchInputVisibled: boolean;
  title: string;
}

const FilterContainerHeader = ({
  collapsed = false,
  searchEnabled = false,
  helpTooltip = null,
  isRemovable = false,
  mouseOverTooltip = null,
  onClick,
  onRemoveFilterContainer = () => {},
  onSearchClick = () => { },
  searchInputVisibled,
  title,
}: IFilterContainerHeaderProps) => (
  <StackLayout className={`fui-filters-container-header ${collapsed ? 'collapsed' : ''}`}>
    <Tooltip
      className="title"
      Component={
            mouseOverTooltip ? (
              <div>{mouseOverTooltip}</div>
                  ) : null
                }
      >
      <div onClick={() => onClick(!collapsed)} role="button">

        <AngleIcon
          className={`angle-icon ${collapsed && 'collapsed'}`}
          />
        {title}
      </div>
    </Tooltip>

    {helpTooltip && (
      <Tooltip Component={helpTooltip}>
        <QuestionIcon />
      </Tooltip>
    )}
    {searchEnabled && (
      <GoSearch
        onClick={() => onSearchClick(!searchInputVisibled)}
        />
    )}
    {isRemovable && (
      <CloseIcon
        aria-label="Close"
        className="close-icon"
        onClick={onRemoveFilterContainer}
        onKeyPress={event => event.key === 'Enter' && onRemoveFilterContainer()}
        role="button"
        tabIndex={0}
        />
    )}
  </StackLayout>
);

export default FilterContainerHeader;
