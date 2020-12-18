/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import {
  compose,
  lifecycle,
  mapProps,
  pure,
  withState,
} from 'recompose';
import { isEqual } from 'lodash';
import { parseFilterParam } from '@cqdg/utils/uri';

import withRouter from '@cqdg/utils/withRouter';
import Input from '@ncigdc/uikit/Form/Input';
import {
  DAYS_IN_YEAR,
  getLowerAgeYears,
  getUpperAgeYears,
} from '@ncigdc/utils/ageDisplay';
import t from '@cqdg/locales/intl';

import Link from '@ncigdc/components/Links/Link';
import StackLayout from 'cqdg-ui/core/layouts/StackLayout';
import Button from 'cqdg-ui/core/buttons/button';
import {
  getCurrentQuery, resetQuery,
} from '@cqdg/store/query';

import './RangeFilter.css';

const getCurrentFromAndTo = ({ field }) => {
  const dotField = field.replace(/__/g, '.');
  const query = getCurrentQuery();
  const currentFilters =
    (query && parseFilterParam((query || {}).filters, {}).content) || [];

  return currentFilters.reduce(
    (acc, c) => (c.content.field === dotField
      ? {
        ...acc,
        [c.op]: c.content.value[0],
      }
      : acc),
    {
      '<=': undefined,
      '>=': undefined,
    },
  );
};

const convertMaxMin = ({
  convertDays,
  max,
  min,
  selectedUnit,
  setState,
}) => {
  setState(state => ({

    ...state,
    ...(convertDays && selectedUnit === 'years'
      ? {
        maxDisplayed: Math.ceil((max + 1 - DAYS_IN_YEAR) / DAYS_IN_YEAR),
        minDisplayed: Math.floor(min / DAYS_IN_YEAR),
      }
      : {
        maxDisplayed: max || 0,
        minDisplayed: min || 0,
      }),
  }));
};

const inputChanged = ({
  convertDays,
  from,
  selectedUnit,
  setState,
  to,
}) => {
  setState(state => ({

    ...state,
    fromDisplayed: from || '',
    toDisplayed: to || '',
    ...(!convertDays || selectedUnit === 'days'
      ? {
        from: from || undefined,
        to: to || undefined,
      }
      : {
        from: from ? Math.floor(from * DAYS_IN_YEAR) : undefined,
        to: to ? Math.floor(to * DAYS_IN_YEAR + DAYS_IN_YEAR - 1) : undefined,
      }),
  }));
};

const convertInputs = ({
  from,
  selectedUnit,
  setState,
  to,
}) => {
  if (selectedUnit === 'days') {
    setState(s => ({
      ...s,
      from,
      fromDisplayed: from,
      to,
      toDisplayed: to,
    }));
  } else if (selectedUnit === 'years') {
    setState(s => ({
      ...s,
      from,
      fromDisplayed: getLowerAgeYears(parseInt(from, 10)),
      to,
      toDisplayed: getUpperAgeYears(parseInt(to, 10)),
    }));
  }
};

const enhance = compose(
  withState('state', 'setState', {
    from: undefined,
    fromDisplayed: '',
    maxDisplayed: 0,
    minDisplayed: 0,
    selectedUnit: 'years',
    to: undefined,
    toDisplayed: '',
  }),
  withRouter,
  lifecycle({
    componentDidMount(): void {
      const {
        convertDays,
        field,
        max,
        min,
        setState,
        state: { selectedUnit },
      } = this.props;
      const thisFieldCurrent = getCurrentFromAndTo({
        field,
      });
      const opToWord = {
        '<=': 'to',
        '>=': 'from',
      };
      const newState = Object.keys(thisFieldCurrent)
        .filter(k => thisFieldCurrent[k])
        .reduce(
          (acc, k) => ({
            ...acc,
            [opToWord[k]]: thisFieldCurrent[k],
          }),
          {},
        );
      if (convertDays) {
        convertInputs({
          from: newState.from,
          selectedUnit,
          setState,
          to: newState.to,
        });
      } else {
        setState(s => ({
          ...s,
          ...newState,
          fromDisplayed: newState.from,
          toDisplayed: newState.to,
        }));
      }
      convertMaxMin({
        convertDays,
        max,
        min,
        selectedUnit,
        setState,
      });
    },
    componentWillReceiveProps(nextProps: Record<string, any>): void {
      if (
        [
          'field',
          'query',
          'max',
          'min',
        ].some(
          k => !isEqual(this.props[k], nextProps[k]),
        )
      ) {
        const {
          field, max, min,
        } = nextProps;
        const { convertDays, setState, state: { selectedUnit } } = this.props;
        const thisFieldCurrent = getCurrentFromAndTo({
          field,
        });
        const opToWord = {
          '<=': 'to',
          '>=': 'from',
        };
        const newState = Object.keys(thisFieldCurrent)
          .filter(k => thisFieldCurrent[k])
          .reduce(
            (acc, k) => ({
              ...acc,
              [opToWord[k]]: thisFieldCurrent[k],
            }),
            {},
          );
        if (convertDays) {
          convertInputs({
            from: newState.from,
            selectedUnit,
            setState,
            to: newState.to,
          });
        } else {
          setState(s => ({
            ...s,
            ...newState,
            fromDisplayed: newState.from,
            toDisplayed: newState.to,
          }));
        }

        convertMaxMin({
          convertDays,
          max,
          min,
          selectedUnit,
          setState,
        });
      }
    },
  }),
  mapProps(({
    convertDays, max, min, setState, ...rest
  }) => ({
    convertDays,
    handleFromChanged: e => {
      const v = e.target.value;
      const { state: { selectedUnit, toDisplayed } } = rest;
      inputChanged({
        convertDays,
        from: v,
        selectedUnit,
        setState,
        to: toDisplayed,
      });
    },
    handleToChanged: e => {
      const v = e.target.value;
      const { state: { fromDisplayed, selectedUnit } } = rest;
      inputChanged({
        convertDays,
        from: fromDisplayed,
        selectedUnit,
        setState,
        to: v,
      });
    },
    handleUnitChanged: e => {
      const v = e.target.value;
      const { state: { from, to } } = rest;
      setState(s => ({
        ...s,
        selectedUnit: v,
      }));
      convertMaxMin({
        convertDays,
        max,
        min,
        selectedUnit: v,
        setState,
      });
      convertInputs({
        from,
        selectedUnit: v,
        setState,
        to,
      });
    },
    max,
    min,
    setState,
    ...rest,
  })),
  pure,
);

