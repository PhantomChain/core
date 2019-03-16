import { app } from "@phantomchain/core-container";
import { CommandFlags } from "../../types";
import { BaseCommand } from "../command";

export class RunCommand extends BaseCommand {
    public static description: string = "Run the relay (without pm2)";

    public static examples: string[] = [
        `Run a relay
$ phantom relay:run
`,
        `Run a genesis relay
$ phantom relay:run --networkStart
`,
        `Disable any discovery by other peers
$ phantom relay:run --disableDiscovery
`,
        `Skip the initial discovery
$ phantom relay:run --skipDiscovery
`,
        `Ignore the minimum network reach
$ phantom relay:run --ignoreMinimumNetworkReach
`,
        `Start a seed
$ phantom relay:run --launchMode=seed
`,
    ];

    public static flags: CommandFlags = {
        ...BaseCommand.flagsNetwork,
        ...BaseCommand.flagsBehaviour,
    };

    public async run(): Promise<void> {
        const { flags } = await this.parseWithNetwork(RunCommand);

        await this.buildApplication(app, flags, {
            exclude: ["@phantomchain/core-forger"],
            options: {
                "@phantomchain/core-p2p": this.buildPeerOptions(flags),
                "@phantomchain/core-blockchain": {
                    networkStart: flags.networkStart,
                },
            },
        });
    }
}
