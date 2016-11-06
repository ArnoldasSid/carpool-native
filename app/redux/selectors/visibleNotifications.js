import notificationsSelector from './notifications';
export default function visibleNotificationsSelector (state) {
  return notificationsSelector(state).filter(notification => !notification.recievedAt && notification.action);
}