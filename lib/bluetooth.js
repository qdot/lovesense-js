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
    this._msg_queue = [];
  }

  open() {
    return this._device.gatt.connect()
      .then(server => { return server.getPrimaryService(HUSH_SERVICE); }).catch(er => { console.log(er); })
      .then(service => { this._service = service;
                         return this._service.getCharacteristic(HUSH_TX_CHAR);
                       }).catch(er => { console.log(er); })
      .then(char => { this._tx = char;
                      return this._service.getCharacteristic(HUSH_RX_CHAR);
                    }).catch(er => { console.log(er); })
      .then(char => { this._rx = char;
                      return this._rx.startNotifications().then(_ => {
                        this._rx.addEventListener('characteristicvaluechanged', e => console.log(new TextDecoder('ASCII').decode(e.target.value)));
                      });
                    });
  }

  close() {
    if (this._device !== undefined) {
      return this._device.gatt.disconnect();
    }
  }

  _write(cmd) {
    if (this._tx === undefined) {
      return Promise().reject('No tx to write to!');
    }
    return this._tx.writeValue(new TextEncoder('ASCII').encode(cmd));
  }

  _writeFromQueue() {
    if (this._msg_queue.length == 0) {
      return;
    }

    this._write(this._msg_queue[0]).then(() => { this._msg_queue.shift(); this._writeFromQueue(); });
  }

  _queueOrWrite(cmd) {
    this._msg_queue.push(cmd);
    if (this._msg_queue.length == 1) {
      this._writeFromQueue();
    }
  }

  _maybeWrite(cmd, parser) {
    return new Promise((resolve, reject) => {
      this._queueOrWrite(cmd);//.then(() => { resolve('OK'); }).catch((err) => {
      resolve();
        //reject(err);
      //});
    });
  }

  writeAndExpectInt(cmd) {
    return this._maybeWrite(cmd, this._expectInt.bind(this));
  }

  writeAndExpectStatus(cmd, promise) {
    return this._maybeWrite(cmd, this._expectStatus.bind(this));
  }

  writeAndExpectOK(cmd, promise) {
    return this._maybeWrite(cmd, this._expectOK.bind(this));
  }

};
