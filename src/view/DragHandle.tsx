import { Position } from "../types";
import { useRelativeDrag, useTransform } from "../hooks";
import { forwardRef, useImperativeHandle, useRef } from "react";

export type DragHandleProps = {
    position?: Position;
    setPosition?: (pos: Position) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    withCursor?: boolean;
    disabled?: boolean;
} & Omit<JSX.IntrinsicElements["div"], "onDragStart" | "onDragEnd">;

export const DragHandle = forwardRef<HTMLDivElement, DragHandleProps>(({
    children,
    style,
    withCursor,
    position: _position,
    setPosition: _setPosition,
    onDragStart,
    onDragEnd,
    disabled,
    ...props
}, fwd) => {
    const { position, setPosition } = useTransform();
    const ref = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(fwd, () => ref.current, []);

    const { isDragging } = useRelativeDrag(ref, {
        position: _position || position,
        onDrag: _setPosition || setPosition,
        onDragStart: onDragStart,
        onDragEnd: onDragEnd,
        disabled,
    });

    return (
        <div
            {...props}
            ref={ref}            
            style={{
                cursor: withCursor !== false ? (isDragging ? "grabbing" : "grab") : undefined,
                ...style,
            }}
        >
            {children}
        </div>
    )
});
