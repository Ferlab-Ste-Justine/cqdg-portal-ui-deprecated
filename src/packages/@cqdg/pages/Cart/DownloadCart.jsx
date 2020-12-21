import React from 'react';
import MdFileDownload from 'react-icons/lib/md/file-download';
import t from '@cqdg/locales/intl';

import { downloadToTSV } from '@cqdg/components/table/button/DownloadTableButton';

import Dropdown from '@cqdg/components/Dropdown';
import DropdownItem from '@cqdg/components/Dropdown/DropdownItem';

import Button from 'cqdg-ui/core/buttons/button';

const DownloadCart =
  ({
    children,
    className = '',
    excludedColumns,
    filename,
    isDisabled = false,
    selector,
  }) => (
    <Dropdown
      button={(
        <Button
          className={`${className} ${isDisabled ? 'disabled' : ''}`}
          type="secondary"
          >
          <MdFileDownload height="14px" width="14px" />
          {children}
        </Button>
      )}
      isDisabled={isDisabled}
      >
      <DropdownItem
        style={{
          color: '#18486B',
          lineHeight: '1.5',
          ':hover': {
            cursor: 'pointer',
            color: '#18486B',
          },
        }}
        >
        <div
          onClick={() => downloadToTSV({
            filename,
            selector,
            excludedColumns,
          })}
          >
          <span>
            {t('global.manifest')}
          </span>
        </div>
      </DropdownItem>
    </Dropdown>

  );

export default DownloadCart;
