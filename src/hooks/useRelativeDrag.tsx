import { useHotkeys, useWindowEvent } from "@mantine/hooks";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Position } from "../types";
import { getMouseButtons } from "../utils";
import { useGlobalTransform } from "./useGlobalTransform";

export interface UseRelativeDragOptions {
    value: Position;
    onChange: (position: Position) => void;
    onChangeStart?: () => void;
    onChangeEnd?: () => void;
    scale?: number;
    disabled?: boolean;
};

export interface UseRelativeDrag<T,> {
    isDragging: boolean;
    ref: MutableRefObject<T | null>;
};

export const useRelativeDrag = <T extends HTMLElement>({
    value,
    onChange,
    onChangeStart,
    onChangeEnd,
    scale,
    disabled = false,
}: UseRelativeDragOptions): UseRelativeDrag<T> => {
    const { scale: defaultScale } = useGlobalTransform();
    
    const [isDragging, setIsDragging] = useState(false);
    const [startDragPosition, setStartDragPosition] = useState<Position>({ x: 0, y: 0 });
    const [start, setStart] = useState<Position>({ x: 0, y: 0 });

    useHotkeys([["Escape", () => setIsDragging(false)]]);

    const ref = useRef<T | null>(null);

    useWindowEvent("mousemove", (e) => {
        if (!isDragging || disabled) return;
        if (!getMouseButtons(e).left) return setIsDragging(false);
        onInputMove({ x: e.clientX, y: e.clientY });
    });

    useWindowEvent("mouseup", (e) => {
        if(!disabled && isDragging) onChangeEnd?.();
        setIsDragging(false);
    });

    useEffect(() => {
        if(!ref.current || disabled) return;
        let el = ref.current;

        const onMouseDown = (e: MouseEvent) => {
            if (!getMouseButtons(e).left) return;
            if (disabled) return;
            e.stopPropagation();
            e.preventDefault();
            (document.activeElement as HTMLElement)?.blur();

            setIsDragging(true);
            setStart({ x: e.clientX, y: e.clientY });
            setStartDragPosition(value);
            onChangeStart?.();
        };

        const onTouchStart = (e: TouchEvent) => {
            if (e.touches.length != 1) return;
            e.preventDefault();
            e.stopPropagation();
            let touch = e.touches[0];

            setIsDragging(true);
            setStart({ x: touch.clientX, y: touch.clientY });
            setStartDragPosition(value);
            onChangeStart?.();
        };

        const onTouchMove = (e: TouchEvent) => {
            if (!isDragging) return;
            if (e.touches.length != 1) return;
            e.preventDefault();
            let touch = e.touches[0];
            onInputMove({ x: touch.clientX, y: touch.clientY });
        };

        const onTouchEnd = (e: TouchEvent) => {
            if(!disabled && isDragging) onChangeEnd?.();
            setIsDragging(false);
        };

        el.addEventListener("touchstart", onTouchStart, { passive: false });
        el.addEventListener("touchmove", onTouchMove, { passive: false });
        el.addEventListener("touchend", onTouchEnd, { passive: false });
        el.addEventListener("mousedown", onMouseDown, { passive: false });
        
        return () => {
            el.removeEventListener("touchstart", onTouchStart);
            el.removeEventListener("touchmove", onTouchMove);
            el.removeEventListener("touchend", onTouchEnd);
            el.removeEventListener("mousedown", onMouseDown);
        };
    }, [disabled, isDragging, start, startDragPosition, value]);

    const onInputMove = (delta: Position) => {
        if (disabled) return;
        const dx = delta.x - start.x;
        const dy = delta.y - start.y;
        onChange({
            x: Math.round(startDragPosition.x + (dx / (scale || defaultScale))),
            y: Math.round(startDragPosition.y + (dy / (scale || defaultScale))),
        });
    };

    return {
        isDragging,
        ref,
    };
};
