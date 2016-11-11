import React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';

import visibleNotificationsSelector from '../redux/selectors/visibleNotifications';
import notificationsLoadedSelector from '../redux/selectors/notificationsLoaded';
import RideRequestNotification from '../components/notifications/RideRequestNotification';
import RideRequestAcceptedNotification from '../components/notifications/RideRequestAcceptedNotification';

class Notifications extends React.Component {

  static propTypes = {
    notifications: React.PropTypes.array.isRequired,
    notificationsLoaded: React.PropTypes.bool.isRequired,
  };

  render () {
    if (!this.props.notificationsLoaded) {
      return (
        <View>
          <Text>Loading notifications...</Text>
        </View>
      )
    }

    if (this.props.notifications.length === 0) {
      return (
        <View>
          <Text>You currently have no notifications</Text>
        </View>
      )
    }

    return (
      <ScrollView>
        {this.props.notifications.map(notification => {
          if (notification.action === 'requestRide') {
            return (
              <RideRequestNotification
                key={notification.id}
                id={notification.id}
                requesterId={notification.payload.userId || notification.payload}
                requesterName={notification.payload.userEmail || 'some user'}
                timestamp={notification.tss.$date}
              />
            );
          } else if (notification.action === 'acceptRideRequest') {
            return (
              <RideRequestAcceptedNotification
                key={notification.id}
                id={notification.id}
                requesterId={notification.payload.userId || notification.payload}
                requesterName={notification.payload.userEmail || 'some user'}
                timestamp={notification.tss.$date}
              />
            )
          }
          return null;
        })}
      </ScrollView>
    );
  }
}

export default connect(state => ({
  notifications: visibleNotificationsSelector(state),
  notificationsLoaded: notificationsLoadedSelector(state),
}))(Notifications);