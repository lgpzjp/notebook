import { $, $$, browser, by, ElementFinder, protractor } from 'protractor';
import { CommonUtils } from '../common-utils';
import { ExportStock } from './export-stock.po';
import { ExportStockTestData } from './export-stock.test-data';
import { BlDialog } from '../../page_object/bl-ng-ui-component/bl-dialog.po';
import { DateTimeUtils } from '@blcloud/bl-common';

describe('export-stock', () => {
  let page: ExportStock;
  let helpPage: ElementFinder;
  let topUrl: string;
  let dialog: BlDialog;

  browser.driver.manage().window().maximize();

  beforeAll(() => {
    page = new ExportStock('output');
    helpPage = $('.modal-content');
    topUrl = browser.baseUrl + '/output';
    dialog = new BlDialog('bl-dialog');
    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  it('モックの返却値をテストデータに変更', () => {
    CommonUtils.sendXhr('/cmnservice/api/v1/loginuseremployeebindmodel/change/mock', {
      resultList: ExportStockTestData.LOGIN_USER_INFO1,
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
    CommonUtils.sendXhr('/role/api/v1/useravailablepermission/change/mock', {
      resultList: ExportStockTestData.USER_AVAILABLE_PERMISSION2,
      status: 200
    });
    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  describe('シナリオケース', () => {
    describe('シナリオEL2-1', () => {
      it('EL2-1_1 \n' +
        '  「在庫情報」が選択されていること', () => {
          page.clickTab(7);
          expect(page.getLabelSelectText(0)).toEqual('在庫情報');
      });
    });
    describe('シナリオEL2-3', () => {
      it('EL2-3_2 \n' +
        '  「全組織」が選択されていること', () => {
          expect(page.getLabelCompoboxDefaultText(6)).toBe('全組織');
      });
    });
    describe('シナリオEL2-4-＊', () => {
      it('EL2-4-＊_3 \n' +
        '  クローズ状態であること', () => {
          expect(page.countDetailCondictionClose()).toEqual(1);
      });
    });
    describe('シナリオEL1-1', () => {
      it('EL1-1_4 \n' +
        '  売上伝票情報出力のタブ画面を表示すること', () => {
          page.clickTab(0);
          expect(page.getTabText(0)).toEqual('売上伝票情報');
      });
    });
    describe('シナリオEL1-2', () => {
      it('EL1-2_5 \n' +
        '  債権情報出力のタブ画面を表示すること', () => {
          page.clickTab(1);
          expect(page.getTabText(1)).toEqual('債権情報');
      });
    });
    describe('シナリオEL1-3', () => {
      it('EL1-3_6 \n' +
        '  仕入伝票情報出力のタブ画面を表示すること', () => {
          page.clickTab(2);
          expect(page.getTabText(2)).toEqual('仕入伝票情報');
      });
    });
    describe('シナリオEL1-2', () => {
      it('EL1-4_7 \n' +
        '  債務情報出力のタブ画面を表示すること', () => {
          page.clickTab(3);
          expect(page.getTabText(3)).toEqual('債務情報');
      });
    });
    describe('シナリオEL1-5', () => {
      it('EL1-5_8 \n' +
        '  在庫移動伝票情報出力のタブ画面を表示すること', () => {
          page.clickTab(4);
          expect(page.getTabText(4)).toEqual('在庫移動伝票情報');
      });
    });
    describe('シナリオEL1-6-5', () => {
      it('EL1-6_9 \n' +
        '  取引先情報出力のタブ画面を表示すること', () => {
          page.clickTab(5);
          expect(page.getTabText(5)).toEqual('取引先情報');
      });
    });
    describe('シナリオEL1-7', () => {
      it('EL1-7_10 \n' +
        '  車両管理情報出力のタブ画面を表示すること', () => {
          page.clickTab(6);
          expect(page.getTabText(6)).toEqual('車両管理情報');
      });
    });
    describe('シナリオEL2-2-1', () => {
      it('EL2-2-1_12 \n' +
        '  対象期間の開始日と終了日は1ヶ月前に設定すること', () => {

          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(7);

          page.clickOneMonthAgoLater(0);

          const today = DateTimeUtils.today();
          let expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -2));
          expect(page.getYearText(0)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
          expect(page.getMonthText(0)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
          expect(page.getDayText(0)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));

          expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -1));
          expect(page.getYearText(1)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
          expect(page.getMonthText(1)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
          expect(page.getDayText(1)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));
      });
    });
    describe('シナリオEL2-2-4', () => {
      it('EL2-2-4_13 \n' +
        '  対象期間の開始日と終了日は1ヶ月先に設定すること', () => {

          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(7);

          page.clickOneMonthAgoLater(5);

          const today = DateTimeUtils.today();
          let expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, 0));
          expect(page.getYearText(0)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
          expect(page.getMonthText(0)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
          expect(page.getDayText(0)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));

          expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, 1));
          expect(page.getYearText(1)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
          expect(page.getMonthText(1)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
          expect(page.getDayText(1)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));
      });
    });
    describe('シナリオEL2-4', () => {
      it('EL2-4_14 \n' +
        '  詳細出力条件パネルを表示すること', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(7);

          // 詳細条件
          page.clickCondictionDetailButton();
          expect(page.countDetailCondictionOpen()).toEqual(1);
      });
    });
    describe('シナリオEL2-6', () => {
      it('EL2-6_15 \n' +
        '  出力条件を初期値に戻すこと', () => {
          CommonUtils.sendXhr('/cmnservice/api/v1/loginuseremployeebindmodel/change/mock', {
            resultList: ExportStockTestData.LOGIN_USER_INFO2,
            status: 200
          });
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(7);

          page.openCombox(0);
          page.openCombox(3);
          page.openCombox(4);

          page.openCombox(3);
          page.clickSelectButton(5);
          page.clearInputValue(0);
          page.inputValue(0, '01');
          page.clearInputValue(1);
          page.inputValue(1, '08');
          page.clearInputValue(2);
          page.inputValue(2, '01');

          page.clearInputValue(3);
          page.inputValue(3, '01');
          page.clearInputValue(4);
          page.inputValue(4, '08');
          page.clearInputValue(5);
          page.inputValue(5, '02');

          page.clearInputValue(6);
          page.inputValue(6, '1');
          page.clearInputValue(7);
          page.inputValue(7, '2');
          page.clearInputValue(8);
          page.inputValue(8, '3');
          page.clearInputValue(9);
          page.inputValue(9, '4');
          page.clearInputValue(10);
          page.inputValue(10, '5');
          page.clearInputValue(11);
          page.inputValue(11, '6');
          page.clearInputValue(12);
          page.inputValue(12, '7');
          page.clearInputValue(13);
          page.inputValue(13, '8');
          page.clearInputValue(14);
          page.inputValue(14, '9');
          page.clearInputValue(15);
          page.inputValue(15, '10');
          page.clearInputValue(16);
          page.inputValue(16, '11');
          page.clearInputValue(17);
          page.inputValue(17, '12');
          page.clearInputValue(18);
          page.inputValue(18, '13');
          page.clearInputValue(19);
          page.inputValue(19, '14');
          page.clearInputValue(20);
          page.inputValue(20, '15');
          page.clearInputValue(21);
          page.inputValue(21, '16');
          page.clearInputValue(22);
          page.inputValue(22, '17');
          page.clearInputValue(23);
          page.inputValue(23, '18');
          page.inputValue(24, '19');

          // 条件取消
          page.getScroll();
          page.clickCondictionDetailCancelButton();

          const today = DateTimeUtils.today();
          let expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -1));
          expect(page.getYearText(0)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
          expect(page.getMonthText(0)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
          expect(page.getDayText(0)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));

          expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, 0));
          expect(page.getYearText(1)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
          expect(page.getMonthText(1)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
          expect(page.getDayText(1)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));

          expect(page.getLabelCompoboxDefaultText(6)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(7)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(8)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(9)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(10)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(11)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(12)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(13)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(14)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(15)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(16)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(17)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(18)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(19)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(20)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(21)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(22)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(23)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(24)).toEqual('');
      });
    });
    describe('シナリオEL3-1-3', () => {
      it('EL3-1-3_16 \n' +
        '  出力パターン編集モーダル画面を開くこと', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(7);
          page.clickEdit(0);
          browser.wait(protractor.ExpectedConditions.visibilityOf(page.modal));
       　 expect($('modal-container').$('.modal-title').getText()).toEqual('出力パターン編集');
      });
    });
    describe('シナリオEL4-1', () => {
      it('EL4-1_17 \n' +
        '  ヘルプ画面をモーダル表示すること', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(7);
          browser.actions().sendKeys(protractor.Key.F1).perform();
          browser.wait(protractor.ExpectedConditions.visibilityOf(helpPage));
          expect(helpPage.isDisplayed()).toBeTruthy();
          helpPage.element(by.buttonText('閉じる')).click();
      });
    });
    describe('シナリオSFT4-1', () => {
      it('SFT4-1_18 \n' +
        '  押下不可であること', () => {
          expect($$('.function__list.disabled').get(0).getText()).toEqual('F2');
      });
    });
    describe('シナリオSFT4-2', () => {
      it('SFT4-2_19 \n' +
        '  押下不可であること', () => {
          expect($$('.function__list.disabled').get(1).getText()).toEqual('F3');
      });
    });
    describe('シナリオSFT4-3', () => {
      it('SFT4-3_20 \n' +
        '  押下不可であること', () => {
          expect($$('.function__list.disabled').get(2).getText()).toEqual('F4');
      });
    });
    describe('シナリオSFT4-4', () => {
      it('SFT4-4_21 \n' +
        '  押下不可であること', () => {
          expect($$('.function__list.disabled').get(3).getText()).toEqual('F5');
      });
    });
    describe('シナリオEL4-2', () => {
      it('EL4-2_22 \n' +
        '  詳細出力条件パネルを表示すること', () => {
          browser.actions().sendKeys(protractor.Key.F6).perform();
          browser.wait(page.loadingFinished());
          expect(page.countDetailCondictionOpen()).toEqual(1);
      });
    });
    describe('シナリオSFT4-5', () => {
      it('SFT4-5_23 \n' +
        '  押下不可であること', () => {
          expect($$('.function__list.disabled').get(4).getText()).toEqual('F7');
      });
    });
    describe('シナリオSFT4-6', () => {
      it('SFT4-6_24 \n' +
        '  押下不可であること', () => {
          expect($$('.function__list.disabled').get(5).getText()).toEqual('F8');
      });
    });
    describe('シナリオEL4-3', () => {
      it('EL4-3_25 \n' +
        '  押下不可であること', () => {
          expect($$('.function__list.disabled').get(6).getText()).toEqual('F9\nF切替');
      });
    });
    describe('シナリオEL4-4', () => {
      it('EL4-4_26 \n' +
        '  トップメニューに遷移すること', () => {
          browser.actions().sendKeys(protractor.Key.F10).perform();
          browser.wait(page.loadingFinished());
          expect(browser.getCurrentUrl()).toEqual(topUrl);
      });
    });
    describe('シナリオEL4-5', () => {
      it('EL4-5_27 \n' +
        '  前の画面に遷移すること', () => {
          browser.get('/');
          const beforeUrl = browser.getCurrentUrl();
          browser.wait(page.loadingFinished());
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(7);
          browser.actions().sendKeys(protractor.Key.F11).perform();
          browser.wait(page.loadingFinished());
          expect(browser.getCurrentUrl()).toBe(beforeUrl);
      });
    });
    describe('シナリオEL4-6', () => {
      it('EL4-6_28 \n' +
        '  テキスト出力処理を実行すること', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(7);
          browser.actions().sendKeys(protractor.Key.F12).perform();
          expect($$('div.message').get(1).getText()).toBe('出力処理中です。\nしばらくお待ちください。');
      });
    });
    describe('シナリオEV2-3', () => {
      it('EV2-3_38 \n' +
        '  メッセージを表示し、処理を終了すること\n' +
        '  メッセージ：対象期間が不正です。入力内容を確認してください。', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(7);

          page.clearInputValue(0);
          page.inputValue(0, '1');
          page.clearInputValue(1);
          page.inputValue(1, '11');
          page.clearInputValue(2);
          page.inputValue(2, '1');
          page.clearInputValue(3);
          page.inputValue(3, '1');
          page.clearInputValue(4);
          page.inputValue(4, '10');
          page.clearInputValue(5);
          page.inputValue(5, '31');
          page.getEleInput(1).sendKeys(protractor.Key.TAB);
          browser.wait(protractor.ExpectedConditions.visibilityOf(dialog.dialog));
          expect($('div.message-container').$('div.message').getText()).toBe('対象期間が不正です。入力内容を確認してください。');
          page.clickOk();
      });
    });
    describe('シナリオEV2-3', () => {
      it('EV2-3_40 \n' +
        '  メッセージを表示し、処理を終了すること\n' +
        '  メッセージ：対象期間が不正です。入力内容を確認してください。', () => {

          page.clearInputValue(0);
          page.inputValue(0, '1');
          page.clearInputValue(1);
          page.inputValue(1, '10');
          page.clearInputValue(2);
          page.inputValue(2, '31');
          page.clearInputValue(3);
          page.inputValue(3, '1');
          page.clearInputValue(4);
          page.inputValue(4, '10');
          page.clearInputValue(5);
          page.inputValue(5, '31');

          page.clearInputValue(0);
          page.inputValue(0, '1');
          page.clearInputValue(1);
          page.inputValue(1, '11');
          page.clearInputValue(2);
          page.inputValue(2, '1');

          page.getEleInput(3).sendKeys(protractor.Key.TAB);
          expect($('div.message-container').$('div.message').getText()).toBe('対象期間が不正です。入力内容を確認してください。');
          page.clickOk();
      });
    });
    describe('シナリオEV0', () => {
      it('EV0_43 \n' +
        '  顧客車両情報タブで保存したテキスト出力パターン情報をテキスト出力情報タブ区分が 「11:在庫情報」で取得する\n', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(7);

          expect(page.getLabelSelectText(1)).toEqual('パターン１');
          page.openCombox(0);
          page.openCombox(3);
          page.openCombox(5);

          expect(page.getChoice(6)).toEqual('パターン１');
          expect(page.getChoice(7)).toEqual('パターン２');
          page.clickSelectButton(7);
      });
    });
    describe('シナリオEV0', () => {
      it('EV0_45 \n' +
        '  LocalStorageから取得したテキスト出力パターン情報.テキスト出力パターン名称の一覧を設定\n' +
        '※テキスト出力パターン情報.テキスト出力情報区分：23（在庫情報）', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(7);

          expect(page.getLabelSelectText(1)).toEqual('パターン２');
      });
    });
    describe('シナリオEV3-5', () => {
      it('EV3-5_48 \n' +
        '  ダイアログにてエラーメッセージを表示し、以降の処理は行わないこと\n' +
        '  メッセージ「権限が無い為、テキスト出力は行えません」', () => {
          CommonUtils.sendXhr('/role/api/v1/useravailablepermission/change/mock', {
            resultList: ExportStockTestData.USER_AVAILABLE_PERMISSION1,
            status: 200
          });

          page.navigateTo();
          browser.wait(page.loadingFinished());
          browser.actions().sendKeys(protractor.Key.F12).perform();
          browser.wait(protractor.ExpectedConditions.visibilityOf(dialog.dialog));
          expect($('div.message-container').$('div.message').getText()).toBe('権限が無い為、テキスト出力は行えません');
          page.clickOk();
      });
    });

  });
});
