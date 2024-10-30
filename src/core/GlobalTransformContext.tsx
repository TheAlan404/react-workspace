import { createContext } from "react";
import { Position } from "../";

export interface IGlobalTransform {
    position: Position;
    initialPosition?: Position;
    setPosition: (position: Position) => void;
    scale: number;
    initialScale?: number;
    setScale: (scale: number) => void;
}

export const GlobalTransform = createContext<IGlobalTransform>({
    position: { x: 0, y: 0 },
    scale: 1,
    setPosition: () => {},
    setScale: () => {},
});
