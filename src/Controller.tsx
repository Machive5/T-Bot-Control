import { useEffect } from "react";
import { Button, Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import Orientation from "react-native-orientation-locker";
import ControllerArrowButton from "./components/ControllerArrowButton";
import ControllerGripButton from "./components/ControllerGripButton";
import ControllerLiftButton from "./components/ControllerLiftButton";
import ControllerExitButton from "./components/ControllerExitButton";
import Animated, { CSSAnimationKeyframes } from "react-native-reanimated";
import { NavigationProp } from "./types/NavigationTypes";
import UDPCom from "./utils/UDPComunicator";
import { useNavigation } from "@react-navigation/native";

const Controller = () => {
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        Orientation.lockToLandscape();
        return () => {
            Orientation.lockToPortrait();
        };
    }, []);

    const ping: CSSAnimationKeyframes = {
        0: {
            transform: [{ scale: 0.7 }],
            opacity: 1,
        },
        1: {
            transform: [{ scale: 2 }],
            opacity: 0,
        },
    };

    const disconnect = () => {
        UDPCom.disconnect();
        navigation.navigate('Home');
    };

    return (
        <View className="w-full h-full bg-primary flex-col items-center justify-center">
            <View className="w-full h-fit flex-row items-center justify-between px-8 pt-16">
                <View className="w-fit h-fit flex flex-col items-start justify-center gap-4">
                    <Text className="text-white text-2xl font-semibold">T-BOT Control</Text>
                    <View className="w-fit h-fit flex flex-row items-center justify-center gap-2">
                        <View className="w-4 h-4 bg-green-500 rounded-full relative" />
                        <Animated.View style={[{
                            animationName: ping,
                            animationDuration: '1000ms',
                            animationIterationCount: 'infinite',
                        }]} className="w-4 h-4 bg-green-500 rounded-full absolute left-0" />
                        <Text className="text-white text-sm font-medium">Connected</Text>
                    </View>
                </View>
                <ControllerExitButton className="w-14 h-14" onPress={() => { disconnect(); }} />
            </View>
            <View className="flex-row w-full h-5/6 items-center justify-start">
                <View className="left-side w-1/2 h-full flex-row items-center justify-start pl-32">
                    <View className="w-fit h-fit flex flex-col items-center justify-center gap-10">
                        <ControllerArrowButton className="w-24 h-24" onPress={() => { UDPCom.speed = 1; }} onRelease={() => { UDPCom.speed = 0; }} />
                        <ControllerArrowButton className="w-24 h-24 rotate-180" onPress={() => { UDPCom.speed = -1; }} onRelease={() => { UDPCom.speed = 0; }} />
                    </View>
                </View>
                <View className="right-side w-1/2 h-full flex-col items-end justify-center pr-32 gap-10">
                    <View className="w-fit h-fit flex flex-row items-center justify-start gap-10 mx-4">
                        <ControllerLiftButton className="w-20 h-20 rotate-90" onPress={() => { UDPCom.lift = !UDPCom.lift; }} />
                        <ControllerGripButton className="w-20 h-20" onPress={() => { UDPCom.grab = !UDPCom.grab; }} />
                    </View>
                    <View className="w-fit h-fit flex flex-row items-center justify-start gap-10">
                        <ControllerArrowButton className="w-24 h-24 -rotate-90" onPress={() => { UDPCom.rotation = -1; }} onRelease={() => { UDPCom.rotation = 0; }} />
                        <ControllerArrowButton className="w-24 h-24 rotate-90" onPress={() => { UDPCom.rotation = 1; }} onRelease={() => { UDPCom.rotation = 0; }} />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Controller;