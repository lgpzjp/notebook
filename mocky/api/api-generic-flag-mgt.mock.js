
module.exports = [
  {
    url: /\/bizcmn\/api\/v1\/genericflagmgt\/all\//,
    method: 'get',
    res: function (req, res, callback) {
      const paths = req.url.split('/');
      const id = paths[paths.length - 1];
      setTimeout(function () {
        callback(null, {
          status: 200,
          headers: {
            'Content-type': 'text/json'
          },
          body: JSON.stringify({
            "blTenantId": "28",
            "genericFlagKey": id,
            "genericFlagValue": true,
          })
        });
      }, 100);
    }
  },
  {
    url: /\/bizcmn\/api\/v1\/genericflagmgt\/all\//,
    method: 'put',
    res: function (req, res, callback) {
      const paths = req.url.split('/');
      const id = paths[paths.length - 1];
      setTimeout(function () {
        callback(null, {
          status: 200,
          headers: {
            'Content-type': 'text/json'
          },
          body: JSON.stringify({
            "blTenantId": "28",
            "genericFlagKey": id,
            "genericFlagValue": true,
          })
        });
      }, 100);
    }
  },
  {
    url: /\/bizcmn\/api\/v1\/genericflagmgt\/all\//,
    method: 'delete',
    res: function (req, res, callback) {
      const paths = req.url.split('/');
      const id = paths[paths.length - 1];
      setTimeout(function () {
        callback(null, {
          status: 204,
          headers: {
            'Content-type': 'text/json'
          },
        });
      }, 100);
    }
  },
]
