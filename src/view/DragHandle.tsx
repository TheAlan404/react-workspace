import { Position } from "../types";
import { useRelativeDrag, useTransform } from "../hooks";

export type DragHandleProps = {
    position?: Position;
    setPosition?: (pos: Position) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    withCursor?: boolean;
    disabled?: boolean;
} & Omit<JSX.IntrinsicElements["div"], "onDragStart" | "onDragEnd">;

export const DragHandle = ({
    children,
    style,
    withCursor,
    position: _position,
    setPosition: _setPosition,
    onDragStart,
    onDragEnd,
    disabled,
    ...props
}: DragHandleProps) => {
    const { position, setPosition } = useTransform();

    const { isDragging, ref } = useRelativeDrag<HTMLDivElement>({
        value: _position || position,
        onChange: _setPosition || setPosition,
        onChangeStart: onDragStart,
        onChangeEnd: onDragEnd,
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
};
