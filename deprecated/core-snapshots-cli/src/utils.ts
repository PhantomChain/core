import { app } from "@phantomcores/core-container";

export const setUpLite = async options => {
    process.env.CORE_SKIP_BLOCKCHAIN = "true";

    await app.setUp("2.0.0", options, {
        include: [
            "@phantomcores/core-logger",
            "@phantomcores/core-logger-winston",
            "@phantomcores/core-event-emitter",
            "@phantomcores/core-snapshots",
        ],
    });

    return app;
};

export const tearDown = async () => app.tearDown();
