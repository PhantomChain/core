import { app } from "@phantomcores/core-container";
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
                "@phantomcores/core-event-emitter",
                "@phantomcores/core-config",
                "@phantomcores/core-logger",
                "@phantomcores/core-logger-winston",
                "@phantomcores/core-forger",
            ],
            options: {
                "@phantomcores/core-forger": await this.buildBIP38(flags),
            },
        });
    }
}
