/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/anchor-is-valid */
// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, setDisplayName } from 'recompose';
import ArrangeIcon from 'react-icons/lib/fa/bars';

import ArrangeColumns from '@ncigdc/components/ArrangeColumns';
import { restoreColumns } from '@ncigdc/dux/tableColumns';
import Dropdown from '@ncigdc/uikit/Dropdown';

import t from '@cqdg/locales/intl';
import StackLayout from '@ferlab-ui/core/layouts/StackLayout';
import Link from '@ferlab-ui/core/buttons/link';
import Button from '@ferlab-ui/core/buttons/button';

import SearchInput from '@ferlab-ui/core/input/Search';

import './ArrangeColumnsButton.css';


const ArrangeColumnsButton = compose(
  setDisplayName('ArrangeColumnsButton'),
  connect(),
  withState('searchTerm', 'setSearchTerm', '')
)(
  class extends React.Component {
    searchInput;

    render() {
      const {
        searchTerm,
        setSearchTerm,
        dispatch,
        entityType,
        style = {},
        hideColumns,
        buttonClassName = '',
      } = this.props;
      return (
        <Dropdown
          autoclose={false}
          button={(
            <Button className={buttonClassName} style={style}>
              <ArrangeIcon height="14px" width="14px" />
            </Button>
          )}
          className="test-arrange-columns-button"
          dropdownStyle={{
            top: '100%',
            marginTop: 5,
            whiteSpace: 'nowrap',
          }}
          >
          <StackLayout className="arrange-columns-wrapper" vertical>
            <SearchInput
              aria-label={t('global.tables.actions.filter.columns')}
              getNode={node => {
                this.searchInput = node;
              }}
              onChange={() => setSearchTerm(() => this.searchInput.value)}
              placeholder={t('global.tables.actions.filter.columns')}
              />
            <Link
              className="restore-defaults"
              defaultIcon={false}
              onClick={() => {
                dispatch(restoreColumns(entityType));
                setSearchTerm(() => '');
                this.searchInput.value = '';
              }}
              >
              {t('global.tables.actions.restore.defaults')}
            </Link>
            <ArrangeColumns
              entityType={entityType}
              hideColumns={hideColumns}
              searchTerm={searchTerm}
              />
          </StackLayout>
        </Dropdown>
      );
    }
  }
);

export default ArrangeColumnsButton;
