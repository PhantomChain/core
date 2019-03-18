import { app } from "@phantomcores/core-container";
import { Logger } from "@phantomcores/core-interfaces";
import { models } from "@phantomcores/crypto";
import { Blockchain } from "../../blockchain";
import { BlockProcessorResult } from "../block-processor";

export abstract class BlockHandler {
    protected logger: Logger.ILogger;

    public constructor(protected blockchain: Blockchain, protected block: models.Block) {
        this.logger = app.resolvePlugin<Logger.ILogger>("logger");
    }

    public async execute(): Promise<BlockProcessorResult> {
        this.blockchain.resetLastDownloadedBlock();
        return BlockProcessorResult.Rejected;
    }
}
