import React from 'react';
import {
  View,
  Text,
  TextInput,
} from 'react-native';
import Button from 'react-native-button';
import { login } from '../redux/modules/auth/actions';
import { connect } from 'react-redux';
import authInfoSelector from '../redux/selectors/authInfo';

class Login extends React.Component {

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    authInfo: React.PropTypes.object.isRequired,
  };

  static contextTypes = {
    goTo: React.PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);

    this.login = this.login.bind(this);
    this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this);

    this.state = {
      email: '',
      password: '',
    }
  }

  componentWillReceiveProps (nextProps) {
    this.checkIfLoggedIn(nextProps.authInfo);
  }

  checkIfLoggedIn (authInfo) {
    if (authInfo.loggedIn) {
      console.log('Logged in');
      this.context.goTo('home');
    }
  }

  login () {
    this.props.dispatch(login(this.state.email, this.state.password));

  }

  render () {
    return (
      <View>
        <Text>Login</Text>
        <TextInput
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
          placeholder="Email"
        />
        <TextInput
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          placeholder="Password"
          secureTextEntry
        />
        <Button
          onPress={this.login}
        >
          Login
        </Button>
        <Button
          onPress={() => this.context.goTo('register')}
        >
          Go to Register
        </Button>
      </View>
    )
  }
}

export default connect(state => ({
  authInfo: authInfoSelector(state),
}))(Login);