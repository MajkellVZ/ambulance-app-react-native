import React from 'react';
import {View, Button, Linking, PermissionsAndroid} from 'react-native';

class CallAmbulance extends React.Component{
    constructor(props) {
        super(props);
    }

    async requestPhoneCallPermission() {
        return PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CALL_PHONE
        ).then(granted => {
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.handleCall();
            } else {
                console.log("You can not use the app");
            }
        }).catch(e => console.warn(e));
    }

    handleCall = () => {
        Linking.openURL('tel:112');
    };

    render() {
        return (
            <View>
                <Button title="Call Ambulance" onPress={() => this.requestPhoneCallPermission()} color="red"/>
            </View>
        );
    }
}

export default CallAmbulance;
