import { app } from "@phantomcores/core-container";

// tslint:disable-next-line:no-var-requires
const { version } = require("../../package.json");

export async function setUpLite(options) {
    process.env.CORE_SKIP_BLOCKCHAIN = "true";

    await app.setUp(version, options, {
        include: [
            "@phantomcores/core-logger",
            "@phantomcores/core-logger-winston",
            "@phantomcores/core-event-emitter",
            "@phantomcores/core-snapshots",
        ],
    });

    return app;
}

export async function tearDown() {
    return app.tearDown();
}
