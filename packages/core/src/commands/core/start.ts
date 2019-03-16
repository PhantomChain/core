import { flags } from "@oclif/command";
import { AbstractStartCommand } from "../../shared/start";
import { CommandFlags } from "../../types";
import { BaseCommand } from "../command";

export class StartCommand extends AbstractStartCommand {
    public static description: string = "Start the core";

    public static examples: string[] = [
        `Run core with a daemon
$ phantom core:start
`,
        `Run core as genesis
$ phantom core:start --networkStart
`,
        `Disable any discovery by other peers
$ phantom core:start --disableDiscovery
`,
        `Skip the initial discovery
$ phantom core:start --skipDiscovery
`,
        `Ignore the minimum network reach
$ phantom core:start --ignoreMinimumNetworkReach
`,
        `Start a seed
$ phantom core:start --launchMode=seed
`,
        `Run core without a daemon
$ phantom core:start --no-daemon
`,
    ];

    public static flags: CommandFlags = {
        ...BaseCommand.flagsNetwork,
        ...BaseCommand.flagsBehaviour,
        ...BaseCommand.flagsForger,
        daemon: flags.boolean({
            description: "start the process as a daemon",
            default: true,
            allowNo: true,
        }),
    };

    public getClass() {
        return StartCommand;
    }

    protected async runProcess(flags: CommandFlags): Promise<void> {
        this.abortRunningProcess(`${flags.token}-forger`);
        this.abortRunningProcess(`${flags.token}-relay`);

        try {
            const { bip38, password } = await this.buildBIP38(flags);

            await this.runWithPm2(
                {
                    name: `${flags.token}-core`,
                    // @ts-ignore
                    script: this.config.options.root,
                    args: `core:run ${this.flagsToStrings(flags, ["daemon"])}`,
                },
                flags,
            );
        } catch (error) {
            this.error(error.message);
        }
    }
}
