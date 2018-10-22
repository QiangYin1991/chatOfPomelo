const crc = require('crc');

module.exports.dispatch = function (key, list) {
  const index = Math.abs(crc.crc32(key)) % list.length;
  return list[index];
};