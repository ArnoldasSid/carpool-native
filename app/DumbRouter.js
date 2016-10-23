import React from 'react';

import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';

export default class DumbRouter extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      screenToShow: 'login',
      authToken: null,
      userId: null,
    }
  }

  static childContextTypes = {
    goTo: React.PropTypes.func.isRequired,
    authToken: React.PropTypes.string,
    setAuthToken: React.PropTypes.func.isRequired,
    userId: React.PropTypes.string,
    setUserId: React.PropTypes.func.isRequired,
  };

  getChildContext () {
    return {
      goTo: (screenName) => this.setState({
        screenToShow: screenName,
      }),
      authToken: this.state.authToken,
      setAuthToken: authToken => this.setState({ authToken }),
      userId: this.state.userId,
      setUserId: userId => this.setState({ userId }),
    }
  }

  render () {
    if (this.state.screenToShow === 'login') {
      return <Login />
    } else if (this.state.screenToShow === 'register') {
      return <Register />
    } else if (this.state.screenToShow === 'home') {
      return <Home />
    }
  }
}