'use strict';
class LovesenseBase {
  constructor() {
  }

  vibrate(level) {
  }

  rotate(level) {
  }

  air(level) {
  }

  inflate(level) {
  }

  deflate(level) {
  }

  startAccelerometer() {
  }

  stopAccelerometer() {
  }

  changeRotationDirection() {
  }

  powerOff() {
  }

  batteryLevel() {
  }

  deviceType() {
  }

  deviceStatus() {
  }

  setAirLevel() {
  }
};

class LovesenseSerial extends LovesenseBase {
  constructor(port_addr) {
    super();
    if (port_addr === undefined) {
      throw new Error('LovesenseSerial requires a serial port address!');
    }
    if (typeof(port_addr) !== 'string') {
      throw new Error('LovesenseSerial requires a string as serial port address!');
    }
    this._port_addr = port_addr;
  }

    open() {
    // Requiring the module here means it's not loaded until a Lovesense
    // object is created, so if we just want to use the emulator or websockets,
    // we don't require serial to come along with it.
    const SerialPort = require('serialport');
    const opts = {
      // It's bluetooth, so port settings don't matter.
      autoOpen: false,
      // Everything is strings! Easy!
      parser: SerialPort.parsers.readline('\n')
    };
    return new Promise((resolve, reject) => {
      try {
        this._port = new SerialPort(this._port_addr, opts);
      }
      catch (err) {
        reject(err);
        throw(err);
      }
      this._port.open((err) => {
        if (err) {
          reject(err);
          throw(err);
        }
      });
      this._port.on("open", (err) => {
        if (err) {
          // We'll have already rejected in the port open() callback.
          return;
        }
        resolve();
      });
    });
  }

  close() {
    if (!this._port) {
      return new Promise((resolve, reject) => {
        resolve();
      });
    }
    this._port.close();
    return new Promise((resolve, reject) => {
      this._port.on("close", (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
};

module.exports = {
  LovesenseSerial: LovesenseSerial
};

