import { useHotkeys, useWindowEvent } from "@mantine/hooks";
import { DOMAttributes, useState } from "react";
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

export interface UseRelativeDrag {
    isDragging: boolean;
    props: Pick<DOMAttributes<HTMLElement>, "onMouseDown" | "onTouchStart" | "onTouchEnd">;
};

export const useRelativeDrag = ({
    value,
    onChange,
    onChangeStart,
    onChangeEnd,
    scale,
    disabled,
}: UseRelativeDragOptions): UseRelativeDrag => {
    const { scale: defaultScale } = useGlobalTransform();
    
    const [isDragging, setIsDragging] = useState(false);
    const [startDragPosition, setStartDragPosition] = useState<Position>({ x: 0, y: 0 });
    const [start, setStart] = useState<Position>({ x: 0, y: 0 });

    useHotkeys([["Escape", () => setIsDragging(false)]]);

    useWindowEvent("mousemove", (e) => {
        if (!isDragging || disabled) return;
        if (!getMouseButtons(e).left) return setIsDragging(false);
        onInputMove({ x: e.clientX, y: e.clientY });
    });

    useWindowEvent("mouseup", (e) => {
        setIsDragging(false);
        if(!disabled) onChangeEnd?.();
    });

    useWindowEvent("touchmove", (e) => {
        if (!isDragging || disabled) return;
        if (e.touches.length != 1) return;
        e.preventDefault();
        let touch = e.touches[0];
        onInputMove({ x: touch.clientX, y: touch.clientY });
    });

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
        props: {
            onMouseDown: (e: React.MouseEvent<HTMLElement>) => {
                if (!getMouseButtons(e).left) return;
                if (disabled) return;
                e.stopPropagation();
                e.preventDefault();
                (document.activeElement as HTMLElement)?.blur();

                setIsDragging(true);
                setStart({ x: e.clientX, y: e.clientY });
                setStartDragPosition(value);
                onChangeStart?.();
            },

            onTouchStart: (e: React.TouchEvent<HTMLElement>) => {
                if (e.touches.length != 1) return;
                if (disabled) return;
                e.stopPropagation();
                let touch = e.touches[0];

                setIsDragging(true);
                setStart({ x: touch.clientX, y: touch.clientY });
                setStartDragPosition(value);
                if(!disabled) onChangeStart?.();
            },

            onTouchEnd: (e: React.TouchEvent<HTMLElement>) => {
                if (disabled) return;
                setIsDragging(false);
                onChangeEnd?.();
            },
        },
    };
};
