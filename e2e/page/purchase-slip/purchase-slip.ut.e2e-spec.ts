import { PurchaseSlip } from './purchase-slip.po';
import { PurchaseSlipDetail } from './purchase-slip-detail.po';
import { $, browser } from 'protractor';
import { CommonUtils } from '../common-utils';
import { PurchaseSlipTestData } from './purchase-slip-ita-data';

describe('purchase-slip', () => {
  let page: PurchaseSlip;
  let modal: PurchaseSlipDetail;
  browser.driver.manage().window().maximize();

  beforeAll(() => {
    page = new PurchaseSlip('export-purchase-slip');
    modal = new PurchaseSlipDetail($('#exportTabPurchaseSlip'));
    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  it('APIレスポンスをITA用のデータに変更\n', () => {

    CommonUtils.sendXhr('/license/api/v1/serviceavailabilityinfo/change/mock', {
      resultList: PurchaseSlipTestData.SERVICE_AVAILABILITY_INFO_PARTSMAN,
      status: 200
    });

    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  describe('【UT】画面項目ケース', () => {
    beforeAll(() => {
      page.clickOpenMenu(2);
      modal.ClickElement('bl-select', 'exportInfoTypePurchase');
      modal.clickBtn('button.btn.dropdown-item', 1);
      modal.ClickElement('button', 'onPanelPurchase');
    });

    describe('イベントID：EL2-1', () => {
      it('EV2-1-1-2~EV2-1-1-6 \n' +
         '「出力内容」であること \n' +
         '「仕入」であること \n' +
         '「入荷」であること \n' +
         '「発注」であること \n' +
         '「返品予定」であること \n' +
         '「出金」であること \n', () => {
         expect(modal.getLabelValue(0)).toEqual('出力内容');
         expect(modal.getLabelValue(1)).toEqual('仕入');
         expect(modal.getLabelValue(2)).toEqual('発注');
         expect(modal.getLabelValue(3)).toEqual('入荷');
         expect(modal.getLabelValue(4)).toEqual('返品予定');
         expect(modal.getLabelValue(5)).toEqual('出金');
        });
    });

    describe('イベントID：EL2-2', () => {
      it('EV2-2-1-2~EV2-2-1-3 \n' +
         '「対象期間」であること \n' +
         '「＜１ヶ月前」であること \n' +
         '「１ヶ月先＞」であること \n', () => {
         expect(modal.getLabelValue(6)).toEqual('対象期間');
         expect(modal.getButtonValue(1)).toEqual('＜１ヶ月前');
         expect(modal.getButtonValue(6)).toEqual('１ヶ月先＞');
        });
    });

    describe('イベントID：EL2-3', () => {
      it('EV2-3-1-1 \n' +
         '「出力タイプ」であること \n', () => {
          expect(modal.getLabelValue(7)).toEqual('出力タイプ');
        });
    });

    describe('イベントID：EL2-4', () => {
      it('EV2-4-1-1 \n' +
         '「組織」であること \n', () => {
          expect(modal.getLabelValue(8)).toEqual('組織');
        });
    });

    describe('イベントID：EL2-5', () => {
      it('EV2-5-1-1 \n' +
         '「詳細条件」であること \n', () => {
          expect(modal.getButtonValue(11)).toEqual('詳細条件');
        });
    });

    describe('イベントID：EL2-5-1-1', () => {
      it('EL2-5-1-1 \n' +
         '「担当者コード」であること \n', () => {
          expect(modal.getLabelValue(9)).toEqual('担当者コード');
        });

        it('EL2-5-1-1-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(7, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('');
        });

        it('EL2-5-1-1-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(7, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('1');
        });

        it('EL2-5-1-1-2-4 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(7, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('123456789');
        });

        it('EL2-5-1-1-2-5 \n' +
        '前提条件：1234567890 \n' +
        '「1234567890」が入力されること \n', () => {
          modal.inputText(7, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('1234567890');
        });

        it('EL2-5-1-1-2-6 \n' +
        '前提条件：12345678901 \n' +
        '「1234567890」が入力されること \n', () => {
          modal.inputText(7, '12345678901');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('1234567890');
        });

        it('EL2-5-1-1-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(7, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('');
        });

        it('EL2-5-1-1-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(7, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-1-2', () => {
      it('EL2-5-1-2 \n' +
         '「担当者コード」であること \n', () => {
          expect(modal.getLabelValue(9)).toEqual('担当者コード');
        });

        it('EL2-5-1-2-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(8, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('');
        });

        it('EL2-5-1-2-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(8, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('1');
        });

        it('EL2-5-1-2-2-4 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(8, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('123456789');
        });

        it('EL2-5-1-2-2-5 \n' +
        '前提条件：1234567890 \n' +
        '「1234567890」が入力されること \n', () => {
          modal.inputText(8, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('1234567890');
        });

        it('EL2-5-1-2-2-6 \n' +
        '前提条件：12345678901 \n' +
        '「1234567890」が入力されること \n', () => {
          modal.inputText(8, '12345678901');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('1234567890');
        });

        it('EL2-5-1-2-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(8, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('');
        });

        it('EL2-5-1-2-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(8, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-4-1', () => {
      it('EL2-5-4-1 \n' +
         '「仕入先コード」であること \n', () => {
          expect(modal.getLabelValue(15)).toEqual('仕入先コード');
        });

        it('EL2-5-4-1-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(9, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('');
        });

        it('EL2-5-4-1-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(9, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('1');
        });

        it('EL2-5-4-1-2-4 \n' +
        '前提条件：12345678 \n' +
        '「12345678」が入力されること \n', () => {
          modal.inputText(9, '12345678');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('12345678');
        });

        it('EL2-5-4-1-2-5 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(9, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('123456789');
        });

        it('EL2-5-4-1-2-6 \n' +
        '前提条件：1234567890 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(9, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('123456789');
        });

        it('EL2-5-4-1-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(9, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('');
        });

        it('EL2-5-4-1-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(9, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-4-2', () => {
      it('EL2-5-4-2 \n' +
         '「仕入先コード」であること \n', () => {
          expect(modal.getLabelValue(15)).toEqual('仕入先コード');
        });

        it('EL2-5-4-2-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(10, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('');
        });

        it('EL2-5-4-2-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(10, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('1');
        });

        it('EL2-5-4-2-2-4 \n' +
        '前提条件：12345678 \n' +
        '「12345678」が入力されること \n', () => {
          modal.inputText(10, '12345678');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('12345678');
        });

        it('EL2-5-4-2-2-5 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(10, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('123456789');

        });

        it('EL2-5-4-2-2-6 \n' +
        '前提条件：1234567890 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(10, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('123456789');
        });

        it('EL2-5-4-2-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(10, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('');
        });

        it('EL2-5-4-2-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(10, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-5', () => {
      it('EL2-5-5 \n' +
         '「締日」であること \n', () => {
          expect(modal.getLabelValue(18)).toEqual('締日');
        });

        it('EL2-5-5-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(11, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('');
        });

        it('EL2-5-5-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(11, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('1');
        });

        it('EL2-5-5-2-4 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(11, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('1');
        });

        it('EL2-5-5-2-5 \n' +
        '前提条件：12 \n' +
        '「12」が入力されること \n', () => {
          modal.inputText(11, '12');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('12');
        });

        it('EL2-5-5-2-6 \n' +
        '前提条件：123 \n' +
        '「123」が入力されること \n', () => {
          modal.inputText(11, '123');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('12');
        });

        it('EL2-5-5-3-2 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(11, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('1');
        });

        it('EL2-5-5-3-3 \n' +
        '前提条件：2 \n' +
        '「2」が入力されること \n', () => {
          modal.inputText(11, '2');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('2');
        });

        it('EL2-5-5-3-4 \n' +
        '前提条件：30 \n' +
        '「30」が入力されること \n', () => {
          modal.inputText(11, '30');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('30');
        });

        it('EL2-5-5-3-5 \n' +
        '前提条件：31 \n' +
        '「31」が入力されること \n', () => {
          modal.inputText(11, '31');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('31');
        });

        it('EL2-5-5-3-6 \n' +
        '前提条件：32 \n' +
        '入力できないこと(「3」が入力されること \n', () => {
          modal.inputText(11, '32');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('3');
        });

        it('EL2-5-5-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(11, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('');
        });

        it('EL2-5-5-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(11, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-6-1', () => {
      it('EL2-5-6-1 \n' +
         '「倉庫コード」であること \n', () => {
          expect(modal.getLabelValue(20)).toEqual('倉庫コード');
        });

        it('EL2-5-6-1-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(12, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('');
        });

        it('EL2-5-6-1-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(12, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('1');
        });

        it('EL2-5-6-1-2-4 \n' +
        '前提条件：12345 \n' +
        '「12345」が入力されること \n', () => {
          modal.inputText(12, '12345');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('12345');
        });

        it('EL2-5-6-1-2-5 \n' +
        '前提条件：123456 \n' +
        '「123456」が入力されること \n', () => {
          modal.inputText(12, '123456');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('123456');
        });

        it('EL2-5-6-1-2-6 \n' +
        '前提条件：1234567 \n' +
        '「123456」が入力されること \n', () => {
          modal.inputText(12, '1234567');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('123456');
        });

        it('EL2-5-6-1-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(12, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('');
        });

        it('EL2-5-6-1-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(12, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-6-2', () => {
      it('EL2-5-6-2 \n' +
         '「倉庫コード」であること \n', () => {
          expect(modal.getLabelValue(20)).toEqual('倉庫コード');
        });

        it('EL2-5-6-2-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(13, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('');
        });

        it('EL2-5-6-2-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(13, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('1');
        });

        it('EL2-5-6-2-2-4 \n' +
        '前提条件：12345 \n' +
        '「12345」が入力されること \n', () => {
          modal.inputText(13, '12345');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('12345');
        });

        it('EL2-5-6-2-2-5 \n' +
        '前提条件：123456 \n' +
        '「123456」が入力されること \n', () => {
          modal.inputText(13, '123456');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('123456');
        });

        it('EL2-5-6-2-2-6 \n' +
        '前提条件：1234567 \n' +
        '「123456」が入力されること \n', () => {
          modal.inputText(13, '1234567');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('123456');
        });

        it('EL2-5-6-2-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(13, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('');
        });

        it('EL2-5-6-2-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(13, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-7-1', () => {
      it('EL2-5-7-1 \n' +
         '「メーカーコード」であること \n', () => {
          expect(modal.getLabelValue(23)).toEqual('メーカーコード');
        });

        it('EL2-5-7-1-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(14, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('');
        });

        it('EL2-5-7-1-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(14, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('1');
        });

        it('EL2-5-7-1-2-4 \n' +
        '前提条件：12345678 \n' +
        '「12345678」が入力されること \n', () => {
          modal.inputText(14, '12345678');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('12345678');
        });

        it('EL2-5-7-1-2-5 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(14, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('123456789');
        });

        it('EL2-5-7-1-2-6 \n' +
        '前提条件：1234567890 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(14, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('123456789');
        });

        it('EL2-5-7-1-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(14, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('');
        });

        it('EL2-5-7-1-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(14, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-7-2', () => {
      it('EL2-5-7-2 \n' +
         '「メーカーコード」であること \n', () => {
          expect(modal.getLabelValue(23)).toEqual('メーカーコード');
        });

        it('EL2-5-7-2-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(15, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('');
        });

        it('EL2-5-7-2-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(15, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('1');
        });

        it('EL2-5-7-2-2-4 \n' +
        '前提条件：12345678 \n' +
        '「12345678」が入力されること \n', () => {
          modal.inputText(15, '12345678');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('12345678');
        });

        it('EL2-5-7-2-2-5 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(15, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('123456789');
        });

        it('EL2-5-7-2-2-6 \n' +
        '前提条件：1234567890 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(15, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('123456789');
        });

        it('EL2-5-7-2-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(15, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('');
        });

        it('EL2-5-7-2-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(15, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-8', () => {
      it('EL2-5-8 \n' +
         '「品番」であること \n', () => {
          expect(modal.getLabelValue(26)).toEqual('品番');
        });

        it('EL2-5-8-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(16, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('');
        });

        it('EL2-5-8-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(16, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('1');
        });

        it('EL2-5-8-2-4 \n' +
        '前提条件：12345678901234567890123 \n' +
        '「12345678901234567890123」が入力されること \n', () => {
          modal.inputText(16, '12345678901234567890123');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('12345678901234567890123');
        });

        it('EL2-5-8-2-5 \n' +
        '前提条件：123456789012345678901234 \n' +
        '「123456789012345678901234」が入力されること \n', () => {
          modal.inputText(16, '123456789012345678901234');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('123456789012345678901234');
        });

        it('EL2-5-8-2-6 \n' +
        '前提条件：1234567890123456789012345 \n' +
        '「123456789012345678901234」が入力されること \n', () => {
          modal.inputText(16, '1234567890123456789012345');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('123456789012345678901234');
        });

        it('EL2-5-8-4-1 \n' +
        '12-Azaz \n' +
        '「12-AZaz」が入力されること \n', () => {
          modal.inputText(16, '12-Azaz');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('12-Azaz');
        });

        it('EL2-5-8-4-2 \n' +
        '前提条件：Ａあア参 \n' +
        '「Ａあア参」が入力されること \n', () => {
          modal.inputText(16, 'Ａあア参');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('Ａあア参');
        });

        it('EL2-5-8-4-3 \n' +
        '前提条件：１２３４５６ \n' +
        '「１２３４５６」が入力されること \n', () => {
          modal.inputText(16, '１２３４５６');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('１２３４５６');
        });
    });

    describe('イベントID：EL2-5-9', () => {
      it('EL2-5-9 \n' +
         '「品名」であること \n', () => {
          expect(modal.getLabelValue(29)).toEqual('品名');
        });

        it('EL2-5-9-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(17, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('');
        });

        it('EL2-5-9-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(17, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('1');
        });

        it('EL2-5-9-2-4 \n' +
        '前提条件：123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789 \n' +
        '「123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789」が入力されること \n', () => {
          modal.inputText(17, '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('12345678901234567890123456789012345678901234567890123456789'
          + '0123456789012345678901234567890123456789');
        });

        it('EL2-5-9-2-5 \n' +
        '前提条件：1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890 \n' +
        '「1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890」が入力されること \n', () => {
          modal.inputText(17, '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('12345678901234567890123456789012345678901234567890123456'
          + '78901234567890123456789012345678901234567890');
        });

        it('EL2-5-9-2-6 \n' +
        '前提条件：12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901 \n' +
        '「1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890」が入力されること \n', () => {
          modal.inputText(17, '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('1234567890123456789012345678901234567890123456789012'
          + '345678901234567890123456789012345678901234567890');
        });

        it('EL2-5-9-4-1 \n' +
        '12-Azaz \n' +
        '「12-AZaz」が入力されること \n', () => {
          modal.inputText(17, '12-Azaz');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('12-Azaz');
        });

        it('EL2-5-9-4-2 \n' +
        '前提条件：Ａあア参 \n' +
        '「Ａあア参」が入力されること \n', () => {
          modal.inputText(17, 'Ａあア参');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('Ａあア参');
        });

        it('EL2-5-9-4-3 \n' +
        '前提条件：１２３４５６ \n' +
        '「１２３４５６」が入力されること \n', () => {
          modal.inputText(17, '１２３４５６');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('１２３４５６');
        });
    });

    describe('イベントID：EL2-6', () => {
      it('EV2-6-1-1 \n' +
         '「条件取消」であること \n', () => {
          expect(modal.getButtonValue(14)).toEqual('条件取消');
        });
    });
  });
});
