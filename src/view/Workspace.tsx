import { forwardRef, PropsWithChildren, ReactNode, useImperativeHandle, useRef } from "react";
import { BackgroundGrid } from "./BackgroundGrid";
import { WorkspaceView } from "./WorkspaceView";
import { usePanning } from "../hooks";
import { useScaling } from "../hooks/useScaling";

export interface WorkspaceProps extends PropsWithChildren {
    background?: ReactNode;
    withCursor?: boolean;
}

export const Workspace = forwardRef<HTMLDivElement, WorkspaceProps>(({
    background,
    children,
    withCursor = true,
}, fwd) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(fwd, () => ref.current!, []);

    const isPanning = usePanning(ref);
    useScaling(ref);

    return (
        <div>
            {background ?? <BackgroundGrid />}
            <WorkspaceView
                ref={ref}
                style={{
                    cursor: withCursor ? (isPanning ? "grabbing" : "all-scroll") : undefined,
                }}
            >
                {children}
            </WorkspaceView>
        </div>
    )
});
