// @flow
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { TransitionMotion, spring } from 'react-motion';

import visibleNotificationsSelector from '../redux/selectors/visibleNotifications';
import notificationsLoadedSelector from '../redux/selectors/notificationsLoaded';
import RideRequestNotification from '../components/notifications/RideRequestNotification';
import RideRequestAcceptedNotification from '../components/notifications/RideRequestAcceptedNotification';

class Notifications extends React.Component {
  static propTypes = {
    notifications: React.PropTypes.array.isRequired,
    notificationsLoaded: React.PropTypes.bool.isRequired,
  };

  willEnter: Function;
  willLeave: Function;
  constructor(props) {
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
          height: spring(1),
          opacity: spring(1),
        },
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

  render() {
    return (
      <ScrollView>
        {!this.props.notificationsLoaded
          ? <View>
              <Text>Loading notifications...</Text>
            </View>
          : null}
        <TransitionMotion
          styles={this.getStyles()}
          willLeave={this.willLeave}
          willEnter={this.willEnter}
          children={styles => (
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
                  );
                }
                return null;
              })}
            </View>
          )}
        />
        {this.props.notifications.length === 0
          ? <View style={{ padding: 8 }}>
              <Text style={{ textAlign: 'center', fontSize: 16 }}>You currently have no notifications</Text>
            </View>
          : null}
      </ScrollView>
    );
  }
}

export default connect(state => ({
  notifications: visibleNotificationsSelector(state),
  notificationsLoaded: notificationsLoadedSelector(state),
}))(Notifications);
