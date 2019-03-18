import { app } from "@phantomcores/core-container";
import { setUpContainer } from "@phantomcores/core-test-utils/src/helpers/container";

export const setUp = async () => {
    return setUpContainer({
        exit: "@phantomcores/core-p2p",
    });
};

export const tearDown = async () => {
    return app.tearDown();
};
