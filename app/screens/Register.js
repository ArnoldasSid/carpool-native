import React from 'react';
import {
  View,
  Text,
  TextInput,
} from 'react-native';
import Button from 'react-native-button';
import { register } from '../redux/modules/auth/actions';

export default class Register extends React.Component {

  static contextTypes = {
    goTo: React.PropTypes.func.isRequired,
    setAuthToken: React.PropTypes.func.isRequired,
    setUserId: React.PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);

    this.register = this.register.bind(this);

    this.state = {
      email: '',
      name: '',
      password: '',
      password2: '',
    }
  }

  register () {
    if (this.state.password !== this.state.password2) {
      return alert('Passwords don\'t match');
    }

    register(this.state.email, this.state.password);
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
          onPress={() => this.context.goTo('login')}
        >
          Go to Login
        </Button>
      </View>
    )
  }
}