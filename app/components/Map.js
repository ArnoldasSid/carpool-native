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
    markers: React.PropTypes.array.isRequired,
  };

  render () {
    console.log(this.props.markers);
    return (
      <View style={[styles.container, { width: this.props.width, height: this.props.height }]}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 54.6872,
            longitude: 25.2797,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {this.props.markers.map((marker, i) => (
            <MapView.Marker
              key={i}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
            />
          ))}
        </MapView>
      </View>
    );
  }
}