import { Pressable } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Arrow from "../../assets/images/arrow.svg";
import Animated, { interpolateColor, useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
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

const ControllerLiftButton: React.FC<props> = ({ className, onPress, onRelease }) => {
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
        backgroundColor: interpolateColor(isPressed.value, [0, 1], ['rgba(217, 217, 217, 0.05)', 'rgba(217, 217, 217, 1)']),
    }));

    const liftAnimation = useAnimatedProps(() => ({
        fill: interpolateColor(isPressed.value, [0, 1], ['#D9D9D9', '#252525']),
        stroke: interpolateColor(isPressed.value, [0, 1], ['#D9D9D9', '#252525']),
    }));

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[squareAnimation]} className={`square border border-secondary/50 rounded-xl flex items-center justify-center ${className}`}>
                <Svg height="60%" width="60%" viewBox="0 0 484.422 484.422">
                    <G id="SVGRepo_bgCarrier" stroke-width="0" />
                    <G id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                    <G id="SVGRepo_iconCarrier">
                        <AnimatedPath animatedProps={liftAnimation} d="M484.422,242.211l-117.306-83.724v48.589h-59.157c-3.42-6.379-7.797-12.291-13.06-17.554 c-14.074-14.074-32.786-21.825-52.689-21.825s-38.615,7.751-52.689,21.825c-5.263,5.262-9.64,11.174-13.06,17.554h-59.157v-48.589 L0,242.211l117.306,83.724v-48.589h59.157c3.42,6.379,7.797,12.291,13.06,17.554c14.074,14.074,32.786,21.825,52.689,21.825 s38.615-7.751,52.689-21.825c5.263-5.262,9.64-11.174,13.06-17.554h59.157v48.589L484.422,242.211z" />
                    </G>
                </Svg>
            </Animated.View>
        </GestureDetector>
    );
};

export default ControllerLiftButton;