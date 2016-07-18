'use strict';
const async = require('marcosc-async');

class LovesenseBase {
  constructor() {
    this._runningAccel = false;
  }

  parseReturn(ret) {
    if (typeof(ret) !== 'string') {
      throw new Error('Return is not a string!');
    }
    if (this._promiseQueue.length == 0) {
      throw new Error('Got return with no promise waiting!');
    }
    let p = this._promiseQueue.shift();
    p.resolve(ret);
  }

  _expectAccelerometerData(data) {
    if (data[0] !== 'G') {
      return false;
    }
    this.emitAccelerometerReading(data);
    return true;
  }

  _expectInt(data) {
    if (typeof(data) !== 'string') {
      throw new Error('Expected return data to be a string!');
    }
    if (this._runningAccel && this._expectAccelerometerData(data)) {
      return undefined;
    }
    // Expect the last character to be a semicolon, truncate it while converting
    // to int.
    try {
      return parseInt(data.slice(0, data.length - 1), 10);
    } catch (err) {
      throw new Error('Could not parse int from return!');
    }
  }

  _expectOK(data) {
    if (typeof(data) !== 'string') {
      throw new Error('Expected return data to be a string!');
    }
    if (this._runningAccel && this._expectAccelerometerData(data)) {
      return undefined;
    }
    if (data === 'OK;') {
      return true;
    }
    throw new Error('Error returned from command!');
  }

  _expectStatus(data) {
    if (typeof(data) !== 'string') {
      throw new Error('Expected return data to be a string!');
    }
    if (this._runningAccel && this._expectAccelerometerData(data)) {
      return undefined;
    }
    // TODO String parsing
    throw new Error("IMPLEMENT ME");
  }

  emitAccelerometerReading(accelReading) {
  }

  write(cmd) {
    throw new Error('Must be implemented by subclass!');
  }

  vibrate(level) {
    if (typeof(level) != 'number') {
      throw new Error('Command requires a number!');
    }
  }

  rotate(level) {
    if (typeof(level) != 'number') {
      throw new Error('Command requires a number!');
    }
  }

  air(level) {
    if (typeof(level) != 'number') {
      throw new Error('Command requires a number!');
    }
  }

  inflate(level) {
    if (typeof(level) != 'number') {
      throw new Error('Command requires a number!');
    }
  }

  deflate(level) {
    if (typeof(level) != 'number') {
      throw new Error('Command requires a number!');
    }
  }

  setAirLevel(level) {
    if (typeof(level) != 'number') {
      throw new Error('Command requires a number!');
    }
  }

  startAccelerometer() {
    return this.writeAndExpectOK('StartMove:1;');
  }

  stopAccelerometer() {
    return this.writeAndExpectOK('StopMove:1;');
  }

  changeRotationDirection() {
    return this.writeAndExpectOK('RotateChange');
  }

  powerOff() {
    return this.writeAndExpectOK('PowerOff');
  }

  batteryLevel() {
    return this.writeAndExpectInt('BatteryLevel');
  }

  deviceType() {
    return this.writeAndExpectInt('DeviceType');
  }

  deviceStatus() {
    return this.writeAndExpectStatus('DeviceStatus:1;');
  }
};

class LovesenseSerial extends LovesenseBase {
  constructor(portAddr) {
    super();
    if (portAddr === undefined) {
      throw new Error('LovesenseSerial requires a serial port address!');
    }
    if (typeof(portAddr) !== 'string') {
      throw new Error('LovesenseSerial requires a string as serial port address!');
    }
    this._portAddr = portAddr;
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
        this._port = new SerialPort(this._portAddr, opts);
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
      this._port.on('open', (err) => {
        if (err) {
          // We'll have already rejected in the port open() callback.
          return;
        }
        // Set up return parser
        this._port.on('data', (d) => {
          this.parseReturn(d);
        });
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
      this._port.on('close', (err) => {
        if (err) {
          reject(err);
          return;
        }
        // Remove listener
        this._port.removeListener('data', this.parseReturn);
        resolve();
      });
    });
  }

  write(cmd) {
    return new Promise((resolve, reject) => {
      if (typeof(cmd) !== 'string') {
        throw new Error('Commands must be a string!');
      }
      if (!this._port) {
        throw new Error('Port must be opened to write!');
      }
      return this._port.write(cmd, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  _writeAndParse(cmd, parser) {
    return new Promise((resolve, reject) => {
      this.write(cmd).catch((err) => {
        reject(err);
      });
      let handler = (data) => {
        try {
          let ret = parser(data);
          // Got an accelerometer reading. Just keep listening.
          if (ret === undefined) {
            return;
          }
          resolve(ret);
        } catch (err) {
          reject(err);
        } finally {
          this._port.removeListener('data', handler);
        }
      };
      this._port.on('data', handler);
    });
  }

  writeAndExpectInt(cmd) {
    return this._writeAndParse(this._expectInt.bind(this));
  }

  writeAndExpectStatus(cmd, promise) {
    return this._writeAndParse(this._expectStatus.bind(this));
  }

  writeAndExpectOK(cmd, promise) {
    return this._writeAndParse(this._expectOK.bind(this));
  }

};

module.exports = {
  LovesenseSerial: LovesenseSerial
};

