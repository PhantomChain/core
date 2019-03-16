const {
    models
} = require('@phantomchain/crypto')

exports.deserialize = data => {
    return models.Transaction.deserialize(data)
}
