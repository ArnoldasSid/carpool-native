// @flow
import notificationsSelector from './notifications';
import { createSelector } from 'reselect';
export default createSelector(notificationsSelector, notifications =>
  notifications
    .filter(notification => !notification.recievedAt && notification.action)
    .sort((n1, n2) => n2.tss.$date - n1.tss.$date));
