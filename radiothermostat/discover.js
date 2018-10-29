'use strict';

const dgram = require('dgram'),
  multicastAddress = '239.255.255.250',
  discoveryMessage = Buffer.from('TYPE: WM-DISCOVER\r\nVERSION: 1.0\r\n\r\nservices: com.marvell.wm.system*\r\n\r\n');

const attemptSocket = function() {
  const addresses = [],
    socket = dgram.createSocket('udp4');

  return new Promise((resolve, reject) => {
    socket.on('error', function(err) {
      reject(err);
    });

    socket.on('message', function onMessage(msg, remoteAddress) {
      addresses.push(remoteAddress.address);
    });

    socket.on('listening', function onListening() {
      socket.addMembership(multicastAddress);
      socket.setMulticastTTL(1);
      setTimeout(function() {
        socket.close();
        resolve(addresses);
      }, 2000);
    });

    socket.send(discoveryMessage, 0, discoveryMessage.length, 1900, multicastAddress, function(err, bytes) {
      if (err) {
        reject(err);
      }
    });
  });
};

module.exports = async function() {
  let addresses = [];
  while (addresses.length === 0) {
    addresses = await attemptSocket();
  }
  return addresses;
};
