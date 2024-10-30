import { PropsWithChildren, ReactNode } from "react";
import { GlobalTransformProvider } from "../core";
import { BackgroundGrid } from "./BackgroundGrid";
import { WorkspaceView } from "./WorkspaceView";

export interface WorkspaceProps extends PropsWithChildren {
    background?: ReactNode;
}

export const Workspace = ({
    background,
    children,
}: WorkspaceProps) => {
    return (
        <GlobalTransformProvider>
            {background ?? <BackgroundGrid />}
            <WorkspaceView>
                {children}
            </WorkspaceView>
        </GlobalTransformProvider>
    )
};
