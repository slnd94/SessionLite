const { v4: uuidv4 } = require('uuid');

module.exports = {
  verificationKey: () => `${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}${uuidv4()}`.replace(/-/g, "")
};
