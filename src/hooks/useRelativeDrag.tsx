import { useHotkeys, useWindowEvent } from "@mantine/hooks";
import { DOMAttributes, useState } from "react";
import { Position } from "../types";
import { getMouseButtons } from "../utils";
import { useGlobalTransform } from "./useGlobalTransform";

export interface UseRelativeDragOptions {
    value: Position;
    onChange: (position: Position) => void;
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
    scale,
    disabled,
}: UseRelativeDragOptions): UseRelativeDrag => {
    const { scale: defaultScale } = useGlobalTransform();
    
    const [isDragging, setIsDragging] = useState(false);
    const [startDragPosition, setStartDragPosition] = useState<Position>({ x: 0, y: 0 });
    const [start, setStart] = useState<Position>({ x: 0, y: 0 });

    useHotkeys([["Escape", () => setIsDragging(false)]]);

    useWindowEvent("mousemove", (e) => {
        if (!isDragging) return;
        if (!getMouseButtons(e).left) return setIsDragging(false);
        onInputMove({ x: e.clientX, y: e.clientY });
    });

    useWindowEvent("mouseup", (e) => {
        setIsDragging(false);
    });

    useWindowEvent("touchmove", (e) => {
        if (!isDragging) return;
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
                e.stopPropagation();
                e.preventDefault();
                (document.activeElement as HTMLElement)?.blur();
                setIsDragging(true);
                setStart({ x: e.clientX, y: e.clientY });
                setStartDragPosition(value);
            },

            onTouchStart: (e: React.TouchEvent<HTMLElement>) => {
                if (e.touches.length != 1) return;
                e.stopPropagation();
                setIsDragging(true);
                setStartDragPosition(value);
                let touch = e.touches[0];
                setStart({ x: touch.clientX, y: touch.clientY });
            },

            onTouchEnd: (e: React.TouchEvent<HTMLElement>) => {
                setIsDragging(false);
            },
        },
    };
};
