import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleProp } from "react-native";
import Animated, { CSSAnimationKeyframes, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { NavigationProp } from "./types/NavigationTypes";
import Orientation from "react-native-orientation-locker";

const Home = () => {

    const [connectionProgress, setConnectionProgress] = useState(0);
    const navigation = useNavigation<NavigationProp>();

    const ping: CSSAnimationKeyframes = {
        0: {
            transform: [{ scale: 0.7 }],
            opacity: 1,
        },
        1: {
            transform: [{ scale: 1.5 }],
            opacity: 0,
        },
    };

    const connecting = () => {
        setConnectionProgress(1);

        setTimeout(() => {
            navigation.navigate('Controller');
            setConnectionProgress(0);
        }, 3000);
    };

    useEffect(() => {
        Orientation.lockToPortrait();
    }, []);

    return (
        <>
            <View className="bg-primary flex-1 items-center justify-start w-full h-full">
                <View className="w-full h-1/3 flex items-center justify-center">
                    <Text className="font-anta text-secondary text-5xl text-center">
                        T-BOT Control
                    </Text>
                    <Text className="font-anta text-secondary text-xl text-center opacity-50">
                        Transporter Robot Controller
                    </Text>
                </View>
                <View className="w-full h-1/3 flex items-center justify-center">
                    <Pressable onPress={(e) => { connecting(); console.log(connectionProgress); }} className={`relative w-64 h-64 flex justify-center items-center group`}>
                        {
                            connectionProgress == 1 ?
                                <Animated.View style={[{
                                    animationName: ping,
                                    animationDuration: '1000ms',
                                    animationIterationCount: 'infinite',
                                }]} className="w-80 h-80 bg-secondary rounded-full opacity-50 transition-all duration-100 absolute"></Animated.View>
                                :
                                <></>
                        }
                        <View className={`${(connectionProgress == 1) ? 'bg-secondary' : 'bg-primary'} group-active:bg-secondary w-64 h-64 border-2 border-secondary rounded-full absolute transition-all duration-300`}></View>
                        <Text className={`${(connectionProgress == 1) ? 'text-primary' : 'text-secondary'} font-anta text-4xl text-center w-full h-fit transition-colors group-active:text-primary duration-300 ease-in-out`}>
                            {connectionProgress == 1 ? 'Connecting...' : 'Connect to Robot'}
                        </Text>
                    </Pressable>
                    <Text className="font-anta text-secondary text-xl text-center w-full h-fit mt-5 opacity-50">
                        Tip: Make sure the device is connected to the Robot's Wi-Fi before pressing the button.
                    </Text>
                </View>
                <View className="w-full h-1/3 flex items-center justify-end pb-10 opacity-50">
                    <Text className="font-anta text-secondary text-base text-center w-full h-fit">
                        Version 1.0.0
                    </Text>
                    <Text className="font-anta text-secondary text-base text-center w-full h-fit">
                        © 2026 INSTITUT TEKNOLOGI SEPULUH NOPEMBER
                    </Text>
                </View>
            </View>
        </>
    );
};

export default Home;