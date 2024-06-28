import { StockMoveSlip } from './export-stock-move-slip.po';
import { StockMoveSlipDetail } from './export-stock-move-slip-detail.po';
import { $, browser } from 'protractor';
import { CommonUtils } from '../common-utils';
import { StockMoveSlipTestData } from './export-stock-move-slip-ita-data';

describe('export-stock-move-slip', () => {
  let page: StockMoveSlip;
  let modal: StockMoveSlipDetail;
  browser.driver.manage().window().maximize();

  beforeAll(() => {
    page = new StockMoveSlip('export-stock-move-slip');
    modal = new StockMoveSlipDetail($('#exportTabStockMoveSlip'));
    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  it('APIレスポンスをITA用のデータに変更\n', () => {

    CommonUtils.sendXhr('/license/api/v1/serviceavailabilityinfo/change/mock', {
      resultList: StockMoveSlipTestData.SERVICE_AVAILABILITY_INFO_PARTSMAN,
      status: 200
    });

    CommonUtils.sendXhr('/bizcmn/api/v1/stockmgtsetting/change/mock', {
      resultList: StockMoveSlipTestData.STOCKMGTSETTING_MASTER_INFO1,
      status: 200
    });

    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  describe('【UT】画面項目ケース', () => {
    beforeAll(() => {
      page.clickOpenMenu(4);
      modal.clickButton(9);
    });

    describe('イベントID：EL2-1', () => {
      it('EV2-1-1-1~EV2-1-1-4 \n' +
         '「出力内容」であること \n' +
         '「出荷」であること \n' +
         '「未入荷」であること \n' +
         '「入荷済」であること \n', () => {
         expect(modal.getLabelValue(0)).toEqual('出力内容');
         expect(modal.getLabelValue(1)).toEqual('出荷');
         expect(modal.getLabelValue(2)).toEqual('未入荷');
         expect(modal.getLabelValue(3)).toEqual('入荷済');
        });
    });

    describe('イベントID：EL2-2', () => {
      it('EV2-2-1-1~EV2-2-1-3 \n' +
         '「対象期間」であること \n' +
         '「＜１ヶ月前」であること \n' +
         '「１ヶ月先＞」であること \n', () => {
         expect(modal.getLabelValue(4)).toEqual('対象期間');
         expect(modal.getButtonValue(1)).toEqual('＜１ヶ月前');
         expect(modal.getButtonValue(6)).toEqual('１ヶ月先＞');
        });
    });

    describe('イベントID：EL2-3', () => {
      it('EV2-3-1-1 \n' +
         '「出庫組織」であること \n', () => {
          expect(modal.getLabelValue(5)).toEqual('出庫組織');
        });
    });

    describe('イベントID：EL2-4', () => {
      it('EV2-4-1-1 \n' +
         '「入庫組織」であること \n', () => {
          expect(modal.getLabelValue(6)).toEqual('入庫組織');
        });
    });

    describe('イベントID：EL2-5', () => {
      it('EV2-5-1-1 \n' +
         '「詳細条件」であること \n', () => {
          expect(modal.getButtonValue(9)).toEqual('詳細条件');
        });
    });

    describe('イベントID：EL2-5-1-1', () => {
      it('EL2-5-1-1 \n' +
         '「出庫倉庫コード」であること \n', () => {
          expect(modal.getLabelValue(7)).toEqual('出庫倉庫コード');
        });

        it('EL2-5-1-1-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(8, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('');
        });

        it('EL2-5-1-1-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(8, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('1');
        });

        it('EL2-5-1-1-2-4 \n' +
        '前提条件：12345 \n' +
        '「12345」が入力されること \n', () => {
          modal.inputText(8, '12345');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('12345');
        });

        it('EL2-5-1-1-2-5 \n' +
        '前提条件：123456 \n' +
        '「123456」が入力されること \n', () => {
          modal.inputText(8, '123456');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('123456');
        });

        it('EL2-5-1-1-2-6 \n' +
        '前提条件：1234567 \n' +
        '「123456」が入力されること \n', () => {
          modal.inputText(8, '1234567');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('123456');
        });

        it('EL2-5-1-1-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(8, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('');
        });

        it('EL2-5-1-1-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(8, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-1-2', () => {
      it('EL2-5-1-2 \n' +
         '「出庫倉庫コード」であること \n', () => {
          expect(modal.getLabelValue(7)).toEqual('出庫倉庫コード');
        });

        it('EL2-5-1-2-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(9, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('');
        });

        it('EL2-5-1-2-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(9, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('1');
        });

        it('EL2-5-1-2-2-4 \n' +
        '前提条件：12345 \n' +
        '「12345」が入力されること \n', () => {
          modal.inputText(9, '12345');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('12345');
        });

        it('EL2-5-1-2-2-5 \n' +
        '前提条件：123456 \n' +
        '「123456」が入力されること \n', () => {
          modal.inputText(9, '123456');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('123456');
        });

        it('EL2-5-1-2-2-6 \n' +
        '前提条件：1234567 \n' +
        '「123456」が入力されること \n', () => {
          modal.inputText(9, '1234567');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('123456');
        });

        it('EL2-5-1-2-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(9, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('');
        });

        it('EL2-5-1-2-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(9, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-2-1', () => {
      it('EL2-5-2-1 \n' +
         '「入庫倉庫コード」であること \n', () => {
          expect(modal.getLabelValue(10)).toEqual('入庫倉庫コード');
        });

        it('EL2-5-2-1-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(10, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('');
        });

        it('EL2-5-2-1-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(10, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('1');
        });

        it('EL2-5-2-1-2-4 \n' +
        '前提条件：12345 \n' +
        '「12345」が入力されること \n', () => {
          modal.inputText(10, '12345');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('12345');
        });

        it('EL2-5-2-1-2-5 \n' +
        '前提条件：123456 \n' +
        '「123456」が入力されること \n', () => {
          modal.inputText(10, '123456');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('123456');
        });

        it('EL2-5-2-1-2-6 \n' +
        '前提条件：1234567 \n' +
        '「123456」が入力されること \n', () => {
          modal.inputText(10, '1234567');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('123456');
        });

        it('EL2-5-2-1-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(10, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('');
        });

        it('EL2-5-2-1-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(10, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-2-2', () => {
      it('EL2-5-2-2 \n' +
         '「入庫倉庫コード」であること \n', () => {
          expect(modal.getLabelValue(10)).toEqual('入庫倉庫コード');
        });

        it('EL2-5-2-2-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(11, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('');
        });

        it('EL2-5-2-2-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(11, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('1');
        });

        it('EL2-5-2-2-2-4 \n' +
        '前提条件：12345 \n' +
        '「12345」が入力されること \n', () => {
          modal.inputText(11, '12345');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('12345');
        });

        it('EL2-5-2-2-2-5 \n' +
        '前提条件：123456 \n' +
        '「123456」が入力されること \n', () => {
          modal.inputText(11, '123456');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('123456');
        });

        it('EL2-5-2-2-2-6 \n' +
        '前提条件：1234567 \n' +
        '「123456」が入力されること \n', () => {
          modal.inputText(11, '1234567');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('123456');
        });

        it('EL2-5-2-2-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(11, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('');
        });

        it('EL2-5-2-2-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(11, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-3-1', () => {
      it('EL2-5-3-1 \n' +
         '「担当者コード」であること \n', () => {
          expect(modal.getLabelValue(13)).toEqual('担当者コード');
        });

        it('EL2-5-3-1-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(12, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('');
        });

        it('EL2-5-3-1-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(12, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('1');
        });

        it('EL2-5-3-1-2-4 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(12, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('123456789');
        });

        it('EL2-5-3-1-2-5 \n' +
        '前提条件：1234567890 \n' +
        '「1234567890」が入力されること \n', () => {
          modal.inputText(12, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('1234567890');
        });

        it('EL2-5-3-1-2-6 \n' +
        '前提条件：12345678901 \n' +
        '「1234567890」が入力されること \n', () => {
          modal.inputText(12, '12345678901');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('1234567890');
        });

        it('EL2-5-3-1-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(12, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('');
        });

        it('EL2-5-3-1-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(12, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-3-2', () => {
      it('EL2-5-3-2 \n' +
         '「担当者コード」であること \n', () => {
          expect(modal.getLabelValue(13)).toEqual('担当者コード');
        });

        it('EL2-5-3-2-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(13, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('');
        });

        it('EL2-5-3-2-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(13, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('1');
        });

        it('EL2-5-3-2-2-4 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(13, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('123456789');
        });

        it('EL2-5-3-2-2-5 \n' +
        '前提条件：1234567890 \n' +
        '「1234567890」が入力されること \n', () => {
          modal.inputText(13, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('1234567890');
        });

        it('EL2-5-3-2-2-6 \n' +
        '前提条件：12345678901 \n' +
        '「1234567890」が入力されること \n', () => {
          modal.inputText(13, '12345678901');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('1234567890');
        });

        it('EL2-5-3-2-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(13, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('');
        });

        it('EL2-5-3-2-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(13, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-4-1', () => {
      it('EL2-5-4-1 \n' +
         '「メーカーコード」であること \n', () => {
          expect(modal.getLabelValue(16)).toEqual('メーカーコード');
        });

        it('EL2-5-4-1-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(14, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('');
        });

        it('EL2-5-4-1-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(14, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('1');
        });

        it('EL2-5-4-1-2-4 \n' +
        '前提条件：12345678 \n' +
        '「12345678」が入力されること \n', () => {
          modal.inputText(14, '12345678');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('12345678');
        });

        it('EL2-5-4-1-2-5 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(14, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('123456789');
        });

        it('EL2-5-4-1-2-6 \n' +
        '前提条件：1234567890 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(14, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('123456789');
        });

        it('EL2-5-4-1-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(14, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('');
        });

        it('EL2-5-4-1-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(14, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-4-2', () => {
      it('EL2-5-4-2 \n' +
         '「メーカーコード」であること \n', () => {
          expect(modal.getLabelValue(16)).toEqual('メーカーコード');
        });

        it('EL2-5-4-2-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(15, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('');
        });

        it('EL2-5-4-2-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(15, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('1');
        });

        it('EL2-5-4-2-2-4 \n' +
        '前提条件：12345678 \n' +
        '「12345678」が入力されること \n', () => {
          modal.inputText(15, '12345678');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('12345678');
        });

        it('EL2-5-4-2-2-5 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(15, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('123456789');
        });

        it('EL2-5-4-2-2-6 \n' +
        '前提条件：1234567890 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(15, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('123456789');
        });

        it('EL2-5-4-2-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(15, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('');
        });

        it('EL2-5-4-2-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(15, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-5', () => {
      it('EL2-5-5 \n' +
         '「品番」であること \n', () => {
          expect(modal.getLabelValue(19)).toEqual('品番');
        });

        it('EL2-5-5-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(16, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('');
        });

        it('EL2-5-5-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(16, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('1');
        });

        it('EL2-5-5-2-4 \n' +
        '前提条件：12345678901234567890123 \n' +
        '「12345678901234567890123」が入力されること \n', () => {
          modal.inputText(16, '12345678901234567890123');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('12345678901234567890123');
        });

        it('EL2-5-5-2-5 \n' +
        '前提条件：123456789012345678901234 \n' +
        '「123456789012345678901234」が入力されること \n', () => {
          modal.inputText(16, '123456789012345678901234');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('123456789012345678901234');
        });

        it('EL2-5-5-2-6 \n' +
        '前提条件：1234567890123456789012345 \n' +
        '「123456789012345678901234」が入力されること \n', () => {
          modal.inputText(16, '1234567890123456789012345');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('123456789012345678901234');
        });

        it('EL2-5-5-4-1 \n' +
        '12-Azaz \n' +
        '「12-AZaz」が入力されること \n', () => {
          modal.inputText(16, '12-Azaz');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('12-Azaz');
        });

        it('EL2-5-5-4-2 \n' +
        '前提条件：Ａあア参 \n' +
        '「Ａあア参」が入力されること \n', () => {
          modal.inputText(16, 'Ａあア参');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('Ａあア参');
        });

        it('EL2-5-5-4-3 \n' +
        '前提条件：１２３４５６ \n' +
        '「１２３４５６」が入力されること \n', () => {
          modal.inputText(16, '１２３４５６');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('１２３４５６');
        });
    });

    describe('イベントID：EL2-5-6', () => {
      it('EL2-5-6 \n' +
         '「品名」であること \n', () => {
          expect(modal.getLabelValue(22)).toEqual('品名');
        });

        it('EL2-5-6-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(17, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('');
        });

        it('EL2-5-6-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(17, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('1');
        });

        it('EL2-5-6-2-4 \n' +
        '前提条件：123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789 \n' +
        '「123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789」が入力されること \n', () => {
          modal.inputText(17, '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('12345678901234567890123456789012345678901234567890123456789'
          + '0123456789012345678901234567890123456789');
        });

        it('EL2-5-6-2-5 \n' +
        '前提条件：1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890 \n' +
        '「1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890」が入力されること \n', () => {
          modal.inputText(17, '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('12345678901234567890123456789012345678901234567890123456'
          + '78901234567890123456789012345678901234567890');
        });

        it('EL2-5-6-2-6 \n' +
        '前提条件：12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901 \n' +
        '「1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890」が入力されること \n', () => {
          modal.inputText(17, '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('1234567890123456789012345678901234567890123456789012'
          + '345678901234567890123456789012345678901234567890');
        });

        it('EL2-5-6-4-1 \n' +
        '12-Azaz \n' +
        '「12-AZaz」が入力されること \n', () => {
          modal.inputText(17, '12-Azaz');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('12-Azaz');
        });

        it('EL2-5-6-4-2 \n' +
        '前提条件：Ａあア参 \n' +
        '「Ａあア参」が入力されること \n', () => {
          modal.inputText(17, 'Ａあア参');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('Ａあア参');
        });

        it('EL2-5-6-4-3 \n' +
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
          expect(modal.getButtonValue(10)).toEqual('条件取消');
        });
    });
  });
});
