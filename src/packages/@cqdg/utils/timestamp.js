/* @flow */
import moment from 'moment';

export default (dateFormat = 'YYYY-MM-DD') =>
  `${moment().format(dateFormat)}`;
