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

const ControllerArrowButton: React.FC<props> = ({ className, onPress, onRelease }) => {
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

    const arrowAnimatedProps = useAnimatedProps(() => ({
        fill: interpolateColor(isPressed.value, [0, 1], ['#D9D9D9', '#252525']),
    }));

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[squareAnimation]} className={`square border border-secondary/50 rounded-xl flex items-center justify-center ${className}`}>
                <Svg width={"40%"} height={"40%"} viewBox="0 -4.5 20 20">
                    <G transform="translate(-260.000000, -6684.000000)">
                        <G transform="translate(56.000000, 160.000000)">
                            <AnimatedPath
                                d="M223.707692,6534.63378 L223.707692,6534.63378 C224.097436,6534.22888 224.097436,6533.57338 223.707692,6533.16951 L215.444127,6524.60657 C214.66364,6523.79781 213.397472,6523.79781 212.616986,6524.60657 L204.29246,6533.23165 C203.906714,6533.6324 203.901717,6534.27962 204.282467,6534.68555 C204.671211,6535.10081 205.31179,6535.10495 205.70653,6534.69695 L213.323521,6526.80297 C213.714264,6526.39807 214.346848,6526.39807 214.737591,6526.80297 L222.294621,6534.63378 C222.684365,6535.03868 223.317949,6535.03868 223.707692,6534.63378"
                                fillRule="evenodd"
                                animatedProps={arrowAnimatedProps}
                            />
                        </G>
                    </G>
                </Svg>
            </Animated.View>
        </GestureDetector>
    );
};

export default ControllerArrowButton;