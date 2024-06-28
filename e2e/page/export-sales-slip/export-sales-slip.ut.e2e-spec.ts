import { browser, $ } from 'protractor';
import { CommonUtils } from '../common-utils';
import { ExportSalesSlip } from './export-sales-slip.po';
import { ShareFooter } from '../../page_object/ng-share-module/share-footer.po';
import { ExportSalesSlipTestData } from './export-sales-slip.ut.test-data';

describe('export-sales-slip', () => {
  let page: ExportSalesSlip;
  let footer: ShareFooter;

  browser.driver.manage().window().maximize();

  beforeAll(() => {
    page = new ExportSalesSlip('output');
    footer = new ShareFooter($('share-footer'));
    page.navigateTo();
    browser.wait(page.loadingFinished());
    browser.wait(page.gridLoadingFinished());
  });

  it('モックの返却値をテストデータに変更', () => {
    CommonUtils.sendXhr('/cmnservice/api/v1/loginuseremployeebindmodel/change/mock', {
      resultList: ExportSalesSlipTestData.LOGIN_USER_INFO,
      status: 200
    });
    CommonUtils.sendXhr('/company/api/v1/organizationinformation/change/mock', {
      resultList: ExportSalesSlipTestData.ORGANIZATION_INFORMATION,
      status: 200
    });
    CommonUtils.sendXhr('/license/api/v1/serviceavailabilityinfo/change/mock', {
      resultList: ExportSalesSlipTestData.SERVICE_AVAILABILITY_INFO_PARTSMAN,
      status: 200
    });
    CommonUtils.sendXhr('/output/api/v1/exportpatterninfo/change/mock', {
      resultList: ExportSalesSlipTestData.EXPORT_PATTERN_INFO,
      status: 200
    });
    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  describe('画面項目ケース', () => {

    describe('EL1', () => {
      it('画面項目EL1_1-1 「テキストデータ出力」であること', () => {
        expect(page.getTitle()).toEqual('テキストデータ出力');
      });
    });

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

    describe('EL2', () => {
      it('画面項目EL2_1-1 「出力条件を指定して　出力開始　ボタンをクリックしてください。」であること', () => {
        expect(page.getLabelTitleText()).toEqual('出力条件を指定して　出力開始　ボタンをクリックしてください。');
      });
    });

    describe('EL2-1', () => {
      it('画面項目EL2-1_1-1 「売上」であること', () => {
        expect(page.getLabelCheckBoxText(0)).toEqual('売上');
      });
    });

    describe('EL2-1', () => {
      it('画面項目EL2-1_1-2 「見積」であること', () => {
        expect(page.getLabelCheckBoxText(1)).toEqual('見積');
      });
    });

    describe('EL2-1', () => {
      it('画面項目EL2-1_1-3 「受注」であること', () => {
        expect(page.getLabelCheckBoxText(2)).toEqual('受注');
      });
    });

    describe('EL2-1', () => {
      it('画面項目EL2-1_1-4 「貸出」であること', () => {
        expect(page.getLabelCheckBoxText(3)).toEqual('貸出');
      });
    });

    describe('EL2-1', () => {
      it('画面項目EL2-1_1-5 「入金」であること', () => {
        expect(page.getLabelCheckBoxText(4)).toEqual('入金');
      });
    });

    describe('EL2-2-1', () => {
      it('画面項目EL2-2-1_1-1 「伝票日付」であること', () => {
        expect(page.getLabelSelectText(0)).toEqual('伝票日付');
      });
    });

    describe('EL2-2-1', () => {
      it('画面項目EL2-2-1_1-2 「更新日付」であること', () => {
        page.openSelect(0);
        expect(page.getChoice(1)).toEqual('更新日付');
      });
    });

    describe('EL2-2-1', () => {
      it('画面項目EL2-2-1_1-3 「請求締日」であること', () => {
        expect(page.getChoice(2)).toEqual('請求締日');
      });
    });

    describe('EL2-2-2', () => {
      it('画面項目EL2-2-2_1-1 「＜１ヶ月前」であること', () => {
        expect(page.getLabelButtonText(0)).toEqual('＜１ヶ月前');
      });
    });

    describe('EL2-2-5', () => {
      it('画面項目EL2-2-5_1-1 「１ヶ月先＞」であること', () => {
        expect(page.getLabelButtonText(1)).toEqual('１ヶ月先＞');
      });
    });

    describe('EL2-3', () => {
      it('画面項目EL2-3_1-1 「伝票タイプ」であること', () => {
        page.navigateTo();
        browser.wait(page.loadingFinished());
        browser.wait(page.gridLoadingFinished());
        expect(page.getLabelSelectText(1)).toEqual('伝票タイプ');
      });
    });

    describe('EL2-3', () => {
      it('画面項目EL2-3_1-2 「伝票明細タイプ」であること', () => {
        page.openSelect(1);
        expect(page.getChoice(1)).toEqual('伝票明細タイプ');
      });
    });

    describe('EL2-4', () => {
      it('画面項目EL2-4_1-1 「組織」であること', () => {
        expect(page.getLabelText(2)).toEqual('組織');
      });
    });

    describe('EL2-5', () => {
      it('画面項目EL2-5_1-1 「詳細条件」であること', () => {
        expect(page.getLabelButtonDetailText(0, 0)).toEqual('詳細条件');
      });
    });

    describe('EL3', () => {
      it('画面項目EL3_1-1 「出力する項目を変更したい場合は、下記出力パターンを切り替えてください。」であること', () => {
        expect(page.getLabelConditionTableTitleText(0)).toEqual('出力する項目を変更したい場合は、下記出力パターンを切り替えてください。');
      });
    });

    describe('EL3-1-1', () => {
      it('画面項目EL3-1-1_1-1 「テキスト出力情報」であること', () => {
        expect(page.getLabelConditionTableBodyThText(0, 0)).toEqual('テキスト出力情報');
      });
    });

    describe('EL3-1-1', () => {
      it('画面項目EL3-1-1_2-1 「売上伝票情報」であること', () => {
        expect(page.getLabelConditionTableBodyTdText(0, 0)).toEqual('売上伝票情報');
      });
    });

    describe('EL3-1-2', () => {
      it('画面項目EL3-1-2_1-1 「出力パターン」であること', () => {
        expect(page.getLabelConditionTableBodyThText(0, 1)).toEqual('出力パターン');
      });
    });

    describe('EL3-1-3', () => {
      it('画面項目EL3-1-3_1-1 「編集」であること', () => {
        expect(page.getLabelEditButtonText(0)).toEqual('編集');
      });
    });

    describe('EL3-2-1', () => {
      it('画面項目EL3-2-1_1-1 「売上伝票詳細情報」であること', () => {
        page.navigateTo();
        browser.wait(page.loadingFinished());
        browser.wait(page.gridLoadingFinished());
        page.openSelect(1);
        page.clickSelectButton(1);
        expect(page.getLabelConditionTableBodyTdText(0, 0)).toEqual('売上伝票詳細情報');
      });
    });

    describe('EL3-2-3', () => {
      it('画面項目EL3-2-3_1-1 「編集」であること', () => {
        expect(page.getLabelEditButtonText(0)).toEqual('編集');
      });
    });

    describe('EL2-5-1-1', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「担当者コード」であること\n', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          browser.wait(page.gridLoadingFinished());
          page.openSelect(1);
          page.clickSelectButton(1);
          page.clickCondictionDetailButton();
          expect(page.getLabelText(3)).toEqual('担当者コード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「123456789」が入力されること \n' +
        '  2-5 「1234567890」が入力されること \n' +
        '  2-6 「1234567890」が入力されること ', () => {

          page.clearInputValue(7);
          page.inputValue(7, '');
          expect(page.getInputValue(7)).toBe('');

          page.clearInputValue(7);
          page.inputValue(7, '1');
          expect(page.getInputValue(7)).toBe('1');

          page.clearInputValue(7);
          page.inputValue(7, '123456789');
          expect(page.getInputValue(7)).toBe('123456789');

          page.clearInputValue(7);
          page.inputValue(7, '1234567890');
          expect(page.getInputValue(7)).toBe('1234567890');

          page.clearInputValue(7);
          page.inputValue(7, '12345678901');
          expect(page.getInputValue(7)).toBe('1234567890');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「aBzZ」入力できないこと \n' +
        '  4-2 「_あZ」入力できないこと ', () => {

          page.clearInputValue(7);
          page.inputValue(7, 'aBzZ');
          expect(page.getInputValue(7)).toBe('');

          page.clearInputValue(7);
          page.inputValue(7, '_あZ');
          expect(page.getInputValue(7)).toBe('');
      });
    });

    describe('EL2-5-1-2', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「担当者コード」であること\n', () => {
          expect(page.getLabelText(3)).toEqual('担当者コード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「123456789」が入力されること \n' +
        '  2-5 「1234567890」が入力されること \n' +
        '  2-6 「1234567890」が入力されること ', () => {

          page.clearInputValue(8);
          page.inputValue(8, '');
          expect(page.getInputValue(8)).toBe('');

          page.clearInputValue(8);
          page.inputValue(8, '1');
          expect(page.getInputValue(8)).toBe('1');

          page.clearInputValue(8);
          page.inputValue(8, '123456789');
          expect(page.getInputValue(8)).toBe('123456789');

          page.clearInputValue(8);
          page.inputValue(8, '1234567890');
          expect(page.getInputValue(8)).toBe('1234567890');

          page.clearInputValue(8);
          page.inputValue(8, '12345678901');
          expect(page.getInputValue(8)).toBe('1234567890');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「aBzZ」入力できないこと \n' +
        '  4-2 「_あZ」入力できないこと ', () => {

          page.clearInputValue(8);
          page.inputValue(8, 'aBzZ');
          expect(page.getInputValue(8)).toBe('');

          page.clearInputValue(8);
          page.inputValue(8, '_あZ');
          expect(page.getInputValue(8)).toBe('');
      });
    });

    describe('EL2-5-2', () => {
      it('画面項目EL2-5-2_1-1 「売上組織」であること」であること', () => {

        page.navigateTo();
        browser.wait(page.loadingFinished());
        browser.wait(page.gridLoadingFinished());
        page.openSelect(1);
        page.clickSelectButton(1);
        page.clickCondictionDetailButton();

        page.openSelect(2);
        expect(page.getLabelSelectOrgText(1, 0)).toEqual('売上組織');

      });
      it('画面項目EL2-5-2_1-2 「請求組織」であること」であること', () => {
        expect(page.getLabelSelectOrgText(1, 1)).toEqual('請求組織');
      });
    });

    describe('EL2-5-3', () => {
      it('画面項目EL2-5-3_1-1 「得意先」であること」であること', () => {

        page.navigateTo();
        browser.wait(page.loadingFinished());
        browser.wait(page.gridLoadingFinished());
        page.openSelect(1);
        page.clickSelectButton(1);
        page.clickCondictionDetailButton();

        page.openSelect(3);
        expect(page.getLabelSelectOrgText(1, 0)).toEqual('得意先');

      });
      it('画面項目EL2-5-3_1-2 「請求先」であること」であること', () => {
        expect(page.getLabelSelectOrgText(1, 1)).toEqual('請求先');
      });
    });

    describe('EL2-5-4-1', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「得意先コード」であること\n', () => {
          expect(page.getLabelText(7)).toEqual('得意先コード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「12345678」が入力されること \n' +
        '  2-5 「123456789」が入力されること \n' +
        '  2-6 「123456789」が入力されること ', () => {

          page.clearInputValue(9);
          page.inputValue(9, '');
          expect(page.getInputValue(9)).toBe('');

          page.clearInputValue(9);
          page.inputValue(9, '1');
          expect(page.getInputValue(9)).toBe('1');

          page.clearInputValue(9);
          page.inputValue(9, '12345678');
          expect(page.getInputValue(9)).toBe('12345678');

          page.clearInputValue(9);
          page.inputValue(9, '123456789');
          expect(page.getInputValue(9)).toBe('123456789');

          page.clearInputValue(9);
          page.inputValue(9, '1234567890');
          expect(page.getInputValue(9)).toBe('123456789');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「aBzZ」入力できないこと \n' +
        '  4-2 「_あZ」入力できないこと ', () => {

          page.clearInputValue(9);
          page.inputValue(9, 'aBzZ');
          expect(page.getInputValue(9)).toBe('');

          page.clearInputValue(9);
          page.inputValue(9, '_あZ');
          expect(page.getInputValue(9)).toBe('');
      });
    });

    describe('EL2-5-4-2', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「得意先コード」であること\n', () => {
          expect(page.getLabelText(7)).toEqual('得意先コード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「12345678」が入力されること \n' +
        '  2-5 「123456789」が入力されること \n' +
        '  2-6 「123456789」が入力されること ', () => {

          page.clearInputValue(10);
          page.inputValue(10, '');
          expect(page.getInputValue(10)).toBe('');

          page.clearInputValue(10);
          page.inputValue(10, '1');
          expect(page.getInputValue(10)).toBe('1');

          page.clearInputValue(10);
          page.inputValue(10, '12345678');
          expect(page.getInputValue(10)).toBe('12345678');

          page.clearInputValue(10);
          page.inputValue(10, '123456789');
          expect(page.getInputValue(10)).toBe('123456789');

          page.clearInputValue(10);
          page.inputValue(10, '1234567890');
          expect(page.getInputValue(10)).toBe('123456789');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「aBzZ」入力できないこと \n' +
        '  4-2 「_あZ」入力できないこと ', () => {

          page.clearInputValue(10);
          page.inputValue(10, 'aBzZ');
          expect(page.getInputValue(10)).toBe('');

          page.clearInputValue(10);
          page.inputValue(10, '_あZ');
          expect(page.getInputValue(10)).toBe('');
      });
    });

    describe('EL2-5-5', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「締日」であること\n', () => {
          expect(page.getLabelText(9)).toEqual('締日');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「1」が入力されること \n' +
        '  2-5 「12」が入力されること \n' +
        '  2-6 「123」が入力されること ', () => {

          page.clearInputValue(11);
          page.inputValue(11, '');
          expect(page.getInputValue(11)).toBe('');

          page.clearInputValue(11);
          page.inputValue(11, '1');
          expect(page.getInputValue(11)).toBe('1');

          page.clearInputValue(11);
          page.inputValue(11, '1');
          expect(page.getInputValue(11)).toBe('1');

          page.clearInputValue(11);
          page.inputValue(11, '12');
          expect(page.getInputValue(11)).toBe('12');

          page.clearInputValue(11);
          page.inputValue(11, '123');
          expect(page.getInputValue(11)).toBe('12');
      });

      it('No3 範囲チェック\n' +
        '  3-2 「1」が入力されること \n' +
        '  3-3 「2」が入力されること \n' +
        '  3-4 「30」が入力されること \n' +
        '  3-5 「31」が入力されること \n' +
        '  3-6 入力できないこと(「3」が入力されること) ', () => {

          page.clearInputValue(11);
          page.inputValue(11, '1');
          expect(page.getInputValue(11)).toBe('1');

          page.clearInputValue(11);
          page.inputValue(11, '2');
          expect(page.getInputValue(11)).toBe('2');

          page.clearInputValue(11);
          page.inputValue(11, '30');
          expect(page.getInputValue(11)).toBe('30');

          page.clearInputValue(11);
          page.inputValue(11, '31');
          expect(page.getInputValue(11)).toBe('31');

          page.clearInputValue(11);
          page.inputValue(11, '32');
          expect(page.getInputValue(11)).toBe('3');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「aBzZ」入力できないこと \n' +
        '  4-2 「_あZ」入力できないこと ', () => {

          page.clearInputValue(11);
          page.inputValue(11, 'aBzZ');
          expect(page.getInputValue(11)).toBe('');

          page.clearInputValue(11);
          page.inputValue(11, '_あZ');
          expect(page.getInputValue(11)).toBe('');
      });
    });

    describe('EL2-5-6-1', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「倉庫コード」であること\n', () => {
          expect(page.getLabelText(10)).toEqual('倉庫コード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「12345」が入力されること \n' +
        '  2-5 「123456」が入力されること \n' +
        '  2-6 「123456」が入力されること ', () => {

          page.clearInputValue(12);
          page.inputValue(12, '');
          expect(page.getInputValue(12)).toBe('');

          page.clearInputValue(12);
          page.inputValue(12, '1');
          expect(page.getInputValue(12)).toBe('1');

          page.clearInputValue(12);
          page.inputValue(12, '12345');
          expect(page.getInputValue(12)).toBe('12345');

          page.clearInputValue(12);
          page.inputValue(12, '123456');
          expect(page.getInputValue(12)).toBe('123456');

          page.clearInputValue(12);
          page.inputValue(12, '1234567');
          expect(page.getInputValue(12)).toBe('123456');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「aBzZ」入力できないこと \n' +
        '  4-2 「_あZ」入力できないこと ', () => {

          page.clearInputValue(12);
          page.inputValue(12, 'aBzZ');
          expect(page.getInputValue(12)).toBe('');

          page.clearInputValue(12);
          page.inputValue(12, '_あZ');
          expect(page.getInputValue(12)).toBe('');
      });
    });

    describe('EL2-5-6-2', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「倉庫コード」であること\n', () => {
          expect(page.getLabelText(10)).toEqual('倉庫コード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「12345」が入力されること \n' +
        '  2-5 「123456」が入力されること \n' +
        '  2-6 「123456」が入力されること ', () => {

          page.clearInputValue(13);
          page.inputValue(13, '');
          expect(page.getInputValue(13)).toBe('');

          page.clearInputValue(13);
          page.inputValue(13, '1');
          expect(page.getInputValue(13)).toBe('1');

          page.clearInputValue(13);
          page.inputValue(13, '12345');
          expect(page.getInputValue(13)).toBe('12345');

          page.clearInputValue(13);
          page.inputValue(13, '123456789');
          expect(page.getInputValue(13)).toBe('123456');

          page.clearInputValue(13);
          page.inputValue(13, '1234567');
          expect(page.getInputValue(13)).toBe('123456');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「aBzZ」入力できないこと \n' +
        '  4-2 「_あZ」入力できないこと ', () => {

          page.clearInputValue(13);
          page.inputValue(13, 'aBzZ');
          expect(page.getInputValue(13)).toBe('');

          page.clearInputValue(13);
          page.inputValue(13, '_あZ');
          expect(page.getInputValue(13)).toBe('');
      });
    });

    describe('EL2-5-7-1', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「メーカーコード」であること\n', () => {
          expect(page.getLabelText(12)).toEqual('メーカーコード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「12345678」が入力されること \n' +
        '  2-5 「123456789」が入力されること \n' +
        '  2-6 「123456789」が入力されること ', () => {

          page.clearInputValue(14);
          page.inputValue(14, '');
          expect(page.getInputValue(14)).toBe('');

          page.clearInputValue(14);
          page.inputValue(14, '1');
          expect(page.getInputValue(14)).toBe('1');

          page.clearInputValue(14);
          page.inputValue(14, '12345678');
          expect(page.getInputValue(14)).toBe('12345678');

          page.clearInputValue(14);
          page.inputValue(14, '123456789');
          expect(page.getInputValue(14)).toBe('123456789');

          page.clearInputValue(14);
          page.inputValue(14, '1234567890');
          expect(page.getInputValue(14)).toBe('123456789');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「aBzZ」入力できないこと \n' +
        '  4-2 「_あZ」入力できないこと ', () => {

          page.clearInputValue(14);
          page.inputValue(14, 'aBzZ');
          expect(page.getInputValue(14)).toBe('');

          page.clearInputValue(14);
          page.inputValue(14, '_あZ');
          expect(page.getInputValue(14)).toBe('');
      });
    });

    describe('EL2-5-7-2', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「メーカーコード」であること\n', () => {
          expect(page.getLabelText(12)).toEqual('メーカーコード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「12345678」が入力されること \n' +
        '  2-5 「123456789」が入力されること \n' +
        '  2-6 「123456789」が入力されること ', () => {

          page.clearInputValue(15);
          page.inputValue(15, '');
          expect(page.getInputValue(15)).toBe('');

          page.clearInputValue(15);
          page.inputValue(15, '1');
          expect(page.getInputValue(15)).toBe('1');

          page.clearInputValue(15);
          page.inputValue(15, '12345678');
          expect(page.getInputValue(15)).toBe('12345678');

          page.clearInputValue(15);
          page.inputValue(15, '123456789');
          expect(page.getInputValue(15)).toBe('123456789');

          page.clearInputValue(15);
          page.inputValue(15, '1234567890');
          expect(page.getInputValue(15)).toBe('123456789');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「aBzZ」入力できないこと \n' +
        '  4-2 「_あZ」入力できないこと ', () => {

          page.clearInputValue(15);
          page.inputValue(15, 'aBzZ');
          expect(page.getInputValue(15)).toBe('');

          page.clearInputValue(15);
          page.inputValue(15, '_あZ');
          expect(page.getInputValue(15)).toBe('');
      });
    });

    describe('EL2-5-8', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「品番」であること\n', () => {
          expect(page.getLabelText(14)).toEqual('品番');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「12345678901234567890123」が入力されること \n' +
        '  2-5 「123456789012345678901234」が入力されること \n' +
        '  2-6 「123456789012345678901234」が入力されること ', () => {

          page.clearInputValue(16);
          page.inputValue(16, '');
          expect(page.getInputValue(16)).toBe('');

          page.clearInputValue(16);
          page.inputValue(16, '1');
          expect(page.getInputValue(16)).toBe('1');

          page.clearInputValue(16);
          page.inputValue(16, '12345678901234567890123');
          expect(page.getInputValue(16)).toBe('12345678901234567890123');

          page.clearInputValue(16);
          page.inputValue(16, '123456789012345678901234');
          expect(page.getInputValue(16)).toBe('123456789012345678901234');

          page.clearInputValue(16);
          page.inputValue(16, '1234567890123456789012345');
          expect(page.getInputValue(16)).toBe('123456789012345678901234');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「12-AZaz」が入力されること \n' +
        '  4-2 「Ａあア参」が入力されること \n' +
        '  4-3 「１２３４５６」が入力されること ', () => {

          page.clearInputValue(16);
          page.inputValue(16, '12-AZaz');
          expect(page.getInputValue(16)).toBe('12-AZaz');

          page.clearInputValue(16);
          page.inputValue(16, 'Ａあア参');
          expect(page.getInputValue(16)).toBe('Ａあア参');

          page.clearInputValue(16);
          page.inputValue(16, '１２３４５６');
          expect(page.getInputValue(16)).toBe('１２３４５６');
      });
    });

    describe('EL2-5-9', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「品名」であること\n', () => {
          expect(page.getLabelText(16)).toEqual('品名');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789」が入力されること \n' +
        '  2-5 「1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890」が入力されること \n' +
        '  2-6 「1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890」が入力されること ', () => {

          page.clearInputValue(17);
          page.inputValue(17, '');
          expect(page.getInputValue(17)).toBe('');

          page.clearInputValue(17);
          page.inputValue(17, '1');
          expect(page.getInputValue(17)).toBe('1');

          page.clearInputValue(17);
          page.inputValue(17, '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789');
          expect(page.getInputValue(17)).toBe('1234567890123456789012345678901234567890123456789012345678901234567890' +
            '12345678901234567890123456789');

          page.clearInputValue(17);
          page.inputValue(17, '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890');
          expect(page.getInputValue(17)).toBe('1234567890123456789012345678901234567890123456789012345678901234567890' +
            '123456789012345678901234567890');

          page.clearInputValue(17);
          page.inputValue(17, '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901');
          expect(page.getInputValue(17)).toBe('1234567890123456789012345678901234567890123456789012345678901234567890' +
            '123456789012345678901234567890');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「12-AZaz」が入力されること \n' +
        '  4-2 「Ａあア参」が入力されること \n' +
        '  4-3 「１２３４５６」が入力されること ', () => {

          page.clearInputValue(17);
          page.inputValue(17, '12-AZaz');
          expect(page.getInputValue(17)).toBe('12-AZaz');

          page.clearInputValue(17);
          page.inputValue(17, 'Ａあア参');
          expect(page.getInputValue(17)).toBe('Ａあア参');

          page.clearInputValue(17);
          page.inputValue(17, '１２３４５６');
          expect(page.getInputValue(17)).toBe('１２３４５６');
      });
    });

    describe('EL2-6', () => {
      it('画面項目EL2-6_1-1 「条件取消」であること', () => {
        expect(page.getLabelButtonDetailCancelText(0)).toEqual('条件取消');
      });
    });

    describe('ファンクションキー：EL4-1', () => {
      it('画面項目EL4-1_1-1 「F1」であること\n' +
        '  画面項目EL4-1_2-1 「お困りですか？」であること', () => {
        page.navigateTo();
        browser.wait(page.loadingFinished());
        browser.wait(page.gridLoadingFinished());

        expect(footer.getFnText('F1').getAttribute('innerText')).toEqual('お困りですか？');
      });
    });

    describe('ファンクションキー：EL4-2', () => {
      it('画面項目EL4-2_1-1 「F6」であること\n' +
        '  画面項目EL4-2_2-1 「詳細条件」であること', () => {
          expect(footer.getFnText('F6').getAttribute('innerText')).toEqual('詳細条件');
      });
    });

    describe('ファンクションキー：EL4-3', () => {
      it('画面項目EL4-3_1-1 「F9」であること\n' +
        '  画面項目EL4-3_2-1 「F切替」であること', () => {
          expect(footer.getFnText('F9').getAttribute('innerText')).toEqual('F切替');
      });
    });
    describe('ファンクションキー：EL4-4', () => {
      it('画面項目EL4-4_1-1 「F10」であること\n' +
        '  画面項目EL4-4_2-1 「トップメニュー」であること', () => {
          expect(footer.getFnText('F10').getAttribute('innerText')).toEqual('トップメニュー');
      });
    });
    describe('ファンクションキー：EL4-5', () => {
      it('画面項目EL4-5_1-1 「F11」であること\n' +
        '  画面項目EL4-5_2-1 「戻る」であること', () => {
          expect(footer.getFnText('F11').getAttribute('innerText')).toEqual('戻る');
      });
    });
    describe('ファンクションキー：EL4-6', () => {
      it('画面項目EL4-6_1-1 「F12」であること\n' +
        '  画面項目EL4-6_2-1 「F12　出力開始」であること', () => {
          expect(footer.getFnText('F12').getAttribute('innerText')).toEqual('F12　出力開始');
      });
    });
  });
});
