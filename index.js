const ls = require('./lib/lovesense');

let Lovesense = {
  LovesenseSerial: ls.LovesenseSerial,
  LovesenseFakeSerial: ls.LovesenseFakeSerial
};

module.exports = LovesenseSerial;
