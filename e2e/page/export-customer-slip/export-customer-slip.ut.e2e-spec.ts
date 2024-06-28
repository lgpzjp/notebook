import { CustomerSlip } from './export-customer-slip.po';
import { CustomerSlipDetail } from './export-customer-slip-detail.po';
import { $, browser } from 'protractor';
import { CommonUtils } from '../common-utils';
import { CustomerSlipTestData } from './export-customer-slip-ita-data';

describe('export-customer-slip', () => {
  let page: CustomerSlip;
  let modal: CustomerSlipDetail;
  browser.driver.manage().window().maximize();

  beforeAll(() => {
    page = new CustomerSlip('export-customer-slip');
    modal = new CustomerSlipDetail($('#exportTabCustomerSlip'));
    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  it('APIレスポンスをITA用のデータに変更\n', () => {

    CommonUtils.sendXhr('/license/api/v1/serviceavailabilityinfo/change/mock', {
      resultList: CustomerSlipTestData.SERVICE_AVAILABILITY_INFO_PARTSMAN,
      status: 200
    });

    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  describe('【UT】画面項目ケース', () => {
    beforeAll(() => {
      page.clickOpenMenu(5);
      modal.clickButton(8);
    });

    describe('イベントID：EL2-1', () => {
      it('EV2-1-1-1 \n' +
         '「出力内容」であること \n', () => {
         expect(modal.getLabelValue(0)).toEqual('出力内容');
        });
    });

    describe('イベントID：EL2-2', () => {
      it('EV2-2-1-1~EV2-2-1-3 \n' +
         '「更新対象期間」であること \n' +
         '「＜１ヶ月前」であること \n' +
         '「１ヶ月先＞」であること \n', () => {
         expect(modal.getLabelValue(1)).toEqual('更新対象期間');
         expect(modal.getButtonValue(1)).toEqual('＜１ヶ月前');
         expect(modal.getButtonValue(6)).toEqual('１ヶ月先＞');
        });
    });

    describe('イベントID：EL2-3', () => {
      it('EV2-3-1-1 \n' +
         '「管理組織」であること \n', () => {
          expect(modal.getLabelValue(2)).toEqual('管理組織');
        });
    });

    describe('イベントID：EL2-4', () => {
      it('EV2-4-1-1 \n' +
         '「詳細条件」であること \n', () => {
          expect(modal.getButtonValue(8)).toEqual('詳細条件');
        });
    });

    describe('イベントID：EL2-4-1-1(得意先)', () => {
      it('EL2-4-1-1 \n' +
         '「得意先コード」であること \n', () => {
          expect(modal.getLabelValue(3)).toEqual('得意先コード');
        });

        it('EL2-4-1-1-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(7, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('');
        });

        it('EL2-4-1-1-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(7, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('1');
        });

        it('EL2-4-1-1-2-4 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(7, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('123456789');
        });

        it('EL2-4-1-1-2-5 \n' +
        '前提条件：1234567890 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(7, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('123456789');
        });

        it('EL2-4-1-1-2-6 \n' +
        '前提条件：1234567890 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(7, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('123456789');
        });

        it('EL2-4-1-1-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(7, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('');
        });

        it('EL2-4-1-1-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(7, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('');
        });
    });

    describe('イベントID：EL2-4-1-2(得意先)', () => {
      it('EL2-4-1-2 \n' +
         '「得意先コード」であること \n', () => {
          expect(modal.getLabelValue(3)).toEqual('得意先コード');
        });

        it('EL2-4-1-2-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(8, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('');
        });

        it('EL2-4-1-2-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(8, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('1');
        });

        it('EL2-4-1-2-2-4 \n' +
        '前提条件：12345678 \n' +
        '「12345678」が入力されること \n', () => {
          modal.inputText(8, '12345678');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('12345678');
        });

        it('EL2-4-1-2-2-5 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(8, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('123456789');
        });

        it('EL2-4-1-2-2-6 \n' +
        '前提条件：1234567890 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(8, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('123456789');
        });

        it('EL2-4-1-2-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(8, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('');
        });

        it('EL2-4-1-2-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(8, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('');
        });
    });

    describe('イベントID：EL2-4-2', () => {
      it('EL2-4-2 \n' +
         '「締日」であること \n', () => {
          expect(modal.getLabelValue(6)).toEqual('締日');
        });

        it('EL2-4-2-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(9, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('');
        });

        it('EL2-4-2-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(9, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('1');
        });

        it('EL2-4-2-2-4 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(9, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('1');
        });

        it('EL2-4-2-2-5 \n' +
        '前提条件：12 \n' +
        '「12」が入力されること \n', () => {
          modal.inputText(9, '12');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('12');
        });

        it('EL2-4-2-2-6 \n' +
        '前提条件：123 \n' +
        '「123」が入力されること \n', () => {
          modal.inputText(9, '123');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('12');
        });

        it('EL2-4-2-3-2 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(9, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('1');
        });

        it('EL2-4-2-3-3 \n' +
        '前提条件：2 \n' +
        '「2」が入力されること \n', () => {
          modal.inputText(9, '2');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('2');
        });

        it('EL2-4-2-3-4 \n' +
        '前提条件：30 \n' +
        '「30」が入力されること \n', () => {
          modal.inputText(9, '30');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('30');
        });

        it('EL2-4-2-3-5 \n' +
        '前提条件：31 \n' +
        '「31」が入力されること \n', () => {
          modal.inputText(9, '31');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('31');
        });

        it('EL2-4-2-3-6 \n' +
        '前提条件：32 \n' +
        '入力できないこと(「3」が入力されること \n', () => {
          modal.inputText(9, '32');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('3');
        });

        it('EL2-4-2-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(9, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('');
        });

        it('EL2-4-2-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(9, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('');
        });
    });

    describe('イベントID：EL2-4-3', () => {
      it('EV2-4-3-1-1 \n' +
         '「取引有無」であること \n', () => {
         expect(modal.getLabelValue(8)).toEqual('取引有無');
        });
    });

    describe('イベントID：EL2-4', () => {
      it('EV2-4-4-1~EV2-4-4-5 \n' +
         '「対象期間」であること \n' +
         '「＜１ヶ月前」であること \n' +
         '「１ヶ月先＞」であること \n', () => {
         expect(modal.getLabelValue(9)).toEqual('対象期間');
         expect(modal.getButtonValue(10)).toEqual('＜１ヶ月前');
         expect(modal.getButtonValue(15)).toEqual('１ヶ月先＞');
        });
    });

    describe('イベントID：EL2-5', () => {
      it('EV2-5-1-1 \n' +
         '「条件取消」であること \n', () => {
          expect(modal.getButtonValue(16)).toEqual('条件取消');
        });
    });

    describe('イベントID：EL2-4-1-1(仕入先)', () => {
      beforeAll(() => {
        modal.clickButton(0);
        modal.clickBtn('bl-select', 'outputCustomerSlip', 1);
      });
      it('EL2-4-1-1 \n' +
         '「仕入先コード」であること \n', () => {
          expect(modal.getLabelValue(3)).toEqual('仕入先コード');
        });

        it('EL2-4-1-1-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(7, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('');
        });

        it('EL2-4-1-1-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(7, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('1');
        });

        it('EL2-4-1-1-2-4 \n' +
        '前提条件：12345678 \n' +
        '「12345678」が入力されること \n', () => {
          modal.inputText(7, '12345678');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('12345678');
        });

        it('EL2-4-1-1-2-5 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(7, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('123456789');
        });

        it('EL2-4-1-1-2-6 \n' +
        '前提条件：1234567890 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(7, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('123456789');
        });

        it('EL2-4-1-1-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(7, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('');
        });

        it('EL2-4-1-1-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(7, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('');
        });
    });

    describe('イベントID：EL2-4-1-2(仕入先)', () => {
      it('EL2-4-1-2 \n' +
         '「仕入先コード」であること \n', () => {
          expect(modal.getLabelValue(3)).toEqual('仕入先コード');
        });

        it('EL2-4-1-2-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(8, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('');
        });

        it('EL2-4-1-2-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(8, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('1');
        });

        it('EL2-4-1-2-2-4 \n' +
        '前提条件：12345678 \n' +
        '「12345678」が入力されること \n', () => {
          modal.inputText(8, '12345678');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('12345678');
        });

        it('EL2-4-1-2-2-5 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(8, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('123456789');
        });

        it('EL2-4-1-2-2-6 \n' +
        '前提条件：1234567890 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(8, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('123456789');
        });

        it('EL2-4-1-2-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(8, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('');
        });

        it('EL2-4-1-2-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(8, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('');
        });
    });
  });
});
