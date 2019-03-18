import { Joi } from "@phantomcores/crypto";

/**
 * @type {Object}
 */
export const store = {
    payload: {
        block: Joi.block().options({ stripUnknown: true }),
    },
};
