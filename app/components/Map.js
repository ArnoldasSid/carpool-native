import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';


const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default class Map extends React.Component {

  static propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    latitude: React.PropTypes.number.isRequired,
    longitude: React.PropTypes.number.isRequired,
  };

  render () {
    return (
      <View style={[styles.container, { width: this.props.width, height: this.props.height }]}>
        <MapView
          style={styles.map}
          region={{
            latitude: this.props.latitude,
            longitude: this.props.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
        </MapView>
      </View>
    );
  }
}