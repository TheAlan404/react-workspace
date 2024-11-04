import { useWindowEvent } from "@mantine/hooks";
import React, { useState } from "react";
import { Position, vec2, vec2add, vec2average, vec2client, vec2distance, vec2div, vec2sub } from "../types";
import { getMouseButtons } from "../utils";
import { useGlobalTransform } from "./useGlobalTransform";
import { useElementEvent } from "./useElementEvent";

export interface UseRelativeDragOptions {
    position: Position;
    onDrag: (position: Position) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    scale?: number;
    disabled?: boolean;
    allowMultitouch?: boolean;
};

export interface UseRelativeDrag {
    isDragging: boolean;
};

export const useRelativeDrag = (
    ref: React.MutableRefObject<HTMLElement | null | undefined>,
    {
        position,
        onDrag,
        onDragStart,
        onDragEnd,
        scale,
        disabled = false,
        allowMultitouch = false,
    }: UseRelativeDragOptions,
): UseRelativeDrag => {
    const { scale: defaultScale } = useGlobalTransform();
    
    const [isDragging, _setIsDragging] = useState(false);
    const [startDragPosition, setStartDragPosition] = useState<Position>(vec2());
    const [start, setStart] = useState<Position>(vec2());

    const setIsDragging = (b: boolean) => {
        _setIsDragging((prev) => {
            if(prev == b) return prev;
            if(prev)
                onDragEnd?.();
            else
                onDragStart?.();
            return b;
        });
    };

    const onInputMove = (delta: Position) => {
        if (disabled) return;
        onDrag(vec2add(startDragPosition, vec2div(vec2sub(delta, start), scale || defaultScale)));
    };

    useWindowEvent("keydown", (e) => {
        if(e.key == "Escape" && isDragging) setIsDragging(false);
    });

    useWindowEvent("mousemove", (e) => {
        if (!isDragging || disabled) return;
        if (!getMouseButtons(e).left) return setIsDragging(false);
        onInputMove(vec2client(e));
    });

    useWindowEvent("mouseup", (e) => {
        setIsDragging(false);
    });

    useElementEvent(ref, "mousedown", (e) => {
        if (!getMouseButtons(e).left) return;
        if (disabled) return;
        e.stopPropagation();
        e.preventDefault();
        (document.activeElement as HTMLElement)?.blur();

        setIsDragging(true);
        setStart(vec2client(e));
        setStartDragPosition(position);
    }, [position], { passive: false });

    useElementEvent(ref, "touchstart", (e) => {
        if (!e.touches.length) return; 
        if (e.touches.length !== 1 && !allowMultitouch) return setIsDragging(false); 
        e.preventDefault();
        e.stopPropagation();

        let touches = Array(e.touches.length).fill(0).map((_,i) => e.touches[i]);
        setIsDragging(true);
        setStart(vec2average(touches.map(vec2client)));
        setStartDragPosition(position);
    }, [position], { passive: false });

    useElementEvent(ref, "touchmove", (e) => {
        if (!isDragging) return;
        if (e.touches.length != 1 && !allowMultitouch) return setIsDragging(false);
        e.preventDefault();

        let touches = Array(e.touches.length).fill(0).map((_,i) => e.touches[i]);
        onInputMove(vec2average(touches.map(vec2client)));
    }, [isDragging, position], { passive: false });

    useElementEvent(ref, "touchend", (e) => {
        setIsDragging(false);
    });

    return {
        isDragging
    };
};
