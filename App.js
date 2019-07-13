/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Text, Image, PermissionsAndroid, View} from 'react-native';
import MapView from 'react-native-maps';
import {Marker} from "react-native-maps";
import CallAmbulance from "./src/CallAmbulance";

type Props = {};
export default class App extends Component<Props> {
    state = {
        latitude: 0,
        longitude: 0,
        error: null,
        address: null
    };

    constructor(props) {
        super(props);
    }

    async componentDidMount(): void {
        await this.requestLocationPermission();
    }

    componentWillUnmount(): void {
        navigator.geolocation.clearWatch(this.watchID);
    }

    async requestLocationPermission() {
        return PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        ).then(granted => {
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.handleLocation();
            } else {
                console.log("You can not use the app");
            }
        }).catch(error => console.warn(error.message));
    }

    handleLocation = () => {
        this.watchID = navigator.geolocation.watchPosition(
            (position) => {

                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                    loading: true
                });

                this.handleAddress();
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 2000, maximumAge: 100, distanceFilter: 10 },
        );
    };

    handleAddress = () => {
        const API_KEY = 'AIzaSyC2wHb0IlVkc8Q_DQIHHzznO6eD1YO8soc';
        const {latitude, longitude} = this.state;
        const requestOption = {
            method: 'GET'
        };

        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${API_KEY}`, requestOption)
            .then(res => res.json())
            .then(response => {
                this.setState({
                    address: response.results[0].formatted_address});
            })
            .catch(error => {
                this.setState({
                    error: 'Address not available.'
                })
            });
    };

    render() {
        const {latitude, longitude, address} = this.state;
    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{flex: 1}}
                region={{
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 0.001,
                  longitudeDelta: 0.001
                }}
                showsUserLocation={true}
                zoomEnabled={true}
            >
                <Marker
                    coordinate={{
                        latitude: latitude,
                        longitude: longitude,
                    }}
                >
                    <Text style={{
                        backgroundColor: 'white',
                        padding: 20
                    }}
                    >
                        {address}
                    </Text>
                </Marker>
            </MapView>
            <CallAmbulance/>
        </View>
    );
  }
}
