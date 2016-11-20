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
          height: spring(200, { stiffness: 25, damping: 3 }),
          opacity: spring(1, { stiffness: 25, damping: 3 }),
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
      height: spring(0, { stiffness: 200, damping: 23 }),
      opacity: spring(0, { stiffness: 200, damping: 23 }),
    };
  }

  render () {
    return (
      <ScrollView>
        {!this.props.notificationsLoaded ? (
          <View>
            <Text>Loading notifications...</Text>
          </View>
        ) : null}
        {this.props.notifications.length === 0 ? (
          <View>
            <Text>You currently have no notifications</Text>
          </View>
        ) : null}
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
