'use strict';
const async = require('marcosc-async');

class LovesenseBase {
  constructor() {
    this._runningAccel = false;
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
      return parseInt(data, 10);
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
    if (data === 'OK') {
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
    return this.writeAndExpectOK('Vibrate:' + level + ';');
  }

  rotate(level) {
    if (typeof(level) != 'number') {
      throw new Error('Command requires a number!');
    }
    return this.writeAndExpectOK('Rotate:' + level + ';');
  }

  air(level) {
    if (typeof(level) != 'number') {
      throw new Error('Command requires a number!');
    }
    return this.writeAndExpectOK('Air:Level:' + level + ';');
  }

  inflate(level) {
    if (typeof(level) != 'number') {
      throw new Error('Command requires a number!');
    }
    return this.writeAndExpectOK('Air:In:' + level + ';');
  }

  deflate(level) {
    if (typeof(level) != 'number') {
      throw new Error('Command requires a number!');
    }
    return this.writeAndExpectOK('Air:Out:' + level + ';');
  }

  startAccelerometer() {
    return this.writeAndExpectOK('StartMove:1;');
  }

  stopAccelerometer() {
    return this.writeAndExpectOK('StopMove:1;');
  }

  changeRotationDirection() {
    return this.writeAndExpectOK('RotateChange;');
  }

  powerOff() {
    return this.writeAndExpectOK('PowerOff;');
  }

  batteryLevel() {
    return this.writeAndExpectInt('BatteryLevel;');
  }

  deviceType() {
    return this.writeAndExpectInt('DeviceType;');
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

  _getSerialPort() {
    // Requiring the module here means it's not loaded until a Lovesense
    // object is created, so if we just want to use the emulator or websockets,
    // we don't require serial to come along with it.
    const SerialPort = require('serialport');
    const opts = {
      // It's bluetooth, so port settings don't matter.
      autoOpen: false,
      // Everything is strings! Easy!
      parser: SerialPort.parsers.readline(';')
    };
    return new SerialPort(this._portAddr, opts);
  }

  open() {
    return new Promise((resolve, reject) => {
      try {
        this._port = this._getSerialPort();
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
        this._port = undefined;
        resolve();
      });
    });
  }

  write(cmd) {
    return new Promise((resolve, reject) => {
      if (typeof(cmd) !== 'string') {
        reject(Error('Commands must be a string!'));
      }
      if (!this._port) {
        reject(Error('Commands must be a string!'));
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
    return this._writeAndParse(cmd, this._expectInt.bind(this));
  }

  writeAndExpectStatus(cmd, promise) {
    return this._writeAndParse(cmd, this._expectStatus.bind(this));
  }

  writeAndExpectOK(cmd, promise) {
    return this._writeAndParse(cmd, this._expectOK.bind(this));
  }

};

class LovesenseFakeSerial extends LovesenseSerial {
  constructor(portAddr) {
    super(portAddr);
    this._failNextCommand = false;
  }

  failNext() {
    this._failNextCommand = true;
  }

  _getSerialPort() {
    try {
      const SerialPort = require('virtual-serialport');
      return new SerialPort(this._portAddr);
    } catch (err) {
      throw err;
    }
  }

  open() {
    return new Promise((resolve, reject) => {
      super.open().then(() => {
        this._port.on('dataToDevice', (data) => {
          this._simulateResponse(data);
        });
        resolve();
      }, (err) => {
        reject(err);
      });
    });
  }

  close() {
    //this._port.removeListener('dataToDevice', this);
    return super.close();
  }

  _simulateResponse(data) {
    if (this._failNextCommand) {
      this._port.writeToComputer('ERR;');
      return;
    }
    this._port.writeToComputer('OK;');
  }
}

module.exports = {
  LovesenseSerial: LovesenseSerial,
  LovesenseFakeSerial: LovesenseFakeSerial
};
