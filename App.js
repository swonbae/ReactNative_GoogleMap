import { StatusBar } from "expo-status-bar";
import React from "react";
import MapView from "react-native-maps";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import * as Permissions from "expo-permissions";

export default class App extends React.Component {
  state = {
    latitude: null,
    longitude: null,
    hasPermission: false,
  };

  async componentDidMount() {
    const { status } = await Permissions.getAsync(Permissions.LOCATION);

    if (status !== "granted") {
      const response = await Permissions.askAsync(Permissions.LOCATION);
    } else if (!this.state.hasPermission) {
      this.setState({ hasPermission: true });
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) =>
        this.setState({ latitude, longitude }, () =>
          console.log("State:", this.state)
        ),
      (error) => console.log("Error:", error)
    );
  }

  render() {
    const { latitude, longitude, hasPermission } = this.state;
    if (hasPermission) {
      if (latitude) {
        return (
          <View style={styles.container}>
            <MapView
              style={styles.mapStyle}
              showsUserLocation
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            <Text>Now Loading...</Text>
          </View>
        );
      }
    }
    return (
      <View style={styles.container}>
        <Text>We need your permission.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
