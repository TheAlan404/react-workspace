import React, { SyntheticEvent } from "react";

export const MouseButtonTypes = ["left", "right", "middle", "back", "forward"] as const;
export type MouseButtonType = typeof MouseButtonTypes[number];
export type MouseButtons = Record<MouseButtonType, boolean>;

export const getMouseButtons = (e: MouseEvent | React.MouseEvent<HTMLElement>): MouseButtons => {
    return Object.fromEntries(
        MouseButtonTypes.map((btn, i) => [
            btn as MouseButtonType,
            !!(e.buttons & (1 << i))
        ])
    ) as MouseButtons;
};

export const combineEvents = <E>(
    handlers: (((e: E) => void) | undefined | null)[] = [],
) => {
    return (e: E) => {
        for(let handler of handlers)
            handler?.(e);
    };
};
