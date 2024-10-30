import { forwardRef, PropsWithChildren } from "react";
import { useUncontrolled } from "@mantine/hooks";
import { Transform } from "./TransformContext";
import { Position } from "../";

export interface TransformProviderOptions {
    initialPosition?: Position;
    position?: Position;
    onChange?: (position: Position) => void;
}

export type TransformProviderProps = TransformProviderOptions
    & PropsWithChildren
    & Omit<JSX.IntrinsicElements["div"], keyof TransformProviderOptions>

export const TransformProvider = forwardRef<HTMLDivElement, TransformProviderProps>(({
    children,
    initialPosition,
    onChange,
    position: _position,
    style,
    ...props
}, ref) => {
    let [position, setPosition] = useUncontrolled<Position>({
        value: _position,
        defaultValue: initialPosition,
        finalValue: { x: 0, y: 0 },
        onChange,
    });
    
    return (
        <Transform.Provider value={{
            position,
            setPosition,
        }}>
            <div
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    position: "absolute",
                    ...style,
                }}
                {...props}
                ref={ref}
            >
                {children}
            </div>
        </Transform.Provider>
    );
})

