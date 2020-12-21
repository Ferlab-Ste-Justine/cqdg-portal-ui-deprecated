// @flow
import React from 'react';
import { sortable } from './sortable';

const SortableItem = ({ children, ...rest }) => <div {...rest}>{children}</div>;
export default sortable(SortableItem);
