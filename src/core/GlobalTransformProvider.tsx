import { PropsWithChildren, useState } from "react";
import { Position } from "../";
import { GlobalTransform, IGlobalTransform } from "./GlobalTransformContext";
import { useUncontrolled } from "@mantine/hooks";

export interface GlobalTransformProviderProps extends PropsWithChildren, Partial<IGlobalTransform> {};

export const GlobalTransformProvider = ({
    children,
    position: _position,
    initialPosition,
    setPosition: _setPosition,
    scale: _scale,
    initialScale,
    setScale: _setScale,
}: GlobalTransformProviderProps) => {
    const [scale, setScale] = useUncontrolled<number>({
        value: _scale,
        defaultValue: initialScale,
        finalValue: 0.7,
        onChange: _setScale,
    });

    const [position, setPosition] = useUncontrolled<Position>({
        value: _position,
        defaultValue: initialPosition,
        finalValue: {
            x: window.innerWidth/2,
            y: window.innerHeight/2
        },
        onChange: _setPosition,
    });

    return (
        <GlobalTransform.Provider value={{
            scale,
            initialScale,
            setScale,
            position,
            initialPosition,
            setPosition,
        }}>
            {children}
        </GlobalTransform.Provider>
    )
}
