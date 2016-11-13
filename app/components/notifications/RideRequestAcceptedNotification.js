import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { getTheme } from 'react-native-material-kit';
import { connect } from 'react-redux';

import { markNotificationAsRead } from '../../redux/modules/notifications/actions';
import NotificationActionButton from './NotificationActionButton';
import { acceptRideRequest } from '../../redux/modules/notifications/actions';
import moment from 'moment';

const theme = getTheme();

const styles = StyleSheet.create({
  actionsWrap: {
    borderStyle: "solid",
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    borderTopWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});


class RideRequestAcceptedNotification extends React.Component {

  static propTypes = {
    requesterName: React.PropTypes.string.isRequired,
    requesterId: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    timestamp: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    opacity: React.PropTypes.number.isRequired,
  };

  constructor (props) {
    super(props);

    this.markAsRead = this.markAsRead.bind(this);
  }

  markAsRead () {
    this.props.dispatch(markNotificationAsRead(this.props.id));
  }

  getTimeDiff (notificationTimestamp) {
    return moment().from(notificationTimestamp);
  }

  render () {
    return (
      <View style={{
        maxHeight: this.props.height,
        opacity: this.props.opacity,
      }}>
        <View style={{
          padding: 10,
        }}>
          <View
            style={theme.cardStyle}
          >
            <Text style={{
              left: 10,
              padding: 16,
              paddingBottom: 0,
            }}>
              <Text
                style={{
                  backgroundColor: "transparent",
                  color: "#000000",
                  fontSize: 24,
                }}
              >
                Ride request accepted
              </Text>
              {` (${this.getTimeDiff(this.props.timestamp)})`}
            </Text>
            <Text style={theme.cardContentStyle}>
              {this.props.requesterName} has accepted your ride request
            </Text>
            <View style={styles.actionsWrap}>
              <NotificationActionButton onPress={this.markAsRead}>
                <Text style={{ color: '#3f51b5' }}>
                  Awesome!
                </Text>
              </NotificationActionButton>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default connect()(RideRequestAcceptedNotification);