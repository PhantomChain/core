import { app } from "@phantomchain/core-container";
import { SnapshotManager } from "@phantomchain/core-snapshots";
import { flags } from "@oclif/command";
import { setUpLite } from "../../helpers/snapshot";
import { CommandFlags } from "../../types";
import { BaseCommand } from "../command";

export class VerifyCommand extends BaseCommand {
    public static description: string = "check validity of specified snapshot";

    public static flags: CommandFlags = {
        ...BaseCommand.flagsSnapshot,
        blocks: flags.string({
            description: "blocks to verify, corelates to folder name",
        }),
        codec: flags.string({
            description: "codec name, default is msg-lite binary",
        }),
        signatureVerify: flags.boolean({
            description: "signature verification",
        }),
    };

    public async run(): Promise<void> {
        const { flags } = await this.parseWithNetwork(VerifyCommand);

        await setUpLite(flags);

        if (!app.has("snapshots")) {
            this.error("The @phantomchain/core-snapshots plugin is not installed.");
        }

        await app.resolvePlugin<SnapshotManager>("snapshots").verifyData(flags);
    }
}
