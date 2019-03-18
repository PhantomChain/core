import { Bignum } from "@phantomcores/crypto";

export function bignumify(value) {
    return new Bignum(value);
}
