const {
    models
} = require('@phantomcores/crypto')

const data = require('../../helpers').getJSONFixture('transaction/deserialized/0');

exports['core'] = () => {
    return models.Transaction.serialize(data);
};
