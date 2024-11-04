import { useEffect, useState } from "react";
import { useGlobalTransform } from "./useGlobalTransform";
import { useMousePosition } from "./useMousePosition";
import { Position, vec2, vec2add, vec2average, vec2client, vec2distance, vec2div, vec2middle, vec2mul, vec2sub } from "../types";
import { useElementEvent } from "./useElementEvent";

export interface UseScalingOptions {
    wheelScaleOn?: "cursor" | "window";
    onScalingStart?: () => void;
    onScalingEnd?: () => void;
};

export const useScaling = (
    ref: React.MutableRefObject<HTMLElement | null | undefined>,
    {
        wheelScaleOn = "cursor",
        onScalingStart,
        onScalingEnd,
    }: UseScalingOptions = {},
) => {
    const { position, setPosition, scale, setScale, getAbsolutePosition, minScale, maxScale } = useGlobalTransform();
    const [isScaling, _setIsScaling] = useState(false);
    const [lastPinchDistance, setLastPinchDistance] = useState<number | null>(null);
    const [startDragPosition, setStartDragPosition] = useState<Position>(vec2());
    const [start, setStart] = useState<Position>(vec2());
    const [startScale, setStartScale] = useState(scale);
    const mouse = useMousePosition();

    const setIsScaling = (b: boolean) => {
        _setIsScaling((prev) => {
            if(prev == b) return prev;
            if(prev)
                onScalingEnd?.();
            else
                onScalingStart?.();
            return b;
        });
    };

    const handleScaleChange = (
        scaleChange: number,
        point: Position,
    ) => {
        let newScale = Math.max(minScale, Math.min(maxScale, scale + scaleChange));
        setScale(newScale);
        setPosition(vec2sub(position, vec2mul(point, newScale - scale)));
    };

    useElementEvent(ref, "wheel", (e) => {
        e.preventDefault();
        const scaleChange = (e.deltaY < 0 ? 1 : -1) * 0.1;
        const origin = wheelScaleOn == "cursor" ? mouse : getAbsolutePosition(vec2(window.innerWidth / 2, window.innerHeight / 2));
        handleScaleChange(scaleChange, origin);
    }, [mouse, position], { passive: false });

    useElementEvent(ref, "touchstart", (e) => {
        if (e.touches.length !== 2) return;
        e.preventDefault();
        setStartScale(scale);
        setStart(vec2average([vec2client(e.touches[0]), vec2client(e.touches[1])]));
        setStartDragPosition(position);
        setIsScaling(true);
    }, [scale, position], { passive: false });

    useElementEvent(ref, "touchmove", (e) => {
        if (e.touches.length !== 2) return;
        let a = vec2client(e.touches[0]);
        let b = vec2client(e.touches[1]);
        const distance = vec2distance(a, b);
        let point = vec2average([a, b]);

        if (lastPinchDistance !== null) {
            const scaleChange = (distance - lastPinchDistance) / 500;
            let newScale = Math.max(minScale, Math.min(maxScale, scale + scaleChange));
            setScale(newScale);

            setPosition(vec2add(
                startDragPosition,
                vec2sub(point, start),
                vec2mul(vec2sub(point, startDragPosition), startScale - newScale),
            ));
        }

        setLastPinchDistance(distance);
    }, [lastPinchDistance, position, start, startDragPosition], { passive: false });

    useElementEvent(ref, "touchend", (e) => {
        setLastPinchDistance(null);
        setIsScaling(false);
    }, []);

    return isScaling;
};
