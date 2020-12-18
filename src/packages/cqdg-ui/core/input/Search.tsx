import React from 'react';
import SearchIcon from 'react-icons/lib/fa/search';
import IoIosInformationCircleOutline from 'react-icons/lib/io/ios-informatoutline';
import { Tooltip } from '@cqdg/components/Tooltip';

import './Search.css';

interface ISearch {
  getNode: (() => React.RefObject<HTMLElement>) | undefined;
  ariaLabel: string;
  type: string;
  // position: TooltipPosition;
  tooltip: string;
}

const Search = ({
  ariaLabel = 'text', getNode, tooltip, ...props
}: ISearch) => (
  <div className="fui-input-search">
    <SearchIcon className="extra search" />
    <input
    // eslint-disable-next-line react/jsx-props-no-spreading
      {...props} // default input Props
      aria-label={ariaLabel}
      ref={getNode}
      type="text"
      />
    {tooltip && (
      <Tooltip className="extra tooltip" Component={<div>{tooltip}</div>}>
        <IoIosInformationCircleOutline className="tooltip-icon" />
      </Tooltip>
    )}
  </div>
);

export default Search;
