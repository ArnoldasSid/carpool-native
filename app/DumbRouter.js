import React from 'react';
import {
  View,
  Dimensions,
} from 'react-native'
import { connect } from 'react-redux'

import Snackbar from './components/Snackbar'
import Home from './screens/Home'
import Login from './screens/Login'
import Register from './screens/Register'
import Landing from './screens/Landing.js'
import routerStateSelector from './redux/selectors/routerState'

class DumbRouter extends React.Component {

  static propTypes = {
    routerState: React.PropTypes.object.isRequired,
  };

  getCurrentRoute () {
    const { route } = this.props.routerState
    if (route === 'login') {
      return <Login />
    } else if (route === 'register') {
      return <Register />
    } else if (route === 'home') {
      return <Home />
    } else if (route === 'landing') {
      return <Landing />
    }
  }

  render () {
    const { width, height } = Dimensions.get('window')
    console.log(width, height)
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width,
            height: height - 25,
            flex: 1,
            flexDirection: 'column',
          }}
        >
          {this.getCurrentRoute()}
        </View>
        <Snackbar
          screenWidth={width}
        />
      </View>
    )
  }
}

export default connect(state => ({
  routerState: routerStateSelector(state),
}))(DumbRouter)
