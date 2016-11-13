import React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { TransitionMotion, presets, spring } from 'react-motion';

import visibleNotificationsSelector from '../redux/selectors/visibleNotifications';
import notificationsLoadedSelector from '../redux/selectors/notificationsLoaded';
import RideRequestNotification from '../components/notifications/RideRequestNotification';
import RideRequestAcceptedNotification from '../components/notifications/RideRequestAcceptedNotification';

class Notifications extends React.Component {

  static propTypes = {
    notifications: React.PropTypes.array.isRequired,
    notificationsLoaded: React.PropTypes.bool.isRequired,
  };

  constructor (props) {
    super(props);

    this.willEnter = this.willEnter.bind(this);
    this.willLeave = this.willLeave.bind(this);
  }

  getStyles() {
    return this.props.notifications.map((notification, i) => {
      return {
        key: notification.id,
        data: notification,
        style: {
          height: spring(200, presets.gentle),
          opacity: spring(1, presets.gentle),
        }
      };
    });
  }

  willEnter() {
    return {
      height: 0,
      opacity: 1,
    };
  }

  willLeave() {
    return {
      height: spring(0),
      opacity: spring(0),
    };
  }

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
        <TransitionMotion
          styles={this.getStyles()}
          willLeave={this.willLeave}
          willEnter={this.willEnter}
        >
          {styles => (
            <View>
              {styles.map(style => {
                const notification = style.data;
                if (notification.action === 'requestRide') {
                  return (
                    <RideRequestNotification
                      key={notification.id}
                      id={notification.id}
                      requesterId={notification.payload.userId || notification.payload}
                      requesterName={notification.payload.userEmail || 'some user'}
                      timestamp={notification.tss.$date}
                      height={style.style.height}
                      opacity={style.style.opacity}
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
                      height={style.style.height}
                      opacity={style.style.opacity}
                    />
                  )
                }
                return null;
              })}
            </View>
          )}
        </TransitionMotion>
      </ScrollView>
    );
  }
}

export default connect(state => ({
  notifications: visibleNotificationsSelector(state),
  notificationsLoaded: notificationsLoadedSelector(state),
}))(Notifications);