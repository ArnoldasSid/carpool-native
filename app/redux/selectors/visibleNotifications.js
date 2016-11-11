import notificationsSelector from './notifications';
export default function visibleNotificationsSelector (state) {
  return notificationsSelector(state)
    .filter(notification => !notification.recievedAt && notification.action)
    .sort((n1, n2) => n2.tss.$date - n1.tss.$date);
}