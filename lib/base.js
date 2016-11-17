'use strict';

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
