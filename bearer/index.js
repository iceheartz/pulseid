var records = [
    { id: 1, username: 'admin', token: '2524a832-c1c6-4894-9125-41a9ea84e013' }
];

exports.findByToken = function(token, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.token === token) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}