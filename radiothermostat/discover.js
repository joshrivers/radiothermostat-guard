'use strict';

const dgram = require('dgram');


const multicastAddress = '239.255.255.250';


const discoveryMessage = Buffer.from('TYPE: WM-DISCOVER\r\n'
  + 'VERSION: 1.0\r\n\r\n'
  + 'services: com.marvell.wm.system*\r\n\r\n');

const attemptSocket = function () {
  const addresses = [];
  const socket = dgram.createSocket('udp4');

  return new Promise((resolve, reject) => {
    socket.on('error', (err) => {
      reject(err);
    });

    socket.on('message', (msg, remoteAddress) => {
      addresses.push(remoteAddress.address);
    });

    socket.on('listening', () => {
      socket.addMembership(multicastAddress);
      socket.setMulticastTTL(1);
      setTimeout(() => {
        socket.close();
        resolve(addresses);
      }, 2000);
    });

    socket.send(discoveryMessage,
      0,
      discoveryMessage.length,
      1900, multicastAddress,
      (err) => {
        if (err) {
          reject(err);
        }
      });
  });
};

module.exports = async function discover() {
  let addresses = [];
  /* eslint-disable no-await-in-loop */
  while (addresses.length === 0) {
    addresses = await attemptSocket();
  }
  /* eslint-enable no-await-in-loop */
  return addresses;
};
