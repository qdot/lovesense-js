'use strict';

const HUSH_SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const HUSH_TX_CHAR = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const HUSH_RX_CHAR = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

function findDevice() {
  return navigator.bluetooth.requestDevice({
    filters: [{
      services: [HUSH_SERVICE]
    }]
  });
};

class LovesenseWebBluetooth extends LovesenseBase {
  constructor(device) {
    super();
    if (device === undefined) {
      throw new Error('LovesenseWebBluetooth requires a bluetooth device!');
    }
    this._device = device;
    this._service = undefined;
    this._tx = undefined;
    this._rx = undefined;
  }

  open() {
    return this._device.gatt.connect()
      .then(server => { return server.getPrimaryService(HUSH_SERVICE); }).catch(er => { console.log(er); })
      .then(service => { this._service = service;
                         return this._service.getCharacteristic(HUSH_TX_CHAR);
                       }).catch(er => { console.log(er); })
      .then(char => this._tx = char).catch(er => { console.log(er); });
  }

  close() {
    if (this._device !== undefined) {
      return this._device.gatt.disconnect();
    }
  }

  write(cmd) {
    if (this._tx === undefined) {
      return Promise().reject('No tx to write to!');
    }
    return this._tx.writeValue(new TextEncoder('ASCII').encode(cmd));
  }

  _writeAndParse(cmd, parser) {
    return new Promise((resolve, reject) => {
      this.write(cmd).then(() => { resolve('OK'); }).catch((err) => {
        reject(err);
      });
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
