
export interface IActions {
  all: string; // selected all
  apply: string; // apply the current change
  clear: string; // clear form information
  less: string;
  more: string; // Display more filters
  none: string; // deselect all
  searchPlaceholder: string;
}

export interface IMessages {
  errorNoData: string;
  errorNotFound: string;
}

export interface IGlobalSearch{
  infoTooltip: string;
  placeholder: string;
}

export interface IMultiChoice {
  searchPlaceholder: string;
}
export interface IRange {
    max: string;
    min: string;
}
export interface IDictionary {
  actions: IActions;
  globalSearch: IGlobalSearch;
  messages: IMessages;
  multiChoice: IMultiChoice;
  range: IRange;
}
