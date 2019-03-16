import { app } from "@phantomchain/core-container";
import { Blockchain } from "@phantomchain/core-interfaces";
import * as schema from "../schemas/blocks";

/**
 * @type {Object}
 */
export const store = {
    /**
     * @param  {Hapi.Request} request
     * @param  {Hapi.Toolkit} h
     * @return {Hapi.Response}
     */
    handler: (request, h) => {
        request.payload.block.ip = request.info.remoteAddress;

        app.resolvePlugin<Blockchain.IBlockchain>("blockchain").handleIncomingBlock(request.payload.block);

        return h.response(null).code(204);
    },
    options: {
        validate: schema.store,
    },
};
