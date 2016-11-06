import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Button from 'react-native-button';
import { connect } from 'react-redux';
import { markNotificationAsRead } from '../../redux/api';

import { acceptRideRequest } from '../../redux/modules/notifications/actions';

const styles = StyleSheet.create({
  notificationWrap: {
    padding: 10,
    margin: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
  },
  actionsWrap: {
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
  };

  constructor (props) {
    super(props);

    this.markAsRead = this.markAsRead.bind(this);
  }

  markAsRead () {
    markNotificationAsRead(this.props.id);
  }

  render () {
    return (
      <View style={styles.notificationWrap}>
        <Text>Ride request accepted by
          <Text style={{ fontWeight: 'bold' }}>{' ' + this.props.requesterName}</Text>
        </Text>
        <View style={styles.actionsWrap}>
          <Button onPress={this.markAsRead}>Ok</Button>
        </View>
      </View>
    )
  }
}

export default connect()(RideRequestAcceptedNotification);