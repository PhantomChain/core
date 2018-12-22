const phantom = require('phantomjscore')
const bignum = require('bigi')
const bip39 = require('bip39')
const ByteBuffer = require('bytebuffer')
const crypto = require('crypto')
const XLSX = require('xlsx')

module.exports = class GenesisBlockBuilder {
  /**
   * Create a new Genesis Block builder instance.
   * @param  {Object} options
   * @return {void}
   */
  constructor (network, options) {
    this.network = network
    this.prefixHash = network.pubKeyHash
    this.totalPremine = options.totalPremine
    this.activeDelegates = options.activeDelegates
    phantom.crypto.setNetworkVersion(this.prefixHash)
  }

  /**
   * Generate a Genesis Block.
   * @return {Object}
   */
  generate () {
    const genesisWallet = this.__createWallet()
    const premineWallet = this.__createWallet()
    const delegates = this.__buildDelegates()

    const workbook = XLSX.readFile('data/init.xlsx')
    const sheets = workbook.SheetNames
    const items = XLSX.utils.sheet_to_json(workbook.Sheets[sheets[0]])
    let totalPremine = 0
    let transactionList = []
    items.forEach(item => {
      if(parseFloat(item['phantombalance'])) {
        const transaction = transactionList.find(x => x.phantomaddress.trim() == item['phantomaddress'].trim())
        if(transaction) {
          transaction['balance'] += parseFloat(item['phantombalance'])
        }
        else {
          item['balance'] = parseFloat(item['phantombalance'])
          transactionList.push(item)
        }
        totalPremine += this.__getInteger(item['phantombalance'])
      }
    })
    const transactions = [
      ...this.__buildDelegateTransactions(delegates),
      this.__createTransferTransaction(premineWallet, genesisWallet, totalPremine)
    ]
    let sum = 0
    transactionList.forEach(item => {
      try {
        const transaction = this.__createTransferTransaction(genesisWallet, {address: item['phantomaddress'].trim()}, this.__getInteger(item['balance']))
        transactions.push(transaction)
      }
      catch(err) {
        console.log({address: item['phantomaddress'].trim(), balance: item['phantombalance']})
      }
    })
    const genesisBlock = this.__createGenesisBlock({
      keys: genesisWallet.keys,
      transactions,
      timestamp: 0
    })

    return {
      genesisWallet,
      genesisBlock,
      delegatePassphrases: delegates.map(wallet => wallet.passphrase)
    }
  }

  /**
   * Generate an amount from string.
   * @return number
   */
  __getInteger (amount) {
    const phantomAmount = parseFloat(amount) * 100000000;
    const amountInteger = parseInt(phantomAmount);
    if(phantomAmount > amountInteger) {
      return amountInteger + 1;
    }
    else {
      return amountInteger;
    }
  }

  /**
   * Generate a new random wallet.
   * @return {Object}
   */
  __createWallet () {
    const passphrase = bip39.generateMnemonic()
    const keys = phantom.crypto.getKeys(passphrase, this.network)

    return {
      address: phantom.crypto.getAddress(keys.publicKey, this.prefixHash),
      passphrase,
      keys
    }
  }

  /**
   * Generate a random wallet and assign it a delegate username.
   * @param  {String} username
   * @return {Object}
   */
  __createDelegateWallet (username) {
    const wallet = this.__createWallet()
    wallet.username = username

    return wallet
  }

  /**
   * Generate a collection of delegate wallets.
   * @return {Object[]}
   */
  __buildDelegates () {
    const wallets = []
    for (let i = 0; i < this.activeDelegates; i++) {
      wallets.push(this.__createDelegateWallet(`genesis_${i + 1}`))
    }

    return wallets
  }

  /**
   * Generate a collection of delegate registration transactions.
   * @param  {Object[]} wallets
   * @return {Object[]}
   */
  __buildDelegateTransactions (wallets) {
    return wallets.map(wallet => this.__createDelegateTransaction(wallet))
  }

  /**
   * Create transfer transaction.
   * @param  {Object} senderWallet
   * @param  {Object} receiverWallet
   * @param  {Number} amount
   * @return {Object}
   */
  __createTransferTransaction (senderWallet, receiverWallet, amount) {
    return this.__formatGenesisTransaction(
      phantom.transaction.createTransaction(receiverWallet.address, amount, null, senderWallet.passphrase, undefined, this.prefixHash),
      senderWallet
    )
  }

  /**
   * Create delegate registration transaction.
   * @param  {Object} wallet
   * @return {Object}
   */
  __createDelegateTransaction (wallet) {
    return this.__formatGenesisTransaction(
      phantom.delegate.createDelegate(wallet.passphrase, wallet.username),
      wallet
    )
  }

  /**
   * Reset transaction to be applied in the genesis block.
   * @param  {Object} transaction
   * @param  {Object} wallet
   * @return {Object}
   */
  __formatGenesisTransaction (transaction, wallet) {
    Object.assign(transaction, {
      fee: 0,
      timestamp: 0,
      senderId: wallet.address
    })
    transaction.signature = phantom.crypto.sign(transaction, wallet.keys)
    transaction.id = phantom.crypto.getId(transaction)

    return transaction
  }

  /**
   * Create block based on data.
   * @param  {Object} data
   * @return {Object}
   */
  __createGenesisBlock (data) {
    const transactions = data.transactions.sort((a, b) => {
      if (a.type === b.type) {
        return a.amount - b.amount
      }

      return a.type - b.type
    })

    let payloadLength = 0
    let totalFee = 0
    let totalAmount = 0
    let payloadHash = crypto.createHash('sha256')

    transactions.forEach(transaction => {
      const bytes = phantom.crypto.getBytes(transaction)
      payloadLength += bytes.length
      totalFee += transaction.fee
      totalAmount += transaction.amount
      payloadHash.update(bytes)
    })

    const block = {
      version: 0,
      totalAmount: totalAmount,
      totalFee: totalFee,
      reward: 0,
      payloadHash: payloadHash.digest().toString('hex'),
      timestamp: data.timestamp,
      numberOfTransactions: transactions.length,
      payloadLength,
      previousBlock: null,
      generatorPublicKey: data.keys.publicKey.toString('hex'),
      transactions,
      height: 1
    }

    block.id = this.__getBlockId(block)

    try {
      block.blockSignature = this.__signBlock(block, data.keys)
    } catch (e) {
      throw e
    }

    return block
  }

  /**
   * Work out block id for block.
   * @param  {Object} block
   * @return {String}
   */
  __getBlockId (block) {
    let hash = this.__getHash(block)
    let blockBuffer = Buffer.alloc(8)
    for (let i = 0; i < 8; i++) {
      blockBuffer[i] = hash[7 - i]
    }

    return bignum.fromBuffer(blockBuffer).toString()
  }

  /**
   * Sign block with keys.
   * @param  {Object} block
   * @param  {ECPair]} keys
   * @return {String}
   */
  __signBlock (block, keys) {
    var hash = this.__getHash(block)

    return keys.sign(hash).toDER().toString('hex')
  }

  /**
   * Get hash of block.
   * @param  {Object} block
   * @return {String}
   */
  __getHash (block) {
    return crypto.createHash('sha256').update(this.__getBytes(block)).digest()
  }

  /**
   * Get block bytes.
   * @param  {Object} block
   * @return {(Buffer|undefined)}
   */
  __getBytes (block) {
    const size = 4 + 4 + 4 + 8 + 4 + 4 + 8 + 8 + 4 + 4 + 4 + 32 + 32 + 64

    try {
      var byteBuffer = new ByteBuffer(size, true)
      byteBuffer.writeInt(block.version)
      byteBuffer.writeInt(block.timestamp)
      byteBuffer.writeInt(block.height)

      if (block.previousBlock) {
        var previousBlock = bignum(block.previousBlock).toBuffer({size: '8'})

        for (let i = 0; i < 8; i++) {
          byteBuffer.writeByte(previousBlock[i])
        }
      } else {
        for (let i = 0; i < 8; i++) {
          byteBuffer.writeByte(0)
        }
      }

      byteBuffer.writeInt(block.numberOfTransactions)
      byteBuffer.writeLong(block.totalAmount)
      byteBuffer.writeLong(block.totalFee)
      byteBuffer.writeLong(block.reward)

      byteBuffer.writeInt(block.payloadLength)

      var payloadHashBuffer = Buffer.from(block.payloadHash, 'hex')
      for (let i = 0; i < payloadHashBuffer.length; i++) {
        byteBuffer.writeByte(payloadHashBuffer[i])
      }

      var generatorPublicKeyBuffer = Buffer.from(block.generatorPublicKey, 'hex')
      for (let i = 0; i < generatorPublicKeyBuffer.length; i++) {
        byteBuffer.writeByte(generatorPublicKeyBuffer[i])
      }

      if (block.blockSignature) {
        var blockSignatureBuffer = Buffer.from(block.blockSignature, 'hex')
        for (let i = 0; i < blockSignatureBuffer.length; i++) {
          byteBuffer.writeByte(blockSignatureBuffer[i])
        }
      }

      byteBuffer.flip()
      const buffer = byteBuffer.toBuffer()

      return buffer
    } catch (error) {
      throw error
    }
  }
}
