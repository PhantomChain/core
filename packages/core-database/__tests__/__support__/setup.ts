import { app } from "@phantomcores/core-container";
import "@phantomcores/core-test-utils";
import { setUpContainer } from "@phantomcores/core-test-utils/src/helpers/container";

export const setUp = async () => {
    jest.setTimeout(60000);

    process.env.CORE_SKIP_BLOCKCHAIN = "true";

    return await setUpContainer({
        exit: "@phantomcores/core-blockchain",
        exclude: [
            "@phantomcores/core-p2p",
            "@phantomcores/core-transaction-pool",
            "@phantomcores/core-database-postgres",
        ],
    });
};

export const tearDown = async () => {
    await app.tearDown();
};
