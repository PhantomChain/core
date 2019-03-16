import { Joi } from "@phantomchain/crypto";

/**
 * @type {Object}
 */
export const store = {
    payload: {
        block: Joi.block().options({ stripUnknown: true }),
    },
};