type TProps = {
  theme: Record<string, any>;
  field: string;
  query: Record<string, any>;
  title: string;
  state: {
    to: number;
    from: number;
    selectedUnit: string;
    fromDisplayed: number;
    toDisplayed: number;
  };
  style: Record<string, any>;
  toggleCollapsed: Function;
  handleToChanged: Function;
  handleFromChanged: Function;
  handleUnitChanged: Function;
  min: number;
  max: number;
  convertDays: boolean;
  collapsed: boolean;
};

const RangeFacet = ({
  collapsed,
  convertDays,
  field,
  handleFromChanged,
  handleToChanged,
  handleUnitChanged,
  history,
  state: {
    from,
    fromDisplayed,
    maxDisplayed,
    minDisplayed,
    selectedUnit,
    to,
    toDisplayed,
  },
}: TProps) => {
  const dotField = field.replace(/__/g, '.');
  const innerContent = [
    {
      op: '>=',
      value: from,
    },
    {
      op: '<=',
      value: to,
    },
  ]
    .filter(v => v.value)
    .map(v => ({
      content: {
        field: dotField,
        value: [v.value],
      },
      op: v.op,
    }));
  const query = {
    filters: {
      content: innerContent,
      op: 'and',
    },
    offset: 0,
  };
  if (collapsed) return null;

  const newQuery = resetQuery(field);

  return (
    <StackLayout className="fui-rf-container" vertical>
      <StackLayout className="fui-rf-grouped-inputs" horizontal>
        <div className="fui-rf-range-target">
          <select className="fui-rf-range-target-select" onChange={handleUnitChanged} value={selectedUnit}>
            <option value="years">{t('facet.range.years')}</option>
            <option disabled={!convertDays} value="days">{t('facet.range.days')}</option>
          </select>
        </div>
        <Input
          id={`from-${dotField}`}
          key={`from-${dotField}`}
          max={maxDisplayed}
          min={minDisplayed}
          onChange={handleFromChanged}
          placeholder={t('facet.range.min')}
          title={t('facet.range.min')}
          type="number"
          value={fromDisplayed || ''}
          />
        <div className="fui-rf-grouped-inputs-spacer" />
        <Input
          className="grouped"
          id={`to-${dotField}`}
          key={`to-${dotField}`}
          max={maxDisplayed}
          min={minDisplayed}
          onChange={handleToChanged}
          placeholder={t('facet.range.max')}
          title={t('facet.range.max')}
          type="number"
          value={toDisplayed || ''}
          />
      </StackLayout>

      <StackLayout className="fui-rf-actions" horizontal>
        <Link
          query={newQuery}
          >
          <Button type="text">
            {t('facet.actions.reset')}
          </Button>
        </Link>
        <Link
          merge="replace"
          query={innerContent.length ? query : null}
          >
          <Button
            onClick={() => {}}
            >
            {t('facet.actions.apply')}
          </Button>
        </Link>

      </StackLayout>

    </StackLayout>
  );
};

export default enhance(RangeFacet);
