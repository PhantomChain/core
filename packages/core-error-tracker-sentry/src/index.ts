import { Container } from "@phantomchain/core-interfaces";
import Sentry from "@sentry/node";
import { defaults } from "./defaults";

export const plugin: Container.PluginDescriptor = {
    pkg: require("../package.json"),
    defaults,
    alias: "error-tracker",
    async register(container: Container.IContainer, options) {
        Sentry.init(options);

        return Sentry;
    },
};
