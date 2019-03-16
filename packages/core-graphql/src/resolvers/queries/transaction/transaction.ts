import { app } from "@phantomchain/core-container";
import { Database } from "@phantomchain/core-interfaces";

/**
 * Get a single transaction from the database
 * @return {Transaction}
 */
export async function transaction(_, { id }) {
    return app.resolvePlugin<Database.IDatabaseService>("database").connection.transactionsRepository.findById(id);
}
