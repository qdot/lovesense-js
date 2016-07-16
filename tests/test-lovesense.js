const chai = require('chai');
const expect = chai.expect;
const Lovesense = require('../lib/lovesense.js');
const async = require('marcosc-async');

describe('serial', () => {
  it('should throw on missing serial port parameter', () => {
    expect(() => { new Lovesense.LovesenseSerial(); }).to.throw('LovesenseSerial requires a serial port address!');
  });
  it('should throw on non-string serial port parameter', () => {
    expect(() => { new Lovesense.LovesenseSerial(123); }).to.throw('LovesenseSerial requires a string as serial port address!');
  });
  // This doesn't seem to throw like mocha expects.
  //
  // it('should throw on invalid serial port parameter', () => {
  //   expect(() => { async.task(function* () {
  //     try {
  //       yield (new buttshock.ET312Serial('not-a-port')).open();
  //     } catch (err) {
  //       throw(err);
  //     }
  //   });}).to.throw();
  // });
});
