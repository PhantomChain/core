import { Bignum } from "@phantomchain/crypto";

export function bignumify(value) {
    return new Bignum(value);
}
