const { models } = require('@phantomchain/crypto')

exports.deserialize = data => {
    return models.Block.deserialize(data)
}
