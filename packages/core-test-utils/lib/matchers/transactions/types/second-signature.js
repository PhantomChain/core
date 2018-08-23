const { SECOND_SIGNATURE } = require('@phantomchain/crypto').constants

const toBeSecondSignatureType = received => ({
  message: () => 'Expected value to be a valid SECOND_SIGNATURE transaction.',
  pass: received.type === SECOND_SIGNATURE,
})

expect.extend({
  toBeSecondSignatureType,
})
