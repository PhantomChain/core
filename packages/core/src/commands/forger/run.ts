import { app } from "@phantomchain/core-container";
import { CommandFlags } from "../../types";
import { BaseCommand } from "../command";

export class RunCommand extends BaseCommand {
    public static description: string = "Run the forger (without pm2)";

    public static examples: string[] = [
        `Run a forger with a bip39 passphrase
$ phantom forger:run --bip39="..."
`,
        `Run a forger with an encrypted bip38
$ phantom forger:run --bip38="..." --password="..."
`,
    ];

    public static flags: CommandFlags = {
        ...BaseCommand.flagsNetwork,
        ...BaseCommand.flagsForger,
    };

    public async run(): Promise<void> {
        const { flags } = await this.parseWithNetwork(RunCommand);

        await this.buildApplication(app, flags, {
            include: [
                "@phantomchain/core-event-emitter",
                "@phantomchain/core-config",
                "@phantomchain/core-logger",
                "@phantomchain/core-logger-winston",
                "@phantomchain/core-forger",
            ],
            options: {
                "@phantomchain/core-forger": await this.buildBIP38(flags),
            },
        });
    }
}
