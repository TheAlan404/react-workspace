import { useContext } from "react";
import { GlobalTransform, IGlobalTransform } from "../core";
import { Position } from "../types";

export interface IGlobalTransformUtils {
    center: () => void;
    reset: () => void;
    moveBy: (pos: Partial<Position>) => void;
}

export const useGlobalTransform = (): IGlobalTransform & IGlobalTransformUtils => {
    const ctx = useContext(GlobalTransform);

    const center = () => ctx.setPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    });

    const moveBy = (delta: Partial<Position>) => ctx.setPosition({
        x: ctx.position.x + (delta.x || 0),
        y: ctx.position.y + (delta.y || 0),
    });

    const reset = () => {
        if(ctx.initialPosition) {
            ctx.setPosition(ctx.initialPosition);
        } else {
            center();
        }

        ctx.setScale(ctx.initialScale || 0.7);
    };

    return {
        ...ctx,
        center,
        reset,
        moveBy,
    };
};
