import { app } from "@phantomcores/core-container";
import { Blockchain } from "@phantomcores/core-interfaces";
import { bignumify, formatTimestamp } from "@phantomcores/core-utils";
import { crypto, models } from "@phantomcores/crypto";

export function transformTransaction(model) {
    const config = app.getConfig();
    const blockchain = app.resolvePlugin<Blockchain.IBlockchain>("blockchain");

    const data: any = new models.Transaction(model.serialized.toString("hex"));
    const lastBlock = blockchain.getLastBlock();

    return {
        id: data.id,
        blockId: model.blockId,
        version: data.version,
        type: data.type,
        amount: +bignumify(data.amount).toFixed(),
        fee: +bignumify(data.fee).toFixed(),
        sender: crypto.getAddress(data.senderPublicKey, config.get("network.pubKeyHash")),
        recipient: data.recipientId,
        signature: data.signature,
        signSignature: data.signSignature,
        signatures: data.signatures,
        vendorField: data.vendorField,
        asset: data.asset,
        confirmations: model.block ? lastBlock.data.height - model.block.height : 0,
        timestamp: formatTimestamp(model.timestamp || data.timestamp),
    };
}
