import React from 'react';
import {
  View,
  Text,
  TextInput,
} from 'react-native';
import { MKTextField, MKButton, MKColor } from 'react-native-material-kit';
import { login } from '../redux/modules/auth/actions';
import { connect } from 'react-redux';
import authInfoSelector from '../redux/selectors/authInfo';
import loginStatusSelector from '../redux/selectors/loginStatus';
import { replaceRoute } from '../redux/modules/router/actions';
import RaisedButton from '../components/material/RaisedButton.js';
import FlatButton from '../components/material/FlatButton.js';

class Login extends React.Component {

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    authInfo: React.PropTypes.object.isRequired,
    loginStatus: React.PropTypes.object.isRequired,
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
    console.log(this.props.loginStatus.inProgress);
    const width = 226;
    return (
      <View
        style={{
          paddingTop: 50,
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {this.props.loginStatus.error ? (
            <View>
              <Text style={{ color: 'red' }}>
                Error: {this.props.loginStatus.error}
              </Text>
            </View>
          ) : null}
          <MKTextField
            style={{ width: width }}
            floatingLabelEnabled={true}
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
            placeholder="Email"
          />
          <MKTextField
            style={{ width: width }}
            floatingLabelEnabled={true}
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            placeholder="Password"
            password
          />
          <RaisedButton
            onPress={this.login}
            colored
            label="Login"
            style={{
              width,
              marginTop: 25,
            }}

            loading={this.props.loginStatus.inProgress}
          />
          <FlatButton
            onPress={this.switchToRegister}
            colored
            label="Create an account"
            style={{
              width,
              marginTop: 15,
            }}
          />
        </View>
      </View>
    )
  }
}

export default connect(state => ({
  authInfo: authInfoSelector(state),
  loginStatus: loginStatusSelector(state),
}))(Login);
