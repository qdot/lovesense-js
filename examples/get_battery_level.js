#!/usr/bin/env node

const lovesense = require('../lib/lovesense');
const args = require('commander');
const async = require('marcosc-async');

args
  .version('0.1.0')
  .option('-p, --port <port>', 'Address of serial port to use')
  .parse(process.argv);

if (args.port === undefined) {
  throw Error('Must specify serial port address!');
}

let l = new lovesense.LovesenseSerial(args.port);
async.task(function*() {
  yield l.open();
  let level = yield l.batteryLevel();
  console.log('Battery Level: ' + level + '%');
  yield l.close();
});
