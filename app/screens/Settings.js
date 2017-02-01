import React from 'react'
import {
  View,
  Text,
} from 'react-native'
import { connect } from 'react-redux'
import { logout } from '../redux/modules/auth/actions'
import { MKButton } from 'react-native-material-kit'
import authInfoSelector from '../redux/selectors/authInfo'

const LogoutButton = MKButton.coloredButton()
  .withStyle({ marginTop: 15 })
  .build()

class Settings extends React.Component {

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props)

    this.logout = this.logout.bind(this)
  }

  logout () {
    this.props.dispatch(logout())
  }

  render () {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ marginTop: 55 }} >
          <Text>
            {`Logged in as: ${this.props.authInfo.userEmail}`}
          </Text>
        </View>
        <LogoutButton
          onPress={this.logout}
          width={250}
        >
          <Text style={{ color: 'white' }}>
            Log Out
          </Text>
        </LogoutButton>
        <View style={{ paddingTop: 15 }}>
          <Text>
            Version 0.2.2
          </Text>
        </View>
      </View>
    )
  }
}

export default connect(state => ({
  authInfo: authInfoSelector(state),
}))(Settings)
