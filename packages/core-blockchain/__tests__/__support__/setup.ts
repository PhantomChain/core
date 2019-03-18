import { app } from "@phantomcores/core-container";
import { registerWithContainer, setUpContainer } from "../../../core-test-utils/src/helpers/container";

jest.setTimeout(60000);

export const setUpFull = async () => {
    await setUpContainer({
        exit: "@phantomcores/core-p2p",
        exclude: ["@phantomcores/core-blockchain"],
    });

    const { plugin } = require("../../src/plugin");
    await registerWithContainer(plugin, {});

    return app;
};

export const tearDownFull = async () => {
    await app.tearDown();

    const { plugin } = require("../../src/plugin");
    await plugin.deregister(app, {});
};

export const setUp = async () =>
    setUpContainer({
        exit: "@phantomcores/core-p2p",
        exclude: ["@phantomcores/core-blockchain"],
    });

export const tearDown = async () => {
    await app.tearDown();
};
