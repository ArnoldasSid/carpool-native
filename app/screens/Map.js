// @flow
import React from 'react'
import {
  View,
  Text,
} from 'react-native'

import type { UsersRole, Location, User } from '../models.js'

import Map from '../components/Map'
import { connect } from 'react-redux'
import { requestRide, tripCompleted, withdrawRideRequest } from '../redux/modules/trip/actions'
import RaisedButton from '../components/material/RaisedButton.js'
import authInfoSelector from '../redux/selectors/authInfo'
import yourLocationSelector from '../redux/selectors/yourLocation.js'
import yourTripRoleSelector from '../redux/selectors/yourTripRole'
import otherTripUsersSelector from '../redux/selectors/otherTripUsers.js'

class MapScreen extends React.Component {
  props: {
    authInfo: Object,
    dispatch: Function,
    yourRole: UsersRole,
    yourLocation: Location,
    otherUsers: User[],
  }

  renderStatusText (yourRole) {
    let statusText = 'You are currently '
    if (yourRole === 'NONE') {
      statusText += 'inactive'
    } else if (yourRole === 'RIDER') {
      statusText += 'a rider'
    } else if (yourRole === 'DRIVER') {
      statusText += 'a driver'
    } else if (yourRole === 'REQEUSTER') {
      statusText +=' requesting a ride'
    }

    return (
      <View>
        <Text>{statusText}</Text>
      </View>
    )
  }

  renderButton (yourRole) {
    function buttonPressed () {
      const requesting = yourRole === 'REQUESTER'
      const inTrip = yourRole === 'DRIVER' || yourRole === 'RIDER'
      if (requesting) {
        this.props.dispatch(withdrawRideRequest())
      } else if (inTrip) {
        this.props.dispatch(tripCompleted())
      } else {
        this.props.dispatch(requestRide(this.props.authInfo.userEmail, this.props.authInfo.userId))
      }
    }
    const requesting = yourRole === 'REQUESTER'
    const inTrip = yourRole === 'DRIVER' || yourRole === 'RIDER'
    let buttonLabel
    if (requesting) {
      buttonLabel = 'Withdraw Request'
    } else if (inTrip) {
      buttonLabel = 'Trip Completed'
    } else {
      buttonLabel = 'Request Ride'
    }
    return (
      <RaisedButton
        colored
        onPress={buttonPressed.bind(this)}
        style={{
          width: 300,
          marginTop: 15,
        }}
        label={buttonLabel}
      />
    )
  }

  render () {
    const { yourLocation, yourRole, otherUsers } = this.props

    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={{width: 360, height: 360}}>
          <Map
            width={360}
            height={360}
            yourLocation={yourLocation}
            otherUsers={otherUsers}
          />
        </View>
        {this.renderStatusText(yourRole)}
        {this.renderButton(yourRole)}
      </View>
    )
  }
}

export default connect(state => ({
  authInfo: authInfoSelector(state),
  yourLocation: yourLocationSelector(state),
  yourRole: yourTripRoleSelector(state),
  otherUsers: otherTripUsersSelector(state),
}))(MapScreen)
