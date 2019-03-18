const {
    models
} = require('@phantomcores/crypto')

exports.deserialize = data => {
    return models.Transaction.deserialize(data)
}
