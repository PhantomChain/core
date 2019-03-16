export function transformPorts(config: any) {
    const result = {};
    const keys = [
        "@phantomchain/core-p2p",
        "@phantomchain/core-api",
        "@phantomchain/core-graphql",
        "@phantomchain/core-json-rpc",
        "@phantomchain/core-webhooks",
    ];

    const plugins = config.get("plugins");

    result[keys[0]] = +plugins[keys[0]].port;

    for (const [name, options] of Object.entries(plugins)) {
        // @ts-ignore
        if (keys.includes(name) && options.enabled) {
            // @ts-ignore
            if (options.server && options.server.enabled) {
                // @ts-ignore
                result[name] = +options.server.port;

                continue;
            }

            // @ts-ignore
            result[name] = +options.port;
        }
    }

    return result;
}
