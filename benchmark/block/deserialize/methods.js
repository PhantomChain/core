const { models } = require('@phantomcores/crypto')

exports.deserialize = data => {
    return models.Block.deserialize(data)
}
