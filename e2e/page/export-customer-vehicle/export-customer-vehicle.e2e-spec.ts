import { browser } from 'protractor';
import { CommonUtils } from '../common-utils';
import { ExportCustomerVehicle } from './export-customer-vehicle.po';
import { ExportCustomerVehicleTestData } from './export-customer-vehicle.test-data';

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

    describe('Ev1', () => {
      it('シナリオEv1_1-1\n' +
        '  売上伝票情報のタブが表示されること', () => {
          expect(page.getTabText(0)).toEqual('売上伝票情報');
        });
      });

      describe('Ev1', () => {
        it('シナリオEv1_1-2\n' +
          '  仕入伝票情報のタブが表示されること', () => {
          expect(page.getTabText(2)).toEqual('仕入伝票情報');
        });
      });

      describe('Ev1', () => {
        it('シナリオEv1_1-3\n' +
          '  以下のタブが非表示になっていること\n' +
          '  ・顧客・車両情報\n' +
          '  ・伝票情報\n' +
          '  ・作業履歴情報', () => {
          expect(page.getCountTab()).toEqual(8);
          expect(page.getTabText(0)).toEqual('売上伝票情報');
          expect(page.getTabText(1)).toEqual('債権情報');
          expect(page.getTabText(2)).toEqual('仕入伝票情報');
          expect(page.getTabText(3)).toEqual('債務情報');
          expect(page.getTabText(4)).toEqual('在庫移動伝票情報');
          expect(page.getTabText(5)).toEqual('取引先情報');
          expect(page.getTabText(6)).toEqual('車両管理情報');
          expect(page.getTabText(7)).toEqual('在庫情報');
      });
    });

  });
});
