import { app } from "@phantomchain/core-container";

export const setUpLite = async options => {
    process.env.CORE_SKIP_BLOCKCHAIN = "true";

    await app.setUp("2.0.0", options, {
        include: [
            "@phantomchain/core-logger",
            "@phantomchain/core-logger-winston",
            "@phantomchain/core-event-emitter",
            "@phantomchain/core-snapshots",
        ],
    });

    return app;
};

export const tearDown = async () => app.tearDown();
