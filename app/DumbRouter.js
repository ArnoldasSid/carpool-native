import React from 'react';

import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import { connect } from 'react-redux';
import routerStateSelector from './redux/selectors/routerState';

class DumbRouter extends React.Component {

  static propTypes = {
    routerState: React.PropTypes.object.isRequired,
  };

  render () {
    const { route } = this.props.routerState;
    console.log('Router', route);
    if (route === 'login') {
      return <Login />
    } else if (route === 'register') {
      return <Register />
    } else if (route === 'home') {
      return <Home />
    }
  }
}

export default connect(state => ({
  routerState: routerStateSelector(state),
}))(DumbRouter);