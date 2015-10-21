var jsforce = require('jsforce');
var through = require('through2');

module.exports = (options) => {
  options = options || {};
  var config = [
    'loginUrl',
    'accessToken',
    'instanceUrl',
    'refreshToken',
    'clientId',
    'clientSecret',
    'redirectUri',
    'logLevel',
    'version'
  ].reduce((c, k) => (c[k] = options[k], c), {});
  
  return through.obj(function (file, enc, callback) {
    var that = this;
    var err;
    var conn = new jsforce.Connection(config);
    conn.metadata.pollInterval = options.pollInterval || 5e3;
    conn.metadata.pollTimeout = options.pollTimeout || 60e3;
    conn
      .login(options.username, options.password)
      .then(() => {
        return conn.metadata.deploy(file.contents, options.deploy).complete({ details: true });
      }, err => {
        this.emit('error', new Error(err.message));
      })
      .then(res => {
        if (res.status === 'Succeeded') {
          // Succeeded Completely
          console.log('Deploy successful.');
        } else {
          this.emit('error', JSON.stringify(res, null, '  '));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
