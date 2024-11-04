import { useContext } from "react";
import { GlobalTransform, IGlobalTransform } from "../core";
import { Position, Vec2, vec2client, vec2div, vec2sub } from "../types";

export interface IGlobalTransformUtils {
    center: () => void;
    reset: () => void;
    moveBy: (pos: Partial<Position>) => void;
    getAbsolutePosition: (screenRelative: Vec2) => Position;
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

    const getAbsolutePosition = (vec: Vec2) =>
        vec2div(vec2sub(vec, ctx.position), ctx.scale);

    return {
        ...ctx,
        center,
        reset,
        moveBy,
        getAbsolutePosition,
    };
};
