import { BackgroundGrid, DragHandle, GlobalTransformProvider, TransformProvider, WorkspaceView } from "@alan404/react-workspace";

export const App = () => {
    const boxes = [1, 2, 3, 4, 5, 6].map(x => x * x);
    const colors = ["red", "green", "blue", "yellow", "cyan", "white"];

    return (
        <div>
            <GlobalTransformProvider>
                <BackgroundGrid />
                <WorkspaceView style={{ height: "100vh", width: "100vw" }}>

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
                </WorkspaceView>
            </GlobalTransformProvider>
        </div>
    )
};
