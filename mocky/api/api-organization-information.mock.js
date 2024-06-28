const datas = [
  { blTenantId: 'tenant00000014', applyStartDate: '2000-01-01', applyEndDate: '2999-12-31', companyMgtCode: 0, changeMgtCode: 31, logicalDeleteDiv: '0', updateCtrlId: '', organizationCode: '000000', organizationName: '本社', parentOrganizationCode: '', organizationLayerCode: 2, officeCode: 9 },
  { blTenantId: 'tenant00000014', applyStartDate: '2000-01-01', applyEndDate: '2999-12-31', companyMgtCode: 0, changeMgtCode: 31, logicalDeleteDiv: '0', updateCtrlId: '', organizationCode: '000002', organizationName: '天神', parentOrganizationCode: '', organizationLayerCode: 2, officeCode: 9 },
  { blTenantId: 'tenant00000014', applyStartDate: '2000-01-01', applyEndDate: '2999-12-31', companyMgtCode: 0, changeMgtCode: 31, logicalDeleteDiv: '0', updateCtrlId: '', organizationCode: '000003', organizationName: '薬院', parentOrganizationCode: '', organizationLayerCode: 2, officeCode: 9 },
  { blTenantId: 'tenant00000014', applyStartDate: '2000-01-01', applyEndDate: '2999-12-31', companyMgtCode: 0, changeMgtCode: 31, logicalDeleteDiv: '1', updateCtrlId: '', organizationCode: '000004', organizationName: '平尾', parentOrganizationCode: '', organizationLayerCode: 2, officeCode: 9 },
  { blTenantId: 'tenant00000014', applyStartDate: '2000-01-01', applyEndDate: '2999-12-31', companyMgtCode: 0, changeMgtCode: 31, logicalDeleteDiv: '0', updateCtrlId: '', organizationCode: '000005', organizationName: '高宮', parentOrganizationCode: '', organizationLayerCode: 2, officeCode: 9 },
  { blTenantId: 'tenant00000014', applyStartDate: '2000-01-01', applyEndDate: '2999-12-31', companyMgtCode: 0, changeMgtCode: 31, logicalDeleteDiv: '0', updateCtrlId: '', organizationCode: '000006', organizationName: '大橋', parentOrganizationCode: '', organizationLayerCode: 2, officeCode: 9 },
  { blTenantId: 'tenant00000014', applyStartDate: '2000-01-01', applyEndDate: '2999-12-31', companyMgtCode: 0, changeMgtCode: 31, logicalDeleteDiv: '0', updateCtrlId: '', organizationCode: '000007', organizationName: '井尻', parentOrganizationCode: '', organizationLayerCode: 2, officeCode: 9 },
  { blTenantId: 'tenant00000014', applyStartDate: '2000-01-01', applyEndDate: '2999-12-31', companyMgtCode: 0, changeMgtCode: 31, logicalDeleteDiv: '0', updateCtrlId: '', organizationCode: '000008', organizationName: '雑餉隈', parentOrganizationCode: '', organizationLayerCode: 2, officeCode: 9 },
  { blTenantId: 'tenant00000014', applyStartDate: '2000-01-01', applyEndDate: '2999-12-31', companyMgtCode: 0, changeMgtCode: 31, logicalDeleteDiv: '0', updateCtrlId: '', organizationCode: '000009', organizationName: '春日原', parentOrganizationCode: '', organizationLayerCode: 2, officeCode: 9 },
  { blTenantId: 'tenant00000014', applyStartDate: '2000-01-01', applyEndDate: '2999-12-31', companyMgtCode: 0, changeMgtCode: 31, logicalDeleteDiv: '0', updateCtrlId: '', organizationCode: '000010', organizationName: '白木原', parentOrganizationCode: '', organizationLayerCode: 2, officeCode: 9 },
  { blTenantId: 'tenant00000014', applyStartDate: '2000-01-01', applyEndDate: '2999-12-31', companyMgtCode: 0, changeMgtCode: 31, logicalDeleteDiv: '0', updateCtrlId: '', organizationCode: '000011', organizationName: '下大利', parentOrganizationCode: '', organizationLayerCode: 2, officeCode: 9 },
];

function findOrganization(organizationCode) {
  const data = [];
  for (let i = 0; i < datas.length; i++) {
    if (datas[i].organizationCode == organizationCode) {
      data.push(datas[i]);
    }
  }
  return data;
}

let responseResultList = datas;
let responseStatus = 200;

const util = require('./api-common-utilities.js');
var _ = require('lodash');

module.exports = [
  /**
   * モック変更
   */
  {
    url: /\/company\/api\/v1\/organizationinformation\/change\/mock/,
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
    url: /\/company\/api\/v1\/organizationinformation\/common\/(search|find)?\?*/,
    method: 'get',
    res: function (req, res, callback) {
      setTimeout(function () {
        const params = req.url.match(/organizationCode:eq:([0-9a-zA-Z]+)/);
        let data = datas;
        if (params && params[1]) {
          data = findOrganization(params[1]);
        }
        if (data.length === 0) {
          callback(null, {
            status: 204,
            headers: {
              'Content-type': 'text/json'
            },
          });
        } else {
          callback(null, {
            status: 200,
            headers: {
              'Content-type': 'text/json'
            },
            body: JSON.stringify({
              totalCount: data.length,
              searchResultList: data
            })
          });
        }
      });
    }
  },
  {
    url: /\/company\/api\/v1\/organizationinformation\/all\/(searchwithallorg|find)?\?*/,
    method: 'get',
    res: function (req, res, callback) {
      setTimeout(function () {
        callback(null, {
          status: 200,
          headers: {
            'Content-type': 'text/json'
          },
          body: JSON.stringify({
            totalCount: responseResultList.length,
            searchResultList: responseResultList
          })
        });
      }, 80);
    }
  }
];
