import { app } from "@phantomchain/core-container";
import "@phantomchain/core-test-utils";
import { setUpContainer } from "@phantomchain/core-test-utils/src/helpers/container";

export const setUp = async () => {
    jest.setTimeout(60000);

    process.env.CORE_SKIP_BLOCKCHAIN = "true";

    return await setUpContainer({
        exit: "@phantomchain/core-blockchain",
        exclude: [
            "@phantomchain/core-p2p",
            "@phantomchain/core-transaction-pool",
            "@phantomchain/core-database-postgres",
        ],
    });
};

export const tearDown = async () => {
    await app.tearDown();
};
