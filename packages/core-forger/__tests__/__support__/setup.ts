import { app } from "@phantomchain/core-container";
import { setUpContainer } from "@phantomchain/core-test-utils/src/helpers/container";

export const setUp = async () => {
    return setUpContainer({
        exit: "@phantomchain/core-p2p",
    });
};

export const tearDown = async () => {
    return app.tearDown();
};
