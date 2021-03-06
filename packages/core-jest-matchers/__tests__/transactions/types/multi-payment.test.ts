import "../../../src/transactions/types/multi-payment";

import { constants } from "@phantomcores/crypto";
const { TransactionTypes } = constants;

describe(".toBeMultiPaymentType", () => {
    test("passes when given a valid transaction", () => {
        expect({ type: TransactionTypes.MultiPayment }).toBeMultiPaymentType();
    });

    test("fails when given an invalid transaction", () => {
        expect(expect({ type: "invalid" }).toBeMultiPaymentType).toThrowError(
            "Expected value to be a valid MultiPayment transaction.",
        );
    });
});
