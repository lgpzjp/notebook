module.exports = [
  {
    url: /\/notification\/api\/v1\/notificationmessage\/common\/search_count(\?.*)?/,
    method: 'get',
    res: (req, res, callback) => {
      setTimeout(() => {
        callback(null, {
          status: 200,
          headers: {
            'Content-type': 'text/json'
          },
          body: JSON.stringify({
            totalCount: 0
          })
        });
      });
    }
  },
];
