import React from 'react';
import {
  View,
  Text,
  TextInput,
} from 'react-native';
import Button from 'react-native-button';
import { connect } from 'react-redux';
import { replaceRoute } from '../redux/modules/router/actions';

import { register } from '../redux/modules/auth/actions';
import authInfoSelector from '../redux/selectors/authInfo';

class Register extends React.Component {

  static propTypes = {
    authInfo: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);

    this.register = this.register.bind(this);
    this.switchToLogin = this.switchToLogin.bind(this);

    this.state = {
      email: '',
      name: '',
      password: '',
      password2: '',
    }

  }

  switchToLogin () {
    this.props.dispatch(replaceRoute('login'));
  }

  register () {
    if (this.state.password !== this.state.password2) {
      return alert('Passwords don\'t match');
    }

    this.props.dispatch(register(this.state.email, this.state.password));
  }

  render () {
    return (
      <View>
        <Text>Register</Text>
        <TextInput
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
          placeholder="Email"
        />
        <TextInput
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
          placeholder="Name"
        />
        <TextInput
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
          placeholder="Password"
          secureTextEntry
        />
        <TextInput
          value={this.state.password2}
          onChangeText={password2 => this.setState({ password2 })}
          placeholder="Password again"
          secureTextEntry
        />
        <Button
          onPress={this.register}
        >
          Register
        </Button>
        <Button
          onPress={this.switchToLogin}
        >
          Already have an account?
        </Button>
      </View>
    )
  }
}

export default connect(state => ({
  authInfo: authInfoSelector(state),
}))(Register);