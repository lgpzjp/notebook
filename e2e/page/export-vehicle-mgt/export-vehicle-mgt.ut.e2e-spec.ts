import { VehicleMgt } from './export-vehicle-mgt.po';
import { VehicleMgtDetail } from './export-vehicle-mgt-detail.po';
import { $, browser } from 'protractor';
import { CommonUtils } from '../common-utils';
import { VehicleMgtTestData } from './export-vehicle-mgt-ita-data';

describe('export-vehicle-mgt', () => {
  let page: VehicleMgt;
  let modal: VehicleMgtDetail;
  browser.driver.manage().window().maximize();

  beforeAll(() => {
    page = new VehicleMgt('export-vehicle-mgt');
    modal = new VehicleMgtDetail($('#exportTabVehicleMgt'));
    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  it('APIレスポンスをITA用のデータに変更\n', () => {

    CommonUtils.sendXhr('/license/api/v1/serviceavailabilityinfo/change/mock', {
      resultList: VehicleMgtTestData.SERVICE_AVAILABILITY_INFO_PARTSMAN,
      status: 200
    });

    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  describe('【UT】画面項目ケース', () => {
    beforeAll(() => {
      page.clickOpenMenu(6);
      modal.clickButton(0);
      expect(modal.clickBtn('bl-select', 'outputVehicleMgt', 1));
      modal.clickButton(12);
    });

    describe('イベントID：EL2-1', () => {
      it('EV2-1-1-1 \n' +
         '「出力内容」であること \n', () => {
         expect(modal.getLabelValue(0)).toEqual('出力内容');
        });
    });

    describe('イベントID：EL2-2', () => {
      it('EV2-2-1-1~EV2-2-1-3 \n' +
         '「対象期間」であること \n' +
         '「＜１ヶ月前」であること \n' +
         '「１ヶ月先＞」であること \n', () => {
         expect(modal.getLabelValue(1)).toEqual('対象期間');
         expect(modal.getButtonValue(4)).toEqual('＜１ヶ月前');
         expect(modal.getButtonValue(9)).toEqual('１ヶ月先＞');
        });
    });

    describe('イベントID：EL2-3', () => {
      it('EV2-3-1-1 \n' +
         '「出力タイプ」であること \n', () => {
          expect(modal.getLabelValue(2)).toEqual('出力タイプ');
        });
    });

    describe('イベントID：EL2-4', () => {
      it('EV2-4-1-1 \n' +
         '「組織」であること \n', () => {
          expect(modal.getLabelValue(3)).toEqual('組織');
        });
    });

    describe('イベントID：EL2-5', () => {
      it('EV2-5-1-1 \n' +
         '「詳細条件」であること \n', () => {
          expect(modal.getButtonValue(12)).toEqual('詳細条件');
        });
    });

    describe('イベントID：EL2-5-1-1', () => {
      it('EL2-5-1-1 \n' +
         '「得意先コード」であること \n', () => {
          expect(modal.getLabelValue(4)).toEqual('得意先コード');
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
        '前提条件：12345678 \n' +
        '「12345678」が入力されること \n', () => {
          modal.inputText(7, '12345678');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('12345678');
        });

        it('EL2-5-1-1-2-5 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(7, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('123456789');
        });

        it('EL2-5-1-1-2-6 \n' +
        '前提条件：1234567890 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(7, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(7)).toEqual('123456789');
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
         '「得意先コード」であること \n', () => {
          expect(modal.getLabelValue(4)).toEqual('得意先コード');
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
        '前提条件：12345678 \n' +
        '「12345678」が入力されること \n', () => {
          modal.inputText(8, '12345678');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('12345678');
        });

        it('EL2-5-1-2-2-5 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(8, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('123456789');
        });

        it('EL2-5-1-2-2-6 \n' +
        '前提条件：1234567890 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(8, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(8)).toEqual('123456789');
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

    describe('イベントID：EL2-5-2', () => {
      it('EL2-5-2 \n' +
         '「管理番号」であること \n', () => {
          expect(modal.getLabelValue(7)).toEqual('管理番号');
        });

        it('EL2-5-2-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(9, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('');
        });

        it('EL2-5-2-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(9, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('1');
        });

        it('EL2-5-2-2-4 \n' +
        '前提条件：12345678 \n' +
        '「12345678」が入力されること \n', () => {
          modal.inputText(9, '12345678');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('12345678');
        });

        it('EL2-5-2-2-5 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(9, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('123456789');
        });

        it('EL2-5-2-2-6 \n' +
        '前提条件：1234567890 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(9, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('123456789');
        });

        it('EL2-5-2-4-1 \n' +
        '前提条件：12-Azaz \n' +
        '入力できること \n', () => {
          modal.inputText(9, '12-Azaz');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('12-Azaz');
        });

        it('EL2-5-2-4-2 \n' +
        '前提条件：Ａあア参 \n' +
        '入力できること \n', () => {
          modal.inputText(9, 'Ａあア参');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('Ａあア参');
        });

        it('EL2-5-2-4-3 \n' +
        '前提条件：１２３４５６ \n' +
        '入力できること \n', () => {
          modal.inputText(9, '１２３４５６');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(9)).toEqual('１２３４５６');
        });
    });

    describe('イベントID：EL2-5-3', () => {
      it('EL2-5-3 \n' +
         '「型式」であること \n', () => {
          expect(modal.getLabelValue(9)).toEqual('型式');
        });

        it('EL2-5-3-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(10, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('');
        });

        it('EL2-5-3-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(10, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('1');
        });

        it('EL2-5-3-2-4 \n' +
        '前提条件：12345678 \n' +
        '「12345678」が入力されること \n', () => {
          modal.inputText(10, '12345678');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('12345678');
        });

        it('EL2-5-3-2-5 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(10, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('123456789');
        });

        it('EL2-5-3-2-6 \n' +
        '前提条件：1234567890 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(10, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('123456789');
        });

        it('EL2-5-3-4-1 \n' +
        '前提条件：12-Azaz \n' +
        '入力できること \n', () => {
          modal.inputText(10, '12-Azaz');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('12-Azaz');
        });

        it('EL2-5-3-4-2 \n' +
        '前提条件：Ａあア参 \n' +
        '入力できること \n', () => {
          modal.inputText(10, 'Ａあア参');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('Ａあア参');
        });

        it('EL2-5-3-4-3 \n' +
        '前提条件：１２３４５６ \n' +
        '入力できること \n', () => {
          modal.inputText(10, '１２３４５６');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(10)).toEqual('１２３４５６');
        });
      });

    describe('イベントID：EL2-5-4', () => {
      it('EL2-5-4 \n' +
         '「車両備考」であること \n', () => {
          expect(modal.getLabelValue(10)).toEqual('車両備考');
        });

        it('EL2-5-4-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(11, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('');
        });

        it('EL2-5-4-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(11, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('1');
        });

        it('EL2-5-4-2-4 \n' +
        '前提条件：12345678 \n' +
        '「12」が入力されること \n', () => {
          modal.inputText(11, '12');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('12');
        });

        it('EL2-5-4-2-5 \n' +
        '前提条件：123 \n' +
        '「123」が入力されること \n', () => {
          modal.inputText(11, '123');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('123');
        });

        it('EL2-5-4-2-6 \n' +
        '前提条件：1234 \n' +
        '「123」が入力されること \n', () => {
          modal.inputText(11, '1234');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('123');
        });

        it('EL2-5-4-4-1 \n' +
        '前提条件：1-A \n' +
        '入力できること \n', () => {
          modal.inputText(11, '1-A');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('1-A');
        });

        it('EL2-5-4-4-2 \n' +
        '前提条件：Ａあア \n' +
        '入力できること \n', () => {
          modal.inputText(11, 'Ａあア');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('Ａあア');
        });

        it('EL2-5-4-4-3 \n' +
        '前提条件：１２３ \n' +
        '入力できること \n', () => {
          modal.inputText(11, '１２３');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(11)).toEqual('１２３');
        });
    });

    describe('イベントID：EL2-5-5-1', () => {
      it('EL2-5-5-1 \n' +
         '「グループコード」であること \n', () => {
          expect(modal.getLabelValue(13)).toEqual('グループコード');
        });

        it('EL2-5-5-1-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(12, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('');
        });

        it('EL2-5-5-1-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(12, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('1');
        });

        it('EL2-5-5-1-2-4 \n' +
        '前提条件：12345678 \n' +
        '「12345678」が入力されること \n', () => {
          modal.inputText(12, '12345678');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('12345678');
        });

        it('EL2-5-5-1-2-5 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(12, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('123456789');
        });

        it('EL2-5-5-1-2-6 \n' +
        '前提条件：1234567890 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(12, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('123456789');
        });

        it('EL2-5-5-1-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(12, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('');
        });

        it('EL2-5-5-1-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(12, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(12)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-5-2', () => {
      it('EL2-5-5-2 \n' +
         '「グループコード」であること \n', () => {
          expect(modal.getLabelValue(13)).toEqual('グループコード');
        });

        it('EL2-5-5-2-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(13, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('');
        });

        it('EL2-5-5-2-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(13, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('1');
        });

        it('EL2-5-5-2-2-4 \n' +
        '前提条件：12345678 \n' +
        '「12345678」が入力されること \n', () => {
          modal.inputText(13, '12345678');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('12345678');
        });

        it('EL2-5-5-2-2-5 \n' +
        '前提条件：123456789 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(13, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('123456789');
        });

        it('EL2-5-5-2-2-6 \n' +
        '前提条件：1234567890 \n' +
        '「123456789」が入力されること \n', () => {
          modal.inputText(13, '1234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('123456789');
        });

        it('EL2-5-5-2-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(13, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('');
        });

        it('EL2-5-5-2-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(13, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(13)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-6-1', () => {
      it('EL2-5-6-1 \n' +
         '「BLコード」であること \n', () => {
          expect(modal.getLabelValue(16)).toEqual('BLコード');
        });

        it('EL2-5-6-1-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(14, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('');
        });

        it('EL2-5-6-1-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(14, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('1');
        });

        it('EL2-5-6-1-2-4 \n' +
        '前提条件：1234567 \n' +
        '「1234567」が入力されること \n', () => {
          modal.inputText(14, '1234567');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('1234567');
        });

        it('EL2-5-6-1-2-5 \n' +
        '前提条件：12345678 \n' +
        '「12345678」が入力されること \n', () => {
          modal.inputText(14, '12345678');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('12345678');
        });

        it('EL2-5-6-1-2-6 \n' +
        '前提条件：123456789 \n' +
        '「12345678」が入力されること \n', () => {
          modal.inputText(14, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('12345678');
        });

        it('EL2-5-6-1-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(14, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('');
        });

        it('EL2-5-6-1-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(14, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(14)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-6-2', () => {
      it('EL2-5-6-2 \n' +
         '「BLコード」であること \n', () => {
          expect(modal.getLabelValue(16)).toEqual('BLコード');
        });

        it('EL2-5-6-2-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(15, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('');
        });

        it('EL2-5-6-2-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(15, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('1');
        });

        it('EL2-5-6-2-2-4 \n' +
        '前提条件：12345678 \n' +
        '「1234567」が入力されること \n', () => {
          modal.inputText(15, '1234567');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('1234567');
        });

        it('EL2-5-6-2-2-5 \n' +
        '前提条件：12345678 \n' +
        '「12345678」が入力されること \n', () => {
          modal.inputText(15, '12345678');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('12345678');
        });

        it('EL2-5-6-2-2-6 \n' +
        '前提条件：123456789 \n' +
        '「12345678」が入力されること \n', () => {
          modal.inputText(15, '123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('12345678');
        });

        it('EL2-5-6-2-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(15, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('');
        });

        it('EL2-5-6-2-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(15, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(15)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-7', () => {
      it('EL2-5-7 \n' +
         '「品番」であること \n', () => {
          expect(modal.getLabelValue(19)).toEqual('品番');
        });

        it('EL2-5-7-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(16, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('');
        });

        it('EL2-5-7-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(16, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('1');
        });

        it('EL2-5-7-2-4 \n' +
        '前提条件：12345678901234567890123 \n' +
        '「12345678901234567890123」が入力されること \n', () => {
          modal.inputText(16, '12345678901234567890123');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('12345678901234567890123');
        });

        it('EL2-5-7-2-5 \n' +
        '前提条件：123456789012345678901234 \n' +
        '「123456789012345678901234」が入力されること \n', () => {
          modal.inputText(16, '123456789012345678901234');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('123456789012345678901234');
        });

        it('EL2-5-7-2-6 \n' +
        '前提条件：1234567890123456789012345 \n' +
        '「123456789012345678901234」が入力されること \n', () => {
          modal.inputText(16, '1234567890123456789012345');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('123456789012345678901234');
        });

        it('EL2-5-7-4-1 \n' +
        '12-Azaz \n' +
        '「12-AZaz」が入力されること \n', () => {
          modal.inputText(16, '12-Azaz');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('12-Azaz');
        });

        it('EL2-5-7-4-2 \n' +
        '前提条件：Ａあア参 \n' +
        '「Ａあア参」が入力されること \n', () => {
          modal.inputText(16, 'Ａあア参');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('Ａあア参');
        });

        it('EL2-5-7-4-3 \n' +
        '前提条件：１２３４５６ \n' +
        '「１２３４５６」が入力されること \n', () => {
          modal.inputText(16, '１２３４５６');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(16)).toEqual('１２３４５６');
        });
    });

    describe('イベントID：EL2-5-8', () => {
      it('EL2-5-8 \n' +
         '「品名」であること \n', () => {
          expect(modal.getLabelValue(21)).toEqual('品名');
        });

        it('EL2-5-8-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(17, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('');
        });

        it('EL2-5-8-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(17, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('1');
        });

        it('EL2-5-8-2-4 \n' +
        '前提条件：123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789 \n' +
        '「123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789」が入力されること \n', () => {
          modal.inputText(17, '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('12345678901234567890123456789012345678901234567890123456789'
          + '0123456789012345678901234567890123456789');
        });

        it('EL2-5-8-2-5 \n' +
        '前提条件：1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890 \n' +
        '「1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890」が入力されること \n', () => {
          modal.inputText(17, '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('12345678901234567890123456789012345678901234567890123456'
          + '78901234567890123456789012345678901234567890');
        });

        it('EL2-5-8-2-6 \n' +
        '前提条件：12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901 \n' +
        '「1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890」が入力されること \n', () => {
          modal.inputText(17, '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('1234567890123456789012345678901234567890123456789012'
          + '345678901234567890123456789012345678901234567890');
        });

        it('EL2-5-8-4-1 \n' +
        '12-Azaz \n' +
        '「12-AZaz」が入力されること \n', () => {
          modal.inputText(17, '12-Azaz');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('12-Azaz');
        });

        it('EL2-5-8-4-2 \n' +
        '前提条件：Ａあア参 \n' +
        '「Ａあア参」が入力されること \n', () => {
          modal.inputText(17, 'Ａあア参');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('Ａあア参');
        });

        it('EL2-5-8-4-3 \n' +
        '前提条件：１２３４５６ \n' +
        '「１２３４５６」が入力されること \n', () => {
          modal.inputText(17, '１２３４５６');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(17)).toEqual('１２３４５６');
        });
    });

    describe('イベントID：EL2-5-10-1', () => {
      it('EL2-5-10-1 \n' +
         '「倉庫コード」であること \n', () => {
          expect(modal.getLabelValue(25)).toEqual('倉庫コード');
        });

        it('EL2-5-10-1-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(18, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(18)).toEqual('');
        });

        it('EL2-5-10-1-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(18, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(18)).toEqual('1');
        });

        it('EL2-5-10-1-2-4 \n' +
        '前提条件：12345 \n' +
        '「12345」が入力されること \n', () => {
          modal.inputText(18, '12345');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(18)).toEqual('12345');
        });

        it('EL2-5-10-1-2-5 \n' +
        '前提条件：123456 \n' +
        '「123456」が入力されること \n', () => {
          modal.inputText(18, '123456');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(18)).toEqual('123456');
        });

        it('EL2-5-10-1-2-6 \n' +
        '前提条件：1234567 \n' +
        '「123456」が入力されること \n', () => {
          modal.inputText(18, '1234567');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(18)).toEqual('123456');
        });

        it('EL2-5-10-1-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(18, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(18)).toEqual('');
        });

        it('EL2-5-10-1-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(18, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(18)).toEqual('');
        });
    });

    describe('イベントID：EL2-5-10-2', () => {
      it('EL2-5-10-2 \n' +
         '「倉庫コード」であること \n', () => {
          expect(modal.getLabelValue(25)).toEqual('倉庫コード');
        });

        it('EL2-5-10-2-2-2 \n' +
        '前提条件：入力値が空白の場合 \n' +
        '「」が入力されること \n', () => {
          modal.inputText(19, '');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(19)).toEqual('');
        });

        it('EL2-5-10-2-2-3 \n' +
        '前提条件：1 \n' +
        '「1」が入力されること \n', () => {
          modal.inputText(19, '1');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(19)).toEqual('1');
        });

        it('EL2-5-10-2-2-4 \n' +
        '前提条件：12345 \n' +
        '「12345」が入力されること \n', () => {
          modal.inputText(19, '12345');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(19)).toEqual('12345');
        });

        it('EL2-5-10-2-2-5 \n' +
        '前提条件：123456 \n' +
        '「123456」が入力されること \n', () => {
          modal.inputText(19, '123456');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(19)).toEqual('123456');
        });

        it('EL2-5-10-2-2-6 \n' +
        '前提条件：1234567 \n' +
        '「123456」が入力されること \n', () => {
          modal.inputText(19, '1234567');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(19)).toEqual('123456');
        });

        it('EL2-5-10-2-4-1 \n' +
        '前提条件：aBzZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(19, 'aBzZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(19)).toEqual('');
        });

        it('EL2-5-10-2-4-2 \n' +
        '前提条件：_あZ \n' +
        '入力できないこと \n', () => {
          modal.inputText(19, '_あZ');
          browser.wait(page.loadingFinished());
          expect(modal.getInputValueById(19)).toEqual('');
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
