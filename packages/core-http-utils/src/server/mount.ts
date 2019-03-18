import { app } from "@phantomcores/core-container";

export async function mountServer(name, server) {
    try {
        await server.start();

        app.resolvePlugin("logger").info(`${name} Server running at: ${server.info.uri}`);

        return server;
    } catch (error) {
        app.forceExit(`Could not start ${name} Server!`, error);
    }
}
