import { app } from "@phantomchain/core-container";

// tslint:disable-next-line:no-var-requires
const { version } = require("../../package.json");

export async function setUpLite(options) {
    process.env.CORE_SKIP_BLOCKCHAIN = "true";

    await app.setUp(version, options, {
        include: [
            "@phantomchain/core-logger",
            "@phantomchain/core-logger-winston",
            "@phantomchain/core-event-emitter",
            "@phantomchain/core-snapshots",
        ],
    });

    return app;
}

export async function tearDown() {
    return app.tearDown();
}
