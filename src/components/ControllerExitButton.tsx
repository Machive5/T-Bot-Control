import { Pressable } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Arrow from "../../assets/images/arrow.svg";
import Animated, { interpolate, interpolateColor, useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import React from "react";
import { cssInterop } from "nativewind";
import Svg, { G, Path, Rect } from "react-native-svg";

interface props {
    className: string;
    onPress: () => void;
    onRelease?: () => void;
}

cssInterop(Arrow, {
    className: {
        target: 'style',
        nativeStyleToProp: {
            fill: true,
            stroke: true,
        }
    },
});
const AnimatedPath = Animated.createAnimatedComponent(Path);

const ControllerExitButton: React.FC<props> = ({ className, onPress, onRelease }) => {
    const isPressed = useSharedValue(0);
    const gesture = Gesture.Pan()
        .onBegin(() => {
            isPressed.value = withTiming(1, { duration: 100 });
            scheduleOnRN(onPress);
        }).onFinalize(() => {
            isPressed.value = withTiming(0, { duration: 100 });
            if (onRelease) {
                scheduleOnRN(onRelease);
            }
        }).shouldCancelWhenOutside(true);

    const squareAnimation = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(isPressed.value, [0, 1], ['rgba(219, 57, 57, 0.8)', 'rgba(217, 217, 217, 1)']),
    }));

    const ExitAnimatedProps = useAnimatedProps(() => ({
        fill: interpolateColor(isPressed.value, [0, 1], ['#D9D9D9', '#db3939']),
    }));

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[squareAnimation]} className={`square border border-secondary rounded-md flex items-center justify-center ${className}`}>
                <Svg width="70%" height="70%" viewBox="0 0 24 24">
                    <G id="SVGRepo_bgCarrier" stroke-width="0" />
                    <G id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                    <G id="SVGRepo_iconCarrier">
                        <AnimatedPath animatedProps={ExitAnimatedProps} fill-rule="evenodd" clip-rule="evenodd" d="M15.9908 7.82251C16.2897 7.5357 16.7644 7.54547 17.0512 7.84433L20.541 11.4807C20.8195 11.7709 20.8195 12.2291 20.541 12.5193L17.0512 16.1557C16.7644 16.4545 16.2897 16.4643 15.9908 16.1775C15.692 15.8907 15.6822 15.4159 15.969 15.1171L18.2404 12.7502L11.2727 12.7502C10.8585 12.7502 10.5227 12.4144 10.5227 12.0002C10.5227 11.586 10.8585 11.2502 11.2727 11.2502L18.2408 11.2502L15.969 8.88295C15.6822 8.58409 15.692 8.10932 15.9908 7.82251Z" />
                        <AnimatedPath animatedProps={ExitAnimatedProps} fill-rule="evenodd" clip-rule="evenodd" d="M3.25 4C3.25 3.58579 3.58579 3.25 4 3.25H13.4545C13.8688 3.25 14.2045 3.58579 14.2045 4V7C14.2045 7.41421 13.8688 7.75 13.4545 7.75C13.0403 7.75 12.7045 7.41421 12.7045 7V4.75H4.75V19.25H12.7045V17C12.7045 16.5858 13.0403 16.25 13.4545 16.25C13.8688 16.25 14.2045 16.5858 14.2045 17V20C14.2045 20.4142 13.8688 20.75 13.4545 20.75H4C3.58579 20.75 3.25 20.4142 3.25 20V4Z" />
                    </G>
                </Svg>
            </Animated.View>
        </GestureDetector>
    );
};

export default ControllerExitButton;