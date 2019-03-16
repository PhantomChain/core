import { app } from "@phantomchain/core-container";
import { Database } from "@phantomchain/core-interfaces";
import delay from "delay";
import { registerWithContainer, setUpContainer } from "../../../core-test-utils/src/helpers/container";
import { plugin } from "../../src/plugin";

import { delegates } from "../../../core-test-utils/src/fixtures";
import { generateRound } from "./utils/generate-round";

import { queries } from "../../../core-database-postgres/src/queries";

const round = generateRound(delegates.map(delegate => delegate.publicKey), 1);

const options = {
    enabled: true,
    host: "0.0.0.0",
    port: 4003,
    whitelist: ["*"],
};

async function setUp() {
    jest.setTimeout(60000);

    await setUpContainer({
        exclude: [
            "@phantomchain/core-webhooks",
            "@phantomchain/core-graphql",
            "@phantomchain/core-forger",
            "@phantomchain/core-json-rpc",
            "@phantomchain/core-api",
        ],
    });

    const databaseService = app.resolvePlugin<Database.IDatabaseService>("database");
    await databaseService.connection.roundsRepository.truncate();
    await databaseService.buildWallets(1);
    await databaseService.saveWallets(true);
    await databaseService.saveRound(round);

    await registerWithContainer(plugin, options);
    await delay(1000); // give some more time for api server to be up
}

async function tearDown() {
    await app.tearDown();

    await plugin.deregister(app, options);
}

async function calculateRanks() {
    const databaseService = app.resolvePlugin<Database.IDatabaseService>("database");

    const rows = await (databaseService.connection as any).query.manyOrNone(queries.spv.delegatesRanks);

    rows.forEach((delegate, i) => {
        const wallet = databaseService.walletManager.findByPublicKey(delegate.publicKey);
        wallet.missedBlocks = +delegate.missedBlocks;
        (wallet as any).rate = i + 1;

        databaseService.walletManager.reindex(wallet);
    });
}

export { calculateRanks, setUp, tearDown };
