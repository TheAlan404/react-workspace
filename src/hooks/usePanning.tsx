import React from "react";
import { useGlobalTransform } from "./useGlobalTransform";
import { useRelativeDrag } from "./useRelativeDrag";

export const usePanning = (
    ref: React.MutableRefObject<HTMLElement | null | undefined>,
) => {
    const { position, setPosition } = useGlobalTransform();

    const {
        isDragging: isPanning
    } = useRelativeDrag(ref, {
        position,
        onDrag: setPosition,
        scale: 1,
    });
   
    return isPanning;
};
