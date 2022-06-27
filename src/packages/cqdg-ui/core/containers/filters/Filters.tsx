export enum VisualType {
  Checkbox = 'checkbox',
  Toggle = 'toggle',
  Range = 'range',
}

export interface IFiltersOnChange {
  selectedFilter: IFilter[];
  filterGroup: IFilterGroup;
}

export type onChangeType = (fg: IFilterGroup, f: IFilter[] | IRangeFilterState) => void

export interface IRangeFilterTypes {
  key: string;
  name: string;
}

export interface IRangeFilterState {
  max: number | undefined;
  min: number |undefined;
  rangeType: string | undefined;
}

export interface IRangeFilter {
  max: string | number | undefined;
  min: string | number | undefined;
  rangeTypes: IRangeFilterTypes[];
}

export const createDefaultRange = (max = 0, min = 0, rangeTypes = []) => ({
  max,
  min,
  rangeTypes,
});

export interface IFilterGroup {
  docType: string;
  description: string;
  field: string;
  full: string;
  placeholder: string;
  range?: IRangeFilter;
  title: string;
  type: string;
  visualType: VisualType;
}

export interface IFilter {
  doc_count: number;
  key: string;
  name: string; // use for translated/todisplay string
  id: string; //  dash (-) separated key
}
