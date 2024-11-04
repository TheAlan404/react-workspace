import React, { useEffect } from "react";

export const useElementEvent = <
    Element extends HTMLElement,
    Event extends keyof HTMLElementEventMap,
>(
    ref: React.MutableRefObject<Element>,
    eventName: Event,
    listener: (this: Element, e: HTMLElementEventMap[Event]) => any,
    deps?: React.DependencyList,
    extra?: AddEventListenerOptions,
) => {
    useEffect(() => {
        let el = ref.current;
        if(!el) return;
        el.addEventListener(eventName, listener, extra);
        return () => el.removeEventListener(eventName, listener);
    }, [ref, ...(deps || [])]);
};
