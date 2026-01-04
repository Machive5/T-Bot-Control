import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleProp } from "react-native";
import Animated, { CSSAnimationKeyframes, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { NavigationProp } from "./types/NavigationTypes";
import Orientation from "react-native-orientation-locker";
import UDPCom from "./utils/UDPComunicator";

const Home = () => {

    /**
     * Connection Progress States:
     * 0 - Not Connected
     * 1 - Connecting
     * 2 - Timeout
     * 3 - Failed
     * 4 - Connected
     */
    const [connectionProgress, setConnectionProgress] = useState(0);
    const navigation = useNavigation<NavigationProp>();

    const statusStyles = [
        'bg-primary border-secondary/30',
        'bg-secondary border-secondary',
        'bg-failed/30 border-failed',
        'bg-failed/30 border-failed',
        'bg-success/30 border-success',
    ];

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

    const onPress = () => {
        console.log(connectionProgress);
        if (connectionProgress !== 1) {
            setConnectionProgress(1);
            UDPCom.connect();
        } else {
            UDPCom.disconnect();
            setConnectionProgress(0);
        }
    };

    useEffect(() => {
        Orientation.lockToPortrait();

        UDPCom.onConnect(() => {
            navigation.replace("Controller");
            setConnectionProgress(4);
        });

        UDPCom.onTimeOut(() => {
            setConnectionProgress(2);
        });

        UDPCom.onError(() => {
            setConnectionProgress(3);
            navigation.replace("Home");
        });

        UDPCom.onDisconnect(() => {
            setConnectionProgress(0);
        });

        return () => {
            UDPCom.onError(() => { });
        };

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
                    <Pressable onPress={(e) => { onPress(); }} className={`relative w-64 h-64 flex justify-center items-center group`}>
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
                        <View className={`${statusStyles[connectionProgress]} group-active:bg-secondary w-64 h-64 border rounded-full absolute transition-all duration-300`}></View>
                        <Text className={`${(connectionProgress == 1) ? 'text-primary' : 'text-secondary'} font-anta text-3xl text-center w-2/3 h-fit transition-colors group-active:text-primary duration-300 ease-in-out`}>
                            {
                                connectionProgress == 0 ? 'Connect to T-BOT' :
                                    connectionProgress == 1 ? 'Connecting...' :
                                        connectionProgress == 2 ? 'Timed Out.\nTap to Retry.' :
                                            connectionProgress == 3 ? 'Failed.\nTap to Retry.' :
                                                connectionProgress == 4 ? 'Connected' : ''
                            }
                        </Text>
                    </Pressable>
                    <Text className="font-anta text-secondary text-xl text-center w-full h-fit mt-5 opacity-50 px-5">
                        {
                            connectionProgress == 0 ? "Tip: Make sure the device is connected to the Robot's Wi-Fi before pressing the button." :
                                connectionProgress == 1 ? "Tip: Press again to cancel the connection attempt." :
                                    connectionProgress == 2 ? "The connection attempt timed out. Please ensure the Robot is powered on and try again." :
                                        connectionProgress == 3 ? "Failed to connect to T-BOT. Please check your network settings and try again." :
                                            connectionProgress == 4 ? "Successfully connected to T-BOT! You can now control the robot." : ''
                        }
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