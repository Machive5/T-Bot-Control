import { useEffect } from "react";
import { Text, View } from "react-native";
import Orientation from "react-native-orientation-locker";

const Controller = () => {

    useEffect(() => {
        Orientation.lockToLandscape();
        return () => {
            Orientation.lockToPortrait();
        };
    }, []);

    return (
        <View>
            <Text>
                Controller Screen
            </Text>
        </View>
    );
};

export default Controller;