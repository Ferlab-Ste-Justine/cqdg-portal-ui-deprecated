// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import ArrangeIcon from 'react-icons/lib/fa/bars';
import SI from 'react-icons/lib/fa/search';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import ArrangeColumns from '@ncigdc/components/ArrangeColumns';
import { restoreColumns } from '@ncigdc/dux/tableColumns';
import Dropdown from '@ncigdc/uikit/Dropdown';
import Hidden from '@ncigdc/components/Hidden';
import styled from '@ncigdc/theme/styled';

import t from '@cqdg/locales/intl';

import SearchInput from '@ferlab-ui/core/input/Search';


const SearchIcon = styled(SI, {
  backgroundColor: ({ theme }) => theme.greyScale5,
  color: ({ theme }) => theme.greyScale2,
  padding: '0.7rem',
  width: '3rem',
  height: '3rem',
});

const RestoreDefaults = styled(Row, {
  color: ({ theme }) => theme.secondaryHighContrast,
  padding: '0.3rem 0.6rem',
  cursor: 'pointer',
  ':hover': {
    textDecoration: 'underline',
  },
});

const ArrangeColumnsButton = compose(
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
              <ArrangeIcon />
              <Hidden>{t('global.tables.actions.sort')}</Hidden>
            </Button>
          )}
          className="test-arrange-columns-button"
          dropdownStyle={{
            top: '100%',
            marginTop: 5,
            whiteSpace: 'nowrap',
          }}
          >
          <Column style={{ minWidth: '22rem' }}>
            <SearchInput
              aria-label={t('global.tables.actions.filter.columns')}
              getNode={node => {
                this.searchInput = node;
              }}
              onChange={() => setSearchTerm(() => this.searchInput.value)}
              placeholder={t('global.tables.actions.filter.columns')}
              />
            <RestoreDefaults
              className="test-restore-defaults"
              onClick={() => {
                dispatch(restoreColumns(entityType));
                setSearchTerm(() => '');
                this.searchInput.value = '';
              }}
              >
              {t('global.tables.actions.restore.defaults')}
            </RestoreDefaults>
            <ArrangeColumns
              entityType={entityType}
              hideColumns={hideColumns}
              searchTerm={searchTerm}
              />
          </Column>
        </Dropdown>
      );
    }
  }
);

export default ArrangeColumnsButton;
