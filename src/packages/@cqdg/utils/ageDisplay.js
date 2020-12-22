// @flow

export const DAYS_IN_YEAR = 365.25;
export const getLowerAgeYears = (days: number) => Math.ceil(days / DAYS_IN_YEAR);
export const getUpperAgeYears = (days: number) => Math.ceil((days + 1 - DAYS_IN_YEAR) / DAYS_IN_YEAR);
