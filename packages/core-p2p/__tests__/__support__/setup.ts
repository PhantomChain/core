import { app } from "@phantomcores/core-container";
import { registerWithContainer, setUpContainer } from "../../../core-test-utils/src/helpers/container";

jest.setTimeout(60000);

const options = {
    host: "0.0.0.0",
    port: 4000,
    minimumNetworkReach: 5,
    coldStart: 5,
};

export const setUp = async () => {
    await setUpContainer({
        exit: "@phantomcores/core-p2p",
        exclude: ["@phantomcores/core-p2p"],
    });

    // register p2p plugin
    await registerWithContainer(require("../../src/plugin").plugin, options);
    await registerWithContainer(require("@phantomcores/core-blockchain").plugin, {});
};

export const tearDown = async () => {
    await require("@phantomcores/core-blockchain").plugin.deregister(app, {});
    await require("../../src/plugin").plugin.deregister(app, options);

    await app.tearDown();
};
