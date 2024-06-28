let responseResultList = {
  blTenantId: 'tenant00000014',
  blUserId : '1',
  permissionCheckList: [
    // 在庫移動伝票情報のテキスト出力
    {
      blFunctionId: "BF340-400410-E",
      permissionExistFlag: true
    },
    // 取引先情報のテキスト出力
    {
      blFunctionId: "BF710-100500-E",
      permissionExistFlag: true
    },
    // 取引先情報のテキスト出力
    {
      blFunctionId: "BF710-100500-E",
      permissionExistFlag: true
    },
    // 車両情報のテキスト出力
    {
      blFunctionId: "BF720-100600-E",
      permissionExistFlag: true
    },
    // 売上伝票情報のテキスト出力
    {
      blFunctionId: "BF390-100700-E",
      permissionExistFlag: true
    },
    // 作業履歴情報のテキスト出力
    {
      blFunctionId: "BF790-100800-E",
      permissionExistFlag: true
    },
    // 債権情報のテキスト出力
    {
      blFunctionId: "BF391-400380-E",
      permissionExistFlag: true
    },
    // 債務情報のテキスト出力
    {
      blFunctionId: "BF3A1-400390-E",
      permissionExistFlag: true
    },
    // 在庫情報のテキスト出力
    {
      blFunctionId: "BF340-400400-E",
      permissionExistFlag: true
    }
  ]
}

let permissionList = responseResultList.permissionCheckList;
const util = require('./api-common-utilities.js');

module.exports = [
  /**
   * モック変更
   */
  {
    url: /\/role\/api\/v1\/useravailablepermission\/change\/mock/,
    method: 'POST',
    res: function (req, res, callback) {
      const reqBody = JSON.parse(req.body);
      responseResultList = reqBody.resultList;
      permissionList = responseResultList.permissionCheckList;
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
    url: '/role/api/v1/useravailablepermission/common/forbidden',
    method: 'get',
    res: function (req, res, callback) {
      const unavailablePermissionList = permissionList.filter(val => {
        return !val.permissionExistFlag;
      });
      responseResultList.permissionCheckList = unavailablePermissionList;
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
  },
  {
    url: '/role/api/v1/useravailablepermission/common',
    method: 'get',
    res: function (req, res, callback) {
      const availablePermissionList = responseResultList.permissionCheckList.filter(val => {
        return val.permissionExistFlag;
      });
      responseResultList.permissionCheckList = availablePermissionList;
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
