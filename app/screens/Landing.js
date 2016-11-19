import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import {
  MKSpinner,
} from 'react-native-material-kit';

const LoadingSpinner = MKSpinner.spinner()
  .withStyle({
    width: 190,
    height: 190,
    marginTop: 75,
    marginBottom: 50,
  })
  .withStrokeWidth(9)
  .build();

export default class Landing extends React.Component {
  render () {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 30 }}>
          Welcome to carpool!
        </Text>
        <LoadingSpinner />
      </View>
    )
  }
}
