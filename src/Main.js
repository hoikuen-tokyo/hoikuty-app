// @flow
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MapView } from 'expo';

const DEFAULT_LATITUDE = 35.6895;
const DEFAULT_LONGITUDE = 139.6917;
const R = 5 * 1000; // 10km
const INITIAL_REGION = regionFrom(DEFAULT_LATITUDE, DEFAULT_LONGITUDE, R);

const HOIKUEN_TOKYO_JSON_URL = "https://raw.githubusercontent.com/hoikuen-tokyo/hoikuen-tokyo-json/master/data/2017/tokyo.json";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function regionFrom(latitude, longitude, r) {
  const circumference = 40075;
  const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
  const angularDistance = r / circumference;

  const latitudeDelta = r / oneDegreeOfLatitudeInMeters;
  const longitudeDelta = Math.abs(Math.atan2(
    Math.sin(angularDistance) * Math.cos(latitude),
    Math.cos(angularDistance) - Math.sin(latitude) * Math.sin(latitude)));

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
}

export class Main extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      list: [],
    };
  }

  async componentDidMount() {
    const response = await fetch(HOIKUEN_TOKYO_JSON_URL);
    const list = await response.json();
    this.setState({ list });
  }

  render() {
    return (
      <MapView
        style={{ flex: 1 }}
        initialRegion={INITIAL_REGION}
        showsUserLocation
      >
        {this.state.list.map(hoikujo => {
          return (<MapView.Marker
            key={`${hoikujo.name}/${hoikujo.address}`}
            coordinate={hoikujo.position}
            title={hoikujo.name}
          />);
        })}
      </MapView>
    );
  }
}
