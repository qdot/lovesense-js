#!/usr/bin/env node

const lovesense = require('../lib/lovesense');
const args = require('commander');
const async = require('marcosc-async');

args
  .version('0.1.0')
  .option('-p, --port <port>', 'Address of serial port to use')
  .option('-v, --vibrate [vibrate]', 'Speed to vibrate at', parseInt)
  .option('-r, --rotate [rotate]', 'Speed to rotate at', parseInt)
  .option('-a, --air [air]', 'Air level to move to', parseInt)
  .option('-i, --inflate [inflate]', 'Air level to inflate to', parseInt)
  .option('-d, --deflate [inflate]', 'Air level to deflate to', parseInt)
  .parse(process.argv);

if (args.port === undefined) {
  throw Error('Must specify serial port address!');
}

let l = new lovesense.LovesenseSerial(args.port);
async.task(function*() {
  console.log('opening!');
  yield l.open();
  if (args.vibrate !== undefined) {
    console.log('setting vibrate speed!');
    yield l.vibrate(args.vibrate);
  }
  if (args.rotate !== undefined) {
    console.log('setting rotate speed!');
    yield l.rotate(args.rotate);
  }
  if (args.air !== undefined) {
    console.log('setting air level!');
    yield l.air(args.air);
  }
  if (args.inflate !== undefined) {
    console.log('setting air level!');
    yield l.inflate(args.inflate);
  }
  if (args.deflate !== undefined) {
    console.log('setting air level!');
    yield l.deflate(args.deflate);
  }
  if (args.battery !== undefined) {
    console.log('waiting for battery level!');
    let level = yield l.batteryLevel();
    console.log('Battery Level: ' + level + '%');
  }
  yield l.close();
  console.log('closed!');
}).catch((err) => console.log(err)) ;
