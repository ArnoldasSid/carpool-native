import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { markNotificationAsRead } from '../../redux/modules/notifications/actions'

import { acceptRideRequest } from '../../redux/modules/trip/actions'
import authInfoSelector from '../../redux/selectors/authInfo'

import NotificationTitle from './NotificationTitle.js'
import NotificationTime from './NotificationTime.js'
import NotificationContent from './NotificationContent.js'
import NotificationActions from './NotificationActions.js'
import NotificationWrap from './NotificationWrap.js'

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
    this.props.dispatch(markNotificationAsRead(this.props.id))
  }

  declineRideRequest () {
    this.props.dispatch(markNotificationAsRead(this.props.id))
  }

  getTimeDiff (notificationTimestamp) {
    return moment(notificationTimestamp).from(moment())
  }

  render () {
    return (
      <NotificationWrap
        height={this.props.height * 115}
        opacity={this.props.opacity}
      >
        <NotificationTitle>
          RideRequestReceived
        </NotificationTitle>
        <NotificationTime>
          ({this.getTimeDiff(this.props.timestamp)})
        </NotificationTime>
        <NotificationContent>
          {this.props.requesterName} is requesting a ride
        </NotificationContent>
        <NotificationActions
          actions={[{
            onPress: this.acceptRideRequest,
            text: 'Accept',
          }, {
            onPress: this.declineRideRequest,
            text: 'Decline',
          }]}
        />
      </NotificationWrap>
    )
  }
}

export default connect(state => ({
  authInfo: authInfoSelector(state),
}))(RideRequestNotification)
