import { useContext } from "react";
import { ITransform, Transform } from "../core";

export const useTransform = (): ITransform => {
    const ctx = useContext(Transform);

    return ctx;
};
