import { PropsWithChildren, useContext, useRef, useState } from "react";
import { GlobalTransform } from "../core/GlobalTransformContext";
import { combineEvents } from "../utils";
import { usePanning } from "../hooks/usePanning";

export type WorkspaceViewProps = PropsWithChildren & JSX.IntrinsicElements["div"] & {
    withCursor?: boolean;
};

export const WorkspaceView = ({
    children,
    withCursor,
    ...props
}: WorkspaceViewProps) => {
    const { position, setPosition, scale, setScale } = useContext(GlobalTransform);
    const [lastPinchDistance, setLastPinchDistance] = useState<number | null>(null);
    const workspaceRef = useRef(null);

    const {
        isPanning,
        props: panningProps
    } = usePanning();

    const overrideProps = {};
    for(let [k, f] of Object.entries(panningProps))
        overrideProps[k] = combineEvents([
            f,
            props[k],
        ]);

    return (
        <div
            {...props}
            {...overrideProps}

            style={{
                cursor: withCursor !== false ? (isPanning ? "grabbing" : "all-scroll") : undefined,
                overflow: "hidden",
                position: 'relative',
                width: "100%",
                height: "100%",
                ...(props.style || {}),
            }}
        >
            <div
                ref={workspaceRef}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: '0 0',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}
            >
                {children}
            </div>
        </div>
    )
}
