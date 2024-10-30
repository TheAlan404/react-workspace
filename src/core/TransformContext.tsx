import { createContext } from "react";
import { Position } from "../";

export interface ITransform {
    position: Position;
    setPosition: (position: Position) => void;
}

export const Transform = createContext<ITransform>({
    position: { x: 0, y: 0 },
    setPosition: () => {},
});
