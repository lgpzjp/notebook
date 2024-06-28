let searchResultList = {
    blTenantId: 'tenant00000014',
    blUserId: '1',
    employeeCode: 'employee-test-0001Z',
    employeeName: 'テスト従業員',
    organizationCode: '000001',
    organizationName: 'テスト組織'
};

let responseResultList = searchResultList;
const util = require('./api-common-utilities.js');

module.exports = [
  /**
   * モック変更
   */
  {
    url: /\/cmnservice\/api\/v1\/loginuseremployeebindmodel\/change\/mock/,
    method: 'POST',
    res: function (req, res, callback) {
      const reqBody = JSON.parse(req.body);
      responseResultList = reqBody.resultList;
      responseStatus = reqBody.status || 200;
      setTimeout(function () {
        callback(null, {
          status: 200,
          headers: {
            'Content-type': 'text/json'
          },
          body: 'change mock'
        });
      });
    }
  },
  {
    /** ログインユーザ従業員結合モデル */
    url: '/cmnservice/api/v1/loginuseremployeebindmodel/common/',
    method: 'get',
    res: function (req, res, callback) {
      setTimeout(function () {
        callback(null, {
          status: 200,
          headers: {
            'Content-type': 'text/json'
          },
          body: JSON.stringify(responseResultList)
        });
      }, 80);
    }
  }
];
