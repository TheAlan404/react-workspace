import { useGlobalTransform } from "../hooks/useGlobalTransform";

export type BackgroundGridProps = {
    color?: string;
    distance?: number;
    thickness?: number;
};

export const BackgroundGrid = ({
    color = "#2f2f2f",
    distance = 500,
    thickness = 1,
}: BackgroundGridProps) => {
    const { position, scale } = useGlobalTransform();

    const size = `${distance * scale}px`;
    const line = `${color} ${thickness}px`;
    const backgroundImage = `linear-gradient(to right, ${color} ${thickness}px, transparent 1px), linear-gradient(to bottom, ${color} ${thickness}px, transparent 1px)`;
    const backgroundPosition = `${position.x}px ${position.y}px`;
    const backgroundSize = `${distance * scale}px ${distance * scale}px`;

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                position: "fixed",
                pointerEvents: "none",
                zIndex: -10,
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    backgroundSize,
                    backgroundImage,
                    backgroundPosition,
                    position: "absolute",
                }}
            />
        </div>
    )
}
