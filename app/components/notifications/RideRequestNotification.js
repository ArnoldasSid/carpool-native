import React from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'
import { getTheme } from 'react-native-material-kit'
import moment from 'moment'
import { markNotificationAsRead } from '../../redux/modules/notifications/actions'

import { acceptRideRequest } from '../../redux/modules/trip/actions'
import authInfoSelector from '../../redux/selectors/authInfo'
import NotificationActionButton from './NotificationActionButton'

const theme = getTheme()

const styles = StyleSheet.create({
  actionsWrap: {
    borderStyle: "solid",
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    borderTopWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
})


class RideRequestNotification extends React.Component {

  static propTypes = {
    authInfo: React.PropTypes.object.isRequired,
    requesterName: React.PropTypes.string.isRequired,
    requesterId: React.PropTypes.string.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    timestamp: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    opacity: React.PropTypes.number.isRequired,
  };

  constructor (props) {
    super(props)

    this.acceptRideRequest = this.acceptRideRequest.bind(this)
    this.declineRideRequest = this.declineRideRequest.bind(this)
  }

  acceptRideRequest () {
    this.props.dispatch(acceptRideRequest({
        userId: this.props.authInfo.userId,
        userEmail: this.props.authInfo.userEmail,
      },
      this.props.requesterId,
      this.props.id,
    ))
  }

  declineRideRequest () {
    this.props.dispatch(markNotificationAsRead(this.props.id))
  }

  getTimeDiff (notificationTimestamp) {
    return moment(notificationTimestamp).from(moment())
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
                Ride request received
              </Text>
              {` (${this.getTimeDiff(this.props.timestamp)})`}
            </Text>
            <Text style={theme.cardContentStyle}>
              {this.props.requesterName} is requesting a ride
            </Text>
            <View style={styles.actionsWrap}>
              <NotificationActionButton onPress={this.acceptRideRequest}>
                <Text style={{ color: '#3f51b5' }}>
                  Accept
                </Text>
              </NotificationActionButton>
              <NotificationActionButton onPress={this.declineRideRequest}>
                <Text style={{ color: '#3f51b5' }}>
                  Decline
                </Text>
              </NotificationActionButton>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default connect(state => ({
  authInfo: authInfoSelector(state),
}))(RideRequestNotification)
