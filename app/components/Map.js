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

  constructor (props) {
    super(props);

    this.getMarkerColor = this.getMarkerColor.bind(this);

    this.state = {
      currTime: new Date().valueOf(),
    }
  }

  componentDidMount () {
    const timeUpdateInterval = setInterval(() => {
      this.setState({
        currTime: new Date().valueOf(),
      });
    }, 5000);
    this.setState({
      timeUpdateInterval,
    });
  }

  componentWillUnmount () {
    clearTimeout(this.state.timeUpdateInterval);
  }

  getMarkerColor (marker) {
    const tDiff = this.state.currTime - marker.timestamp;
    if (marker.isYourPosition) {
      if (tDiff > 60000) {
        return 'lightblue';
      }
      return 'blue';
    } else {
      if (tDiff > 60000) {
        return 'orange';
      }
      return 'red';
    }
  }

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
              pinColor={this.getMarkerColor(marker)}
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