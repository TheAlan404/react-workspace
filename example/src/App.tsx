import { BackgroundGrid, DragHandle, GlobalTransformProvider, TransformProvider, Workspace, WorkspaceView } from "@alan404/react-workspace";
import { DebugPointsProvider, DebugPointsRenderer } from "../../src/debug/DebugPoint";

export const App = () => {
    const boxes = [1, 2, 3, 4, 5, 6].map(x => x * x);
    const colors = ["red", "green", "blue", "yellow", "cyan", "white"];

    return (
        <div style={{ height: "100vh", width: "100vw" }}>
            <GlobalTransformProvider>
                <DebugPointsProvider>
                    <Workspace>
                        <DebugPointsRenderer />
                        {boxes.map((x, i) => (
                            <TransformProvider
                                key={x}
                            >
                                <DragHandle>
                                    <div style={{
                                        backgroundColor: colors[i],
                                        width: `${x}em`,
                                        height: `${x}em`,
                                    }}>
                                        {x}
                                    </div>
                                </DragHandle>
                            </TransformProvider>
                        ))}
                    </Workspace>
                </DebugPointsProvider>
            </GlobalTransformProvider>
        </div>
    )
};
