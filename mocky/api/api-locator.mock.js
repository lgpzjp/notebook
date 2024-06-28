const defaultHeader = {
  'Content-Type': 'application/json;charset=UTF-8',
  'X-Server': 'mocky'
};

module.exports = [
  {
    url: '/api/v1/locator/common/common',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "common",
        apiServiceUrl: 'http://localhost:4200/common/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/file',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: 'file',
        apiServiceUrl: 'http://localhost:4200/file/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/report',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: 'report',
        apiServiceUrl: 'http://localhost:4200/report/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/reportevent',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "reportevent",
        apiServiceUrl: 'http://localhost:4200/reportevent/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/vehicle',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "vehicle",
        apiServiceUrl: 'http://localhost:4200/vehicle/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/company',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "company",
        apiServiceUrl: 'http://localhost:4200/company/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/customer',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "customer",
        apiServiceUrl: 'http://localhost:4200/customer/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/contract',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "contract",
        apiServiceUrl: 'http://localhost:4200/contract/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/sales',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "sales",
        apiServiceUrl: 'http://localhost:4200/sales/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/salesevent',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "salesevent",
        apiServiceUrl: 'http://localhost:4200/salesevent/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/credit',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "credit",
        apiServiceUrl: 'http://localhost:4200/g/credit/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/creditevent',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "creditevent",
        apiServiceUrl: 'http://localhost:4200/g/creditevent/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/deals',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "deals",
        apiServiceUrl: 'http://localhost:4200/g/deals/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/dealsevent',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "dealsevent",
        apiServiceUrl: 'http://localhost:4200/g/dealsevent/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/bizcmn',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "bizcmn",
        apiServiceUrl: 'http://localhost:4200/bizcmn/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/cmnservice',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "cmnservice",
        apiServiceUrl: 'http://localhost:4200/cmnservice/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/role',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "role",
        apiServiceUrl: 'http://localhost:4200/role/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/schedule',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "schedule",
        apiServiceUrl: 'http://localhost:4200/g/schedule/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/vehicleapply',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "vehicleapply",
        apiServiceUrl: 'http://localhost:4200/vehicleapply/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/notification',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "notification",
        apiServiceUrl: 'http://localhost:4200/notification/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/bizevent',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "bizevent",
        apiServiceUrl: 'http://localhost:4200/bizevent/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/lam',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "lam",
        apiServiceUrl: 'http://localhost:4200/lam/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/license',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "license",
        apiServiceUrl: 'http://localhost:4200/license/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/migration',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "common",
        apiServiceUrl: 'http://localhost:4200/migration/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/mamigration',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "common",
        apiServiceUrl: 'http://localhost:4200/mamigration/api/v1'
      })
    }
  },
  {
      url: '/api/v1/locator/common/managementreport',
      method: 'get',
      res: {
        status: 200,
        headers: defaultHeader,
        body: JSON.stringify({
          apiServiceName: "managementreport",
          apiServiceUrl: 'http://localhost:4200/managementreport/api/v1'
        })
     }
  },
  {
    url: '/api/v1/locator/common/process',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "process",
        apiServiceUrl: 'http://localhost:4200/g/process/api/v1'
      })
    }
  },
  {
    url: '/public/api/v1/locator/common/common',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "common",
        apiServiceUrl: 'http://localhost:4200/common/api/v1'
      })
    }
  },
  {
    url: '/public/api/v1/locator/common/contract',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "contract",
        apiServiceUrl: 'http://localhost:4200/contract/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/approach',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "approach",
        apiServiceUrl: 'http://localhost:4200/g/approach/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/output',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "output",
        apiServiceUrl: 'http://localhost:4200/g/output/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/billingpf',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "billingplatform",
        apiServiceUrl: 'http://localhost:4200/billingplatform/api/v1'
      })
    }
  },
  {
    url: '/api/v1/locator/common/accounting',
    method: 'get',
    res: {
      status: 200,
      headers: defaultHeader,
      body: JSON.stringify({
        apiServiceName: "accounting",
        apiServiceUrl: '/g/accounting/api/v1'
      })
    }
  },
];
