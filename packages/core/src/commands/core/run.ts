import { app } from "@phantomcores/core-container";
import { CommandFlags } from "../../types";
import { BaseCommand } from "../command";

export class RunCommand extends BaseCommand {
    public static description: string = "Run the core (without pm2)";

    public static examples: string[] = [
        `Run core
$ phantom core:run
`,
        `Run core as genesis
$ phantom core:run --networkStart
`,
        `Disable any discovery by other peers
$ phantom core:run --disableDiscovery
`,
        `Skip the initial discovery
$ phantom core:run --skipDiscovery
`,
        `Ignore the minimum network reach
$ phantom core:run --ignoreMinimumNetworkReach
`,
        `Start a seed
$ phantom core:run --launchMode=seed
`,
    ];

    public static flags: CommandFlags = {
        ...BaseCommand.flagsNetwork,
        ...BaseCommand.flagsBehaviour,
        ...BaseCommand.flagsForger,
    };

    public async run(): Promise<void> {
        const { flags } = await this.parseWithNetwork(RunCommand);

        await this.buildApplication(app, flags, {
            options: {
                "@phantomcores/core-p2p": this.buildPeerOptions(flags),
                "@phantomcores/core-blockchain": {
                    networkStart: flags.networkStart,
                },
                "@phantomcores/core-forger": await this.buildBIP38(flags),
            },
        });
    }
}
