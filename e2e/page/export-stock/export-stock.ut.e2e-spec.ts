import { browser, $ } from 'protractor';
import { CommonUtils } from '../common-utils';
import { ExportStock } from './export-stock.po';
import { ShareFooter } from '../../page_object/ng-share-module/share-footer.po';
import { ExportStockTestData } from './export-stock.ut.test-data';

describe('export-stock', () => {
  let page: ExportStock;
  let footer: ShareFooter;

  browser.driver.manage().window().maximize();

  beforeAll(() => {
    page = new ExportStock('output');
    footer = new ShareFooter($('share-footer'));
    page.navigateTo();
    browser.wait(page.loadingFinished());
    browser.wait(page.gridLoadingFinished());
  });

  it('モックの返却値をテストデータに変更', () => {
    CommonUtils.sendXhr('/cmnservice/api/v1/loginuseremployeebindmodel/change/mock', {
      resultList: ExportStockTestData.LOGIN_USER_INFO,
      status: 200
    });
    CommonUtils.sendXhr('/company/api/v1/organizationinformation/change/mock', {
      resultList: ExportStockTestData.ORGANIZATION_INFORMATION,
      status: 200
    });
    CommonUtils.sendXhr('/license/api/v1/serviceavailabilityinfo/change/mock', {
      resultList: ExportStockTestData.SERVICE_AVAILABILITY_INFO_PARTSMAN,
      status: 200
    });
    CommonUtils.sendXhr('/output/api/v1/exportpatterninfo/change/mock', {
      resultList: ExportStockTestData.EXPORT_PATTERN_INFO,
      status: 200
    });
    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  describe('画面項目ケース', () => {

    describe('EL1', () => {
      it('画面項目EL1_1-1 \n' +
        '「テキストデータ出力」であること', () => {
          page.clickTab(7);
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
          page.clickTab(7);
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
        '「更新対象期間」であること', () => {
          expect(page.getLabelPeriodText()).toEqual('更新対象期間');
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
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          oneMonthAgo.toLocaleDateString('ja-JP-u-ca-japanese', {era: 'long'});
          expect(page.getYearText(0)).toEqual(('00' + (oneMonthAgo.getFullYear() - 2018)).slice( -2 ));
          expect(page.getMonthText(0)).toEqual(('00' + (oneMonthAgo.getMonth() + 1)).slice( -2 ));
      });
    });

    describe('EL2-2-3', () => {
      it('画面項目EL2-2-3_1-1 \n' +
        '「当年月」であること', () => {
          const today = new Date();
          today.toLocaleDateString('ja-JP-u-ca-japanese', {era: 'long'});
          expect(page.getYearText(1)).toEqual(('00' + (today.getFullYear() - 2018)).slice( -2 ));
          expect(page.getMonthText(1)).toEqual(('00' + (today.getMonth() + 1)).slice( -2 ));
      });
    });

    describe('EL2-2-4', () => {
      it('画面項目EL2-2-4_1-1 \n' +
        '「１ヶ月先＞」であること', () => {
          expect(page.getLabelButtonText(1)).toEqual('１ヶ月先＞');
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
        '「在庫情報」であること', () => {
          expect(page.getLabelConditionTableBodyTdText(0, 0)).toEqual('在庫情報');
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

    describe('EL2-4-1-1', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「倉庫コード」であること\n', () => {
          // 詳細条件
          page.clickCondictionDetailButton();
          page.clickTab(7);
          expect(page.getLabelText(2)).toEqual('倉庫コード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「12345」が入力されること \n' +
        '  2-5 「123456」が入力されること \n' +
        '  2-6 「123456」が入力されること ', () => {

          page.clearInputValue(7);
          page.inputValue(7, '');
          expect(page.getInputValue(7)).toBe('');

          page.clearInputValue(7);
          page.inputValue(7, '1');
          expect(page.getInputValue(7)).toBe('1');

          page.clearInputValue(7);
          page.inputValue(7, '12345');
          expect(page.getInputValue(7)).toBe('12345');

          page.clearInputValue(7);
          page.inputValue(7, '123456');
          expect(page.getInputValue(7)).toBe('123456');

          page.clearInputValue(7);
          page.inputValue(7, '1234567');
          expect(page.getInputValue(7)).toBe('123456');
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

    describe('EL2-4-1-2', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「倉庫コード」であること\n', () => {
          expect(page.getLabelText(2)).toEqual('倉庫コード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「12345」が入力されること \n' +
        '  2-5 「123456」が入力されること \n' +
        '  2-6 「123456」が入力されること ', () => {

          page.clearInputValue(8);
          page.inputValue(8, '');
          expect(page.getInputValue(8)).toBe('');

          page.clearInputValue(8);
          page.inputValue(8, '1');
          expect(page.getInputValue(8)).toBe('1');

          page.clearInputValue(8);
          page.inputValue(8, '12345');
          expect(page.getInputValue(8)).toBe('12345');

          page.clearInputValue(8);
          page.inputValue(8, '123456');
          expect(page.getInputValue(8)).toBe('123456');

          page.clearInputValue(8);
          page.inputValue(8, '1234567');
          expect(page.getInputValue(8)).toBe('123456');
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

    describe('EL2-4-2-1', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「棚番」であること\n', () => {
          expect(page.getLabelText(4)).toEqual('棚番');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「1234567」が入力されること \n' +
        '  2-5 「12345678」が入力されること \n' +
        '  2-6 「12345678」が入力されること ', () => {

          page.clearInputValue(9);
          page.inputValue(9, '');
          expect(page.getInputValue(9)).toBe('');

          page.clearInputValue(9);
          page.inputValue(9, '1');
          expect(page.getInputValue(9)).toBe('1');

          page.clearInputValue(9);
          page.inputValue(9, '1234567');
          expect(page.getInputValue(9)).toBe('1234567');

          page.clearInputValue(9);
          page.inputValue(9, '12345678');
          expect(page.getInputValue(9)).toBe('12345678');

          page.clearInputValue(9);
          page.inputValue(9, '123456789');
          expect(page.getInputValue(9)).toBe('12345678');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「12-AZaz」が入力されること \n' +
        '  4-2 「Ａあア参」が入力されること \n' +
        '  4-3 「１２３４５６」が入力されること ', () => {

          page.clearInputValue(9);
          page.inputValue(9, '12-AZaz');
          expect(page.getInputValue(9)).toBe('12-AZaz');

          page.clearInputValue(9);
          page.inputValue(9, 'Ａあア参');
          expect(page.getInputValue(9)).toBe('Ａあア参');

          page.clearInputValue(9);
          page.inputValue(9, '１２３４５６');
          expect(page.getInputValue(9)).toBe('１２３４５６');
      });
    });

    describe('EL2-4-2-2', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「棚番」であること\n', () => {
          expect(page.getLabelText(4)).toEqual('棚番');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「1234567」が入力されること \n' +
        '  2-5 「12345678」が入力されること \n' +
        '  2-6 「12345678」が入力されること ', () => {

          page.clearInputValue(10);
          page.inputValue(10, '');
          expect(page.getInputValue(10)).toBe('');

          page.clearInputValue(10);
          page.inputValue(10, '1');
          expect(page.getInputValue(10)).toBe('1');

          page.clearInputValue(10);
          page.inputValue(10, '1234567');
          expect(page.getInputValue(10)).toBe('1234567');

          page.clearInputValue(10);
          page.inputValue(10, '12345678');
          expect(page.getInputValue(10)).toBe('12345678');

          page.clearInputValue(10);
          page.inputValue(10, '123456789');
          expect(page.getInputValue(10)).toBe('12345678');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「12-AZaz」が入力されること \n' +
        '  4-2 「Ａあア参」が入力されること \n' +
        '  4-3 「１２３４５６」が入力されること ', () => {

          page.clearInputValue(10);
          page.inputValue(10, '12-AZaz');
          expect(page.getInputValue(10)).toBe('12-AZaz');

          page.clearInputValue(10);
          page.inputValue(10, 'Ａあア参');
          expect(page.getInputValue(10)).toBe('Ａあア参');

          page.clearInputValue(10);
          page.inputValue(10, '１２３４５６');
          expect(page.getInputValue(10)).toBe('１２３４５６');
      });
    });

    describe('EL2-4-3-1', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「仕入先コード」であること\n', () => {
          expect(page.getLabelText(6)).toEqual('仕入先コード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「12345678」が入力されること \n' +
        '  2-5 「123456789」が入力されること \n' +
        '  2-6 「123456789」が入力されること ', () => {

          page.clearInputValue(11);
          page.inputValue(11, '');
          expect(page.getInputValue(11)).toBe('');

          page.clearInputValue(11);
          page.inputValue(11, '1');
          expect(page.getInputValue(11)).toBe('1');

          page.clearInputValue(11);
          page.inputValue(11, '12345678');
          expect(page.getInputValue(11)).toBe('12345678');

          page.clearInputValue(11);
          page.inputValue(11, '123456789');
          expect(page.getInputValue(11)).toBe('123456789');

          page.clearInputValue(11);
          page.inputValue(11, '1234567890');
          expect(page.getInputValue(11)).toBe('123456789');
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

    describe('EL2-4-3-2', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「仕入先コード」であること\n', () => {
          expect(page.getLabelText(6)).toEqual('仕入先コード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「12345678」が入力されること \n' +
        '  2-5 「123456789」が入力されること \n' +
        '  2-6 「123456789」が入力されること ', () => {

          page.clearInputValue(12);
          page.inputValue(12, '');
          expect(page.getInputValue(12)).toBe('');

          page.clearInputValue(12);
          page.inputValue(12, '1');
          expect(page.getInputValue(12)).toBe('1');

          page.clearInputValue(12);
          page.inputValue(12, '12345678');
          expect(page.getInputValue(12)).toBe('12345678');

          page.clearInputValue(12);
          page.inputValue(12, '123456789');
          expect(page.getInputValue(12)).toBe('123456789');

          page.clearInputValue(12);
          page.inputValue(12, '1234567890');
          expect(page.getInputValue(12)).toBe('123456789');
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

    describe('EL2-4-4-1', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「メーカーコード」であること\n', () => {
          expect(page.getLabelText(8)).toEqual('メーカーコード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「12345678」が入力されること \n' +
        '  2-5 「123456789」が入力されること \n' +
        '  2-6 「123456789」が入力されること ', () => {

          page.clearInputValue(13);
          page.inputValue(13, '');
          expect(page.getInputValue(13)).toBe('');

          page.clearInputValue(13);
          page.inputValue(13, '1');
          expect(page.getInputValue(13)).toBe('1');

          page.clearInputValue(13);
          page.inputValue(13, '12345678');
          expect(page.getInputValue(13)).toBe('12345678');

          page.clearInputValue(13);
          page.inputValue(13, '123456789');
          expect(page.getInputValue(13)).toBe('123456789');

          page.clearInputValue(13);
          page.inputValue(13, '1234567890');
          expect(page.getInputValue(13)).toBe('123456789');
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

    describe('EL2-4-4-2', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「メーカーコード」であること\n', () => {
          expect(page.getLabelText(8)).toEqual('メーカーコード');
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

    describe('EL2-4-5-1', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「商品大分類コード」であること\n', () => {
          expect(page.getLabelText(10)).toEqual('商品大分類コード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「123」が入力されること \n' +
        '  2-5 「1234」が入力されること \n' +
        '  2-6 「1234」が入力されること ', () => {

          page.clearInputValue(15);
          page.inputValue(15, '');
          expect(page.getInputValue(15)).toBe('');

          page.clearInputValue(15);
          page.inputValue(15, '1');
          expect(page.getInputValue(15)).toBe('1');

          page.clearInputValue(15);
          page.inputValue(15, '123');
          expect(page.getInputValue(15)).toBe('123');

          page.clearInputValue(15);
          page.inputValue(15, '1234');
          expect(page.getInputValue(15)).toBe('1234');

          page.clearInputValue(15);
          page.inputValue(15, '12345');
          expect(page.getInputValue(15)).toBe('1234');
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

    describe('EL2-4-5-2', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「商品大分類コード」であること\n', () => {
          expect(page.getLabelText(10)).toEqual('商品大分類コード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「123」が入力されること \n' +
        '  2-5 「1234」が入力されること \n' +
        '  2-6 「1234」が入力されること ', () => {

          page.clearInputValue(16);
          page.inputValue(16, '');
          expect(page.getInputValue(16)).toBe('');

          page.clearInputValue(16);
          page.inputValue(16, '1');
          expect(page.getInputValue(16)).toBe('1');

          page.clearInputValue(16);
          page.inputValue(16, '123');
          expect(page.getInputValue(16)).toBe('123');

          page.clearInputValue(16);
          page.inputValue(16, '1234');
          expect(page.getInputValue(16)).toBe('1234');

          page.clearInputValue(16);
          page.inputValue(16, '12345');
          expect(page.getInputValue(16)).toBe('1234');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「aBzZ」入力できないこと \n' +
        '  4-2 「_あZ」入力できないこと ', () => {

          page.clearInputValue(16);
          page.inputValue(16, 'aBzZ');
          expect(page.getInputValue(16)).toBe('');

          page.clearInputValue(16);
          page.inputValue(16, '_あZ');
          expect(page.getInputValue(16)).toBe('');
      });
    });

    describe('EL2-4-6-1', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「商品中分類コード」であること\n', () => {
          expect(page.getLabelText(12)).toEqual('商品中分類コード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「123」が入力されること \n' +
        '  2-5 「1234」が入力されること \n' +
        '  2-6 「1234」が入力されること ', () => {

          page.clearInputValue(17);
          page.inputValue(17, '');
          expect(page.getInputValue(17)).toBe('');

          page.clearInputValue(17);
          page.inputValue(17, '1');
          expect(page.getInputValue(17)).toBe('1');

          page.clearInputValue(17);
          page.inputValue(17, '123');
          expect(page.getInputValue(17)).toBe('123');

          page.clearInputValue(17);
          page.inputValue(17, '1234');
          expect(page.getInputValue(17)).toBe('1234');

          page.clearInputValue(17);
          page.inputValue(17, '12345');
          expect(page.getInputValue(17)).toBe('1234');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「aBzZ」入力できないこと \n' +
        '  4-2 「_あZ」入力できないこと ', () => {

          page.clearInputValue(17);
          page.inputValue(17, 'aBzZ');
          expect(page.getInputValue(17)).toBe('');

          page.clearInputValue(17);
          page.inputValue(17, '_あZ');
          expect(page.getInputValue(17)).toBe('');
      });
    });

    describe('EL2-4-6-2', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「商品中分類コード」であること\n', () => {
          expect(page.getLabelText(12)).toEqual('商品中分類コード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「123」が入力されること \n' +
        '  2-5 「1234」が入力されること \n' +
        '  2-6 「1234」が入力されること ', () => {

          page.clearInputValue(18);
          page.inputValue(18, '');
          expect(page.getInputValue(18)).toBe('');

          page.clearInputValue(18);
          page.inputValue(18, '1');
          expect(page.getInputValue(18)).toBe('1');

          page.clearInputValue(18);
          page.inputValue(18, '123');
          expect(page.getInputValue(18)).toBe('123');

          page.clearInputValue(18);
          page.inputValue(18, '1234');
          expect(page.getInputValue(18)).toBe('1234');

          page.clearInputValue(18);
          page.inputValue(18, '12345');
          expect(page.getInputValue(18)).toBe('1234');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「aBzZ」入力できないこと \n' +
        '  4-2 「_あZ」入力できないこと ', () => {

          page.clearInputValue(18);
          page.inputValue(18, 'aBzZ');
          expect(page.getInputValue(18)).toBe('');

          page.clearInputValue(18);
          page.inputValue(18, '_あZ');
          expect(page.getInputValue(18)).toBe('');
      });
    });

    describe('EL2-4-7-1', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「グループコード」であること\n', () => {
          expect(page.getLabelText(14)).toEqual('グループコード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「1234」が入力されること \n' +
        '  2-5 「12345」が入力されること \n' +
        '  2-6 「12345」が入力されること ', () => {

          page.clearInputValue(19);
          page.inputValue(19, '');
          expect(page.getInputValue(19)).toBe('');

          page.clearInputValue(19);
          page.inputValue(19, '1');
          expect(page.getInputValue(19)).toBe('1');

          page.clearInputValue(19);
          page.inputValue(19, '1234');
          expect(page.getInputValue(19)).toBe('1234');

          page.clearInputValue(19);
          page.inputValue(19, '12345');
          expect(page.getInputValue(19)).toBe('12345');

          page.clearInputValue(19);
          page.inputValue(19, '123456');
          expect(page.getInputValue(19)).toBe('12345');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「aBzZ」入力できないこと \n' +
        '  4-2 「_あZ」入力できないこと ', () => {

          page.clearInputValue(19);
          page.inputValue(19, 'aBzZ');
          expect(page.getInputValue(19)).toBe('');

          page.clearInputValue(19);
          page.inputValue(19, '_あZ');
          expect(page.getInputValue(19)).toBe('');
      });
    });

    describe('EL2-4-7-2', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「グループコード」であること\n', () => {
          expect(page.getLabelText(14)).toEqual('グループコード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「1234」が入力されること \n' +
        '  2-5 「12345」が入力されること \n' +
        '  2-6 「12345」が入力されること ', () => {

          page.clearInputValue(20);
          page.inputValue(20, '');
          expect(page.getInputValue(20)).toBe('');

          page.clearInputValue(20);
          page.inputValue(20, '1');
          expect(page.getInputValue(20)).toBe('1');

          page.clearInputValue(20);
          page.inputValue(20, '1234');
          expect(page.getInputValue(20)).toBe('1234');

          page.clearInputValue(20);
          page.inputValue(20, '12345');
          expect(page.getInputValue(20)).toBe('12345');

          page.clearInputValue(20);
          page.inputValue(20, '123456');
          expect(page.getInputValue(20)).toBe('12345');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「aBzZ」入力できないこと \n' +
        '  4-2 「_あZ」入力できないこと ', () => {

          page.clearInputValue(20);
          page.inputValue(20, 'aBzZ');
          expect(page.getInputValue(20)).toBe('');

          page.clearInputValue(20);
          page.inputValue(20, '_あZ');
          expect(page.getInputValue(20)).toBe('');
      });
    });

    describe('EL2-4-8-1', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「BLコード」であること\n', () => {
          expect(page.getLabelText(16)).toEqual('BLコード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「1234567」が入力されること \n' +
        '  2-5 「12345678」が入力されること \n' +
        '  2-6 「12345678」が入力されること ', () => {

          page.clearInputValue(21);
          page.inputValue(21, '');
          expect(page.getInputValue(21)).toBe('');

          page.clearInputValue(21);
          page.inputValue(21, '1');
          expect(page.getInputValue(21)).toBe('1');

          page.clearInputValue(21);
          page.inputValue(21, '1234567');
          expect(page.getInputValue(21)).toBe('1234567');

          page.clearInputValue(21);
          page.inputValue(21, '12345678');
          expect(page.getInputValue(21)).toBe('12345678');

          page.clearInputValue(21);
          page.inputValue(21, '123456789');
          expect(page.getInputValue(21)).toBe('12345678');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「aBzZ」入力できないこと \n' +
        '  4-2 「_あZ」入力できないこと ', () => {

          page.clearInputValue(21);
          page.inputValue(21, 'aBzZ');
          expect(page.getInputValue(21)).toBe('');

          page.clearInputValue(21);
          page.inputValue(21, '_あZ');
          expect(page.getInputValue(21)).toBe('');
      });
    });

    describe('EL2-4-8-2', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「BLコード」であること\n', () => {
          expect(page.getLabelText(16)).toEqual('BLコード');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「1234567」が入力されること \n' +
        '  2-5 「12345678」が入力されること \n' +
        '  2-6 「12345678」が入力されること ', () => {

          page.clearInputValue(22);
          page.inputValue(22, '');
          expect(page.getInputValue(22)).toBe('');

          page.clearInputValue(22);
          page.inputValue(22, '1');
          expect(page.getInputValue(22)).toBe('1');

          page.clearInputValue(22);
          page.inputValue(22, '1234567');
          expect(page.getInputValue(22)).toBe('1234567');

          page.clearInputValue(22);
          page.inputValue(22, '12345678');
          expect(page.getInputValue(22)).toBe('12345678');

          page.clearInputValue(22);
          page.inputValue(22, '123456789');
          expect(page.getInputValue(22)).toBe('12345678');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「aBzZ」入力できないこと \n' +
        '  4-2 「_あZ」入力できないこと ', () => {

          page.clearInputValue(22);
          page.inputValue(22, 'aBzZ');
          expect(page.getInputValue(22)).toBe('');

          page.clearInputValue(22);
          page.inputValue(22, '_あZ');
          expect(page.getInputValue(22)).toBe('');
      });
    });

    describe('EL2-4-9', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「品番」であること\n', () => {
          expect(page.getLabelText(18)).toEqual('品番');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「12345678901234567890123」が入力されること \n' +
        '  2-5 「123456789012345678901234」が入力されること \n' +
        '  2-6 「123456789012345678901234」が入力されること ', () => {

          page.clearInputValue(23);
          page.inputValue(23, '');
          expect(page.getInputValue(23)).toBe('');

          page.clearInputValue(23);
          page.inputValue(23, '1');
          expect(page.getInputValue(23)).toBe('1');

          page.clearInputValue(23);
          page.inputValue(23, '12345678901234567890123');
          expect(page.getInputValue(23)).toBe('12345678901234567890123');

          page.clearInputValue(23);
          page.inputValue(23, '123456789012345678901234');
          expect(page.getInputValue(23)).toBe('123456789012345678901234');

          page.clearInputValue(23);
          page.inputValue(23, '1234567890123456789012345');
          expect(page.getInputValue(23)).toBe('123456789012345678901234');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「12-AZaz」が入力されること \n' +
        '  4-2 「Ａあア参」が入力されること \n' +
        '  4-3 「１２３４５６」が入力されること ', () => {

          page.clearInputValue(23);
          page.inputValue(23, '12-AZaz');
          expect(page.getInputValue(23)).toBe('12-AZaz');

          page.clearInputValue(23);
          page.inputValue(23, 'Ａあア参');
          expect(page.getInputValue(23)).toBe('Ａあア参');

          page.clearInputValue(23);
          page.inputValue(23, '１２３４５６');
          expect(page.getInputValue(23)).toBe('１２３４５６');
      });
    });

    describe('EL2-4-10', () => {
      it('No1-1 ラベルチェック\n' +
        '   1-1 「品名」であること\n', () => {
          expect(page.getLabelText(20)).toEqual('品名');
        });
      it('No2 桁数チェック\n' +
        '  2-2 入力できること \n' +
        '  2-3 「1」が入力されること \n' +
        '  2-4 「123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789」が入力されること \n' +
        '  2-5 「1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890」が入力されること \n' +
        '  2-6 「1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890」が入力されること ', () => {

          page.clearInputValue(24);
          page.inputValue(24, '');
          expect(page.getInputValue(24)).toBe('');

          page.clearInputValue(24);
          page.inputValue(24, '1');
          expect(page.getInputValue(24)).toBe('1');

          page.clearInputValue(24);
          page.inputValue(24, '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789');
          expect(page.getInputValue(24)).toBe('1234567890123456789012345678901234567890123456789012345678901234567890' +
            '12345678901234567890123456789');

          page.clearInputValue(24);
          page.inputValue(24, '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890');
          expect(page.getInputValue(24)).toBe('1234567890123456789012345678901234567890123456789012345678901234567890' +
            '123456789012345678901234567890');

          page.clearInputValue(24);
          page.inputValue(24, '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901');
          expect(page.getInputValue(24)).toBe('1234567890123456789012345678901234567890123456789012345678901234567890' +
            '123456789012345678901234567890');
      });

      it('No4 文字種チェック\n' +
        '  4-1 「12-AZaz」が入力されること \n' +
        '  4-2 「Ａあア参」が入力されること \n' +
        '  4-3 「１２３４５６」が入力されること ', () => {

          page.clearInputValue(24);
          page.inputValue(24, '12-AZaz');
          expect(page.getInputValue(24)).toBe('12-AZaz');

          page.clearInputValue(24);
          page.inputValue(24, 'Ａあア参');
          expect(page.getInputValue(24)).toBe('Ａあア参');

          page.clearInputValue(24);
          page.inputValue(24, '１２３４５６');
          expect(page.getInputValue(24)).toBe('１２３４５６');
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
        page.clickTab(7);

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
