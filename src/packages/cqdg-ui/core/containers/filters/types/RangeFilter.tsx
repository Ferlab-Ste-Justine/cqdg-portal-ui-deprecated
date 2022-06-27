import React from 'react';

import Input from '@cqdg/components/Form/Input';
import StackLayout from 'cqdg-ui/core/layouts/StackLayout';
import Button from 'cqdg-ui/core/buttons/button';
import {
  IFilterGroup, IRangeFilterState, onChangeType,
} from '../Filters';
import { IDictionary } from './dictionary';

import './RangeFilter.css';

interface IRangeProps {
  dictionary: IDictionary;
  filterGroup: IFilterGroup;
  handleFromChanged?: () => void;
  handleToChanged?: () => void;
  handleUnitChanged?: () => void;
  onChange: onChangeType;
  title: string;
  selectedFilters: IRangeFilterState;
  maxPossibleValue?: number;
  minPossibleValue?: number;
}

type RangeState = IRangeFilterState;

class RangeFacet extends React.Component<IRangeProps, RangeState> {
  constructor(props: IRangeProps) {
    super(props);
    const {
      max,
      min,
      rangeType,
    } = props.selectedFilters;

    this.state = {
      min: min || undefined,
      max: max || undefined,
      rangeType: rangeType || undefined,
    };
  }

  onRangeTypeChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      rangeType: e.target.value,
    });
  }

  onMinChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      minPossibleValue = 0,
    } = this.props;
    const min = parseInt(e.target.value, 10);

    if (!(min < minPossibleValue)) {
      this.setState({ min });
    }
  }

  onMaxChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      maxPossibleValue = 0,
    } = this.props;
    const max = parseInt(e.target.value, 10);

    if (!(max < maxPossibleValue)) {
      this.setState({ max });
    }
  }

  render() {
    const {
      dictionary,
      filterGroup,
      onChange,
    } = this.props;

    const {
      max,
      min,
      rangeType,
    } = this.state;
    const { range } = filterGroup;

    if (!range) {
      return null;
    }
    const dotField = filterGroup.field;

    return (
      <StackLayout className="fui-rf-container" vertical>
        <StackLayout className="fui-rf-grouped-inputs" horizontal>
          { range.rangeTypes.length > 0 && (
            <div className="fui-rf-range-target">
              <select className="fui-rf-range-target-select" onChange={this.onRangeTypeChanged} value={rangeType || ''}>
                { range.rangeTypes.map(u => (<option key={u.key} value={u.key}>{u.name}</option>)) }
              </select>
            </div>
          )}
          <Input
            id={`from-${dotField}`}
            key={`from-${dotField}`}
            max={range.max}
            min={range.min}
            onChange={this.onMinChanged}
            placeholder={dictionary.range.min}
            title={dictionary.range.min}
            type="number"
            value={min || ''}
            />
          <div className="fui-rf-grouped-inputs-spacer" />
          <Input
            className="grouped"
            id={`to-${dotField}`}
            key={`to-${dotField}`}
            max={range.max}
            min={range.min}
            onChange={this.onMaxChanged}
            placeholder={dictionary.range.max}
            title={dictionary.range.max}
            type="number"
            value={max || ''}
            />
        </StackLayout>

        <StackLayout className="fui-rf-actions" horizontal>
          <Button
            onClick={() => onChange(filterGroup, {
              max: undefined,
              min: undefined,
              rangeType: undefined,
            })}
            type="text"
            >
            {dictionary.actions.none}
          </Button>
          <Button
            onClick={() => { onChange(filterGroup, this.state); }}
            >
            {dictionary.actions.apply}
          </Button>
        </StackLayout>

      </StackLayout>
    );
  }
}

export default RangeFacet;
