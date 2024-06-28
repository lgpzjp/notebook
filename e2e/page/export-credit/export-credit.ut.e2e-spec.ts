import { browser, $ } from 'protractor';
import { CommonUtils } from '../common-utils';
import { ExportCredit } from './export-credit.po';
import { ShareFooter } from '../../page_object/ng-share-module/share-footer.po';
import { ExportCreditTestData } from './export-credit.ut.test-data';
import { DateTimeUtils } from '@blcloud/bl-common';

describe('export-credit', () => {
  let page: ExportCredit;
  let footer: ShareFooter;

  browser.driver.manage().window().maximize();

  beforeAll(() => {
    page = new ExportCredit('output');
    footer = new ShareFooter($('share-footer'));
    page.navigateTo();
    browser.wait(page.loadingFinished());
    browser.wait(page.gridLoadingFinished());
  });

  it('モックの返却値をテストデータに変更', () => {
    CommonUtils.sendXhr('/cmnservice/api/v1/loginuseremployeebindmodel/change/mock', {
      resultList: ExportCreditTestData.LOGIN_USER_INFO,
      status: 200
    });
    CommonUtils.sendXhr('/company/api/v1/organizationinformation/change/mock', {
      resultList: ExportCreditTestData.ORGANIZATION_INFORMATION,
      status: 200
    });
    CommonUtils.sendXhr('/license/api/v1/serviceavailabilityinfo/change/mock', {
      resultList: ExportCreditTestData.SERVICE_AVAILABILITY_INFO_PARTSMAN,
      status: 200
    });
    CommonUtils.sendXhr('/output/api/v1/exportpatterninfo/change/mock', {
      resultList: ExportCreditTestData.EXPORT_PATTERN_INFO,
      status: 200
    });
    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  describe('画面項目ケース', () => {

    describe('EL1', () => {
      it('画面項目EL1_1-1 \n' +
        '「テキストデータ出力」であること', () => {
          page.clickTab(1);
          expect(page.getTitle()).toEqual('テキストデータ出力');
      });
    });

    describe('EL1-1', () => {
      it('画面項目EL1-1_1-1 \n' +
        '「売上伝票情報」であること', () => {
          expect(page.getTabText(0)).toEqual('売上伝票情報');
      });
    });

    describe('EL1-2', () => {
      it('画面項目EL1-2_1-1 \n' +
        '「債権情報」であること', () => {
          expect(page.getTabText(1)).toEqual('債権情報');
      });
    });

    describe('EL1-3', () => {
      it('画面項目EL1-3_1-1 \n' +
        '「仕入伝票情報」であること', () => {
          expect(page.getTabText(2)).toEqual('仕入伝票情報');
      });
    });

    describe('EL1-4', () => {
      it('画面項目EL1-4_1-1 \n' +
        '「債務情報」であること', () => {
          expect(page.getTabText(3)).toEqual('債務情報');
      });
    });

    describe('EL1-5', () => {
      it('画面項目EL1-5_1-1 \n' +
        '「在庫移動伝票情報」であること', () => {
          expect(page.getTabText(4)).toEqual('在庫移動伝票情報');
      });
    });

    describe('EL1-6', () => {
      it('画面項目EL1-6_1-1 \n' +
        '「取引先情報」であること', () => {
          expect(page.getTabText(5)).toEqual('取引先情報');
      });
    });

    describe('EL1-7', () => {
      it('画面項目EL1-7_1-1 \n' +
        '「車両管理情報」であること', () => {
          expect(page.getTabText(6)).toEqual('車両管理情報');
      });
    });

    describe('EL1-8', () => {
      it('画面項目EL1-8_1-1 \n' +
        '「在庫情報」であること', () => {
          expect(page.getTabText(7)).toEqual('在庫情報');
      });
    });

    describe('EL2', () => {
      it('画面項目EL2_1-1 \n' +
        '「出力条件を指定して　出力開始　ボタンをクリックしてください。」であること', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(1);
          expect(page.getLabelTitleText()).toEqual('出力条件を指定して　出力開始　ボタンをクリックしてください。');
      });
    });

    describe('EL2-1', () => {
      it('画面項目EL2-1_1-1 \n' +
        '「出力内容」であること', () => {
          expect(page.getLabelText(0)).toEqual('出力内容');
      });
    });


    describe('EL2-2', () => {
      it('画面項目EL2-2_1-1 \n' +
        '「対象期間」であること', () => {
          expect(page.getLabelPeriodText()).toEqual('対象期間');
      });
    });

    describe('EL2-2-1', () => {
      it('画面項目EL2-2-1_1-1 \n' +
        '「＜１ヶ月前」であること', () => {
          expect(page.getLabelButtonText(0)).toEqual('＜１ヶ月前');
        });
    });

    describe('EL2-2-2', () => {
      it('画面項目EL2-2-2_1-1 \n' +
        '「当日の前月年月」であること', () => {
          const today = DateTimeUtils.today();
          const expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -1));
          expect(page.getYearText(0)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
          expect(page.getMonthText(0)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
      });
    });

    describe('EL2-2-3', () => {
      it('画面項目EL2-2-3_1-1 \n' +
        '「当年月」であること', () => {
          const today = DateTimeUtils.today();
          const expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, 0));
          expect(page.getYearText(1)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
          expect(page.getMonthText(1)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
      });
    });

    describe('EL2-2-4', () => {
      it('画面項目EL2-2-4_1-1 \n' +
        '「１ヶ月先＞」であること', () => {
          expect(page.getLabelButtonText(1)).toEqual('１ヶ月先＞');
        });
    });

    describe('EL2-2-5', () => {
      it('画面項目EL2-2-5_1-1 \n' +
        '「締日」であること', () => {
          expect(page.getLabelCutoffDayText()).toEqual('締日');
      });
    });

    describe('EL2-3', () => {
      it('画面項目EL2-3_1-1 \n' +
        '「組織」であること', () => {
          expect(page.getLabelText(1)).toEqual('組織');
      });
    });

    describe('EL2-4', () => {
      it('画面項目EL2-4_1-1 \n' +
        '「詳細条件」であること', () => {
          expect(page.getLabelButtonDetailText(0, 0)).toEqual('詳細条件');
      });
    });

    describe('EL3', () => {
      it('画面項目EL3_1-1 \n' +
        '「出力する項目を変更したい場合は、下記出力パターンを切り替えてください。」であること', () => {
          expect(page.getLabelConditionTableTitleText(0)).toEqual('出力する項目を変更したい場合は、下記出力パターンを切り替えてください。');
        });
    });

    describe('EL3-1-1', () => {
      it('画面項目EL3-1-1_1-1 \n' +
        '「テキスト出力情報」であること', () => {
          expect(page.getLabelConditionTableBodyThText(0, 0)).toEqual('テキスト出力情報');
      });
    });

    describe('EL3-1-1', () => {
      it('画面項目EL3-1-1_2-1 \n' +
        '「請求履歴情報」であること', () => {
          expect(page.getLabelConditionTableBodyTdText(0, 0)).toEqual('請求履歴情報');
      });
    });

    describe('EL3-1-2', () => {
      it('画面項目EL3-1-2_1-1 \n' +
        '「出力パターン」であること', () => {
          expect(page.getLabelConditionTableBodyThText(0, 1)).toEqual('出力パターン');
      });
    });

    describe('EL3-1-3', () => {
      it('画面項目EL3-1-3_1-1 \n' +
        '「編集」であること', () => {
          expect(page.getLabelEditButtonText(0)).toEqual('編集');
      });
    });

    describe('EL3-2-1', () => {
      it('画面項目EL3-2-1_1-1 \n' +
        '「売掛履歴情報」であること', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(1);
          page.openSelect(0);
          page.clickSelectButton(1);
          expect(page.getLabelConditionTableBodyTdText(0, 0)).toEqual('売掛履歴情報');
      });
    });

    describe('EL3-2-2', () => {
      it('画面項目EL3-2-2_1-1 \n' +
        '「出力パターン」であること', () => {
          expect(page.getLabelConditionTableBodyThText(0, 1)).toEqual('出力パターン');
      });
    });

    describe('EL3-2-3', () => {
      it('画面項目EL3-2-3_1-1 \n' +
        '「編集」であること', () => {
          expect(page.getLabelEditButtonText(0)).toEqual('編集');
      });
    });

    describe('EL2-4-1-1', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「請求先コード」であること\n', () => {
          // 詳細条件
          page.clickCondictionDetailButton();
          page.clickTab(1);
          expect(page.getLabelText(2)).toEqual('請求先コード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「12345678」が入力されること \n' +
        '  2-5 「123456789」が入力されること \n' +
        '  2-6 「123456789」が入力されること ', () => {

          page.clearInputValue(5);
          page.inputValue(5, '');
          expect(page.getInputValue(5)).toBe('');

          page.clearInputValue(5);
          page.inputValue(5, '1');
          expect(page.getInputValue(5)).toBe('1');

          page.clearInputValue(5);
          page.inputValue(5, '12345678');
          expect(page.getInputValue(5)).toBe('12345678');

          page.clearInputValue(5);
          page.inputValue(5, '123456789');
          expect(page.getInputValue(5)).toBe('123456789');

          page.clearInputValue(5);
          page.inputValue(5, '1234567890');
          expect(page.getInputValue(5)).toBe('123456789');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「aBzZ」入力できないこと \n' +
        '  4-2 「_あZ」入力できないこと ', () => {

          page.clearInputValue(5);
          page.inputValue(5, 'aBzZ');
          expect(page.getInputValue(5)).toBe('');

          page.clearInputValue(5);
          page.inputValue(5, '_あZ');
          expect(page.getInputValue(5)).toBe('');
      });
    });

    describe('EL2-4-1-2', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「請求先コード」であること\n', () => {
          expect(page.getLabelText(2)).toEqual('請求先コード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「12345678」が入力されること \n' +
        '  2-5 「123456789」が入力されること \n' +
        '  2-6 「123456789」が入力されること ', () => {

          page.clearInputValue(6);
          page.inputValue(6, '');
          expect(page.getInputValue(6)).toBe('');

          page.clearInputValue(6);
          page.inputValue(6, '1');
          expect(page.getInputValue(6)).toBe('1');

          page.clearInputValue(6);
          page.inputValue(6, '12345678');
          expect(page.getInputValue(6)).toBe('12345678');

          page.clearInputValue(6);
          page.inputValue(6, '123456789');
          expect(page.getInputValue(6)).toBe('123456789');

          page.clearInputValue(6);
          page.inputValue(6, '1234567890');
          expect(page.getInputValue(6)).toBe('123456789');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「aBzZ」入力できないこと \n' +
        '  4-2 「_あZ」入力できないこと ', () => {

          page.clearInputValue(6);
          page.inputValue(6, 'aBzZ');
          expect(page.getInputValue(6)).toBe('');

          page.clearInputValue(6);
          page.inputValue(6, '_あZ');
          expect(page.getInputValue(6)).toBe('');
      });
    });

    describe('EL2-4-2-1', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「請求先カナ」であること\n', () => {
          expect(page.getLabelText(4)).toEqual('請求先カナ');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「1234567890123456789012345678901234567890123456789」が入力されること \n' +
        '  2-5 「12345678901234567890123456789012345678901234567890」が入力されること \n' +
        '  2-6 「12345678901234567890123456789012345678901234567890」が入力されること ', () => {

          page.clearInputValue(7);
          page.inputValue(7, '');
          expect(page.getInputValue(7)).toBe('');

          page.clearInputValue(7);
          page.inputValue(7, '1');
          expect(page.getInputValue(7)).toBe('1');

          page.clearInputValue(7);
          page.inputValue(7, '1234567890123456789012345678901234567890123456789');
          expect(page.getInputValue(7)).toBe('1234567890123456789012345678901234567890123456789');

          page.clearInputValue(7);
          page.inputValue(7, '12345678901234567890123456789012345678901234567890');
          expect(page.getInputValue(7)).toBe('12345678901234567890123456789012345678901234567890');

          page.clearInputValue(7);
          page.inputValue(7, '123456789012345678901234567890123456789012345678901');
          expect(page.getInputValue(7)).toBe('12345678901234567890123456789012345678901234567890');
      });

      it('No4 文字種チェック\n' +
        '   4-1 「12-AZaz」が入力されること\n' +
        '   4-2 「Ａアーア」が入力されること\n' +
        '   4-3 「１２３４５６」が入力されること\n', () => {
          page.clearInputValue(7);
          page.inputValue(7, '12-AZaz');
          // 「ア」が入力されること
          expect(page.getInputValue(7)).toBe('12-AZaz');

          page.clearInputValue(7);
          page.inputValue(7, 'Ａあーア参');
          // 「Ａアーア」が入力されること
          expect(page.getInputValue(7)).toBe('Ａアーア');

          page.clearInputValue(7);
          page.inputValue(7, '１２３４５６');
          // 「１２３４５６」が入力されること
          expect(page.getInputValue(7)).toBe('１２３４５６');
          page.clearInputValue(7);

      });
    });

    describe('EL2-4-2-2', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「請求先カナ」であること\n', () => {
          expect(page.getLabelText(4)).toEqual('請求先カナ');
      });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「1234567890123456789012345678901234567890123456789」が入力されること \n' +
        '  2-5 「12345678901234567890123456789012345678901234567890」が入力されること \n' +
        '  2-6 「12345678901234567890123456789012345678901234567890」が入力されること ', () => {

          page.clearInputValue(8);
          page.inputValue(8, '');
          expect(page.getInputValue(8)).toBe('');

          page.clearInputValue(8);
          page.inputValue(8, '1');
          expect(page.getInputValue(8)).toBe('1');

          page.clearInputValue(8);
          page.inputValue(8, '1234567890123456789012345678901234567890123456789');
          expect(page.getInputValue(8)).toBe('1234567890123456789012345678901234567890123456789');

          page.clearInputValue(8);
          page.inputValue(8, '12345678901234567890123456789012345678901234567890');
          expect(page.getInputValue(8)).toBe('12345678901234567890123456789012345678901234567890');

          page.clearInputValue(8);
          page.inputValue(8, '123456789012345678901234567890123456789012345678900');
          expect(page.getInputValue(8)).toBe('12345678901234567890123456789012345678901234567890');
      });

      it('No4 文字種チェック\n' +
        '   4-1 「12-AZaz」が入力されること\n' +
        '   4-2 「Ａアーア」が入力されること\n' +
        '   4-3 「１２３４５６」が入力されること\n', () => {
          page.clearInputValue(8);
          page.inputValue(8, '12-AZaz');
          // 「12-AZaz」が入力されること
          expect(page.getInputValue(8)).toBe('12-AZaz');

          page.clearInputValue(8);
          page.inputValue(8, 'Ａあーア参');
          // 「Ａアーア」が入力されること
          expect(page.getInputValue(8)).toBe('Ａアーア');

          page.clearInputValue(8);
          page.inputValue(8, '１２３４５６');
          // 「１２３４５６」が入力されること
          expect(page.getInputValue(8)).toBe('１２３４５６');
          page.clearInputValue(8);
      });
    });

    describe('EL2-5', () => {
      it('画面項目EL2-5_1-1 \n' +
        '「条件取消」であること', () => {
          expect(page.getLabelButtonDetailCancelText(0)).toEqual('条件取消');
      });
    });

    describe('ファンクションキー：EL4-1', () => {
      it('画面項目EL4-1_1-1 「F1」であること\n' +
        '  画面項目EL4-1_2-1 「お困りですか？」であること', () => {
        page.navigateTo();
        browser.wait(page.loadingFinished());
        page.clickTab(1);

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
