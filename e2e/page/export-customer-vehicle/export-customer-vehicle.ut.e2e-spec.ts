import { browser } from 'protractor';
import { CommonUtils } from '../common-utils';
import { ExportCustomerVehicle } from './export-customer-vehicle.po';
import { ExportCustomerVehicleTestData } from './export-customer-vehicle.ut.test-data';

describe('export-customer-vehicle', () => {
  let page: ExportCustomerVehicle;

  browser.driver.manage().window().maximize();

  beforeAll(() => {
    page = new ExportCustomerVehicle('output');
    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  it('モックの返却値をテストデータに変更', () => {
    CommonUtils.sendXhr('/cmnservice/api/v1/loginuseremployeebindmodel/change/mock', {
      resultList: ExportCustomerVehicleTestData.LOGIN_USER_INFO,
      status: 200
    });
    CommonUtils.sendXhr('/company/api/v1/organizationinformation/change/mock', {
      resultList: ExportCustomerVehicleTestData.ORGANIZATION_INFORMATION,
      status: 200
    });
    CommonUtils.sendXhr('/license/api/v1/serviceavailabilityinfo/change/mock', {
      resultList: ExportCustomerVehicleTestData.SERVICE_AVAILABILITY_INFO_PARTSMAN,
      status: 200
    });
    CommonUtils.sendXhr('/output/api/v1/exportpatterninfo/change/mock', {
      resultList: ExportCustomerVehicleTestData.EXPORT_PATTERN_INFO,
      status: 200
    });
    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  describe('画面項目ケース', () => {

    describe('EL1-1', () => {
      it('画面項目EL1-1_1-1 「売上伝票情報」であること', () => {
        expect(page.getTabText(0)).toEqual('売上伝票情報');
      });
    });

    describe('EL1-2', () => {
      it('画面項目EL1-2_1-1 「債権情報」であること', () => {
        expect(page.getTabText(1)).toEqual('債権情報');
      });
    });

    describe('EL1-3', () => {
      it('画面項目EL1-3_1-1 「仕入伝票情報」であること', () => {
        expect(page.getTabText(2)).toEqual('仕入伝票情報');
      });
    });

    describe('EL1-4', () => {
      it('画面項目EL1-4_1-1 「債務情報」であること', () => {
        expect(page.getTabText(3)).toEqual('債務情報');
      });
    });

    describe('EL1-5', () => {
      it('画面項目EL1-5_1-1 「在庫移動伝票情報」であること', () => {
        expect(page.getTabText(4)).toEqual('在庫移動伝票情報');
      });
    });

    describe('EL1-6', () => {
      it('画面項目EL1-6_1-1 「取引先情報」であること', () => {
        expect(page.getTabText(5)).toEqual('取引先情報');
      });
    });

    describe('EL1-7', () => {
      it('画面項目EL1-7_1-1 「車両管理情報」であること', () => {
        expect(page.getTabText(6)).toEqual('車両管理情報');
      });
    });

    describe('EL1-8', () => {
      it('画面項目EL1-8_1-1 「在庫情報」であること', () => {
        expect(page.getTabText(7)).toEqual('在庫情報');
      });
    });

  });
});
