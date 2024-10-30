import { useEffect } from "react";
import { Position } from "../types";
import { useRelativeDrag, useTransform } from "../hooks";
import { combineEvents } from "../utils";

export type DragHandleProps = {
    position?: Position;
    setPosition?: (pos: Position) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    withCursor?: boolean;
} & Omit<JSX.IntrinsicElements["div"], "onDragStart" | "onDragEnd">;

export const DragHandle = ({
    children,
    style,
    withCursor,
    position: _position,
    setPosition: _setPosition,
    onDragStart,
    onDragEnd,
    ...props
}: DragHandleProps) => {
    const { position, setPosition } = useTransform();

    const { isDragging, props: relativeDragProps } = useRelativeDrag({
        value: _position || position,
        onChange: _setPosition || setPosition,
    });

    useEffect(() => {
        if(isDragging) onDragStart?.();
        else onDragEnd?.();
    }, [isDragging]);

    return (
        <div
            {...props}

            onMouseDown={combineEvents([
                relativeDragProps.onMouseDown,
                props.onMouseDown,
            ])}
            onTouchStart={combineEvents([
                relativeDragProps.onTouchStart,
                props.onTouchStart,
            ])}
            onTouchEnd={combineEvents([
                relativeDragProps.onTouchEnd,
                props.onTouchEnd,
            ])}
            
            style={{
                cursor: withCursor !== false ? (isDragging ? "grabbing" : "grab") : undefined,
                ...style,
            }}
        >
            {children}
        </div>
    )
};
