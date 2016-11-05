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
import { replaceRoute } from '../redux/modules/router/actions';

class Login extends React.Component {

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    authInfo: React.PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);

    this.login = this.login.bind(this);
    this.switchToRegister = this.switchToRegister.bind(this);

    this.state = {
      email: '',
      password: '',
    }
  }

  login () {
    this.props.dispatch(login(this.state.email, this.state.password));
  }

  switchToRegister () {
    this.props.dispatch(replaceRoute('register'));
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
          onPress={this.switchToRegister}
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