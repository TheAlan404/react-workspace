import { useMouse } from "@mantine/hooks";
import { Position } from "../types";
import { useGlobalTransform } from "./useGlobalTransform";

/**
 * Hook for getting mouse position relative to the Global Transform
 * @returns The position of the mouse in the viewport
 */
export const useMousePosition = (): Position => {
    const { position, scale } = useGlobalTransform();
    const mouse = useMouse();

    return {
        x: Math.round((mouse.x - position.x) / scale),
        y: Math.round((mouse.y - position.y) / scale),
    };
};
