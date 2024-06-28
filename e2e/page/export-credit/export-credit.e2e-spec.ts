import { $, $$, browser, by, ElementFinder, protractor } from 'protractor';
import { CommonUtils } from '../common-utils';
import { ExportCredit } from './export-credit.po';
import { ExportCreditTestData } from './export-credit.test-data';
import { BlDialog } from '../../page_object/bl-ng-ui-component/bl-dialog.po';
import { DateTimeUtils } from '@blcloud/bl-common';

describe('export-credit', () => {
  let page: ExportCredit;
  let helpPage: ElementFinder;
  let topUrl: string;
  let dialog: BlDialog;

  browser.driver.manage().window().maximize();

  beforeAll(() => {
    page = new ExportCredit('output');
    helpPage = $('.modal-content');
    topUrl = browser.baseUrl + '/output';
    dialog = new BlDialog('bl-dialog');
    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  it('モックの返却値をテストデータに変更', () => {
    CommonUtils.sendXhr('/cmnservice/api/v1/loginuseremployeebindmodel/change/mock', {
      resultList: ExportCreditTestData.LOGIN_USER_INFO1,
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
    CommonUtils.sendXhr('/role/api/v1/useravailablepermission/change/mock', {
      resultList: ExportCreditTestData.USER_AVAILABLE_PERMISSION2,
      status: 200
    });
    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  describe('シナリオケース', () => {
    describe('シナリオEL2-1', () => {
      it('EL2-1_1 \n' +
        '  「請求履歴」が選択されていること', () => {
          page.clickTab(1);
          expect(page.getLabelSelectText(0)).toEqual('請求履歴');
      });
    });
    describe('シナリオEL2-3', () => {
      it('EL2-3_2 \n' +
        '  「全組織」が選択されていること', () => {
          expect(page.getLabelCompoboxDefaultText(4)).toBe('全組織');
      });
    });
    describe('シナリオEL2-4-＊', () => {
      it('EL2-4-＊_3 \n' +
        '  クローズ状態であること', () => {
          expect(page.countDetailCondictionClose()).toEqual(1);
      });
    });
    describe('シナリオEL1-1　EV1-1', () => {
      it('EL1-1　EV1-1_4 \n' +
        '  売上伝票情報出力のタブ画面を表示すること', () => {
          page.clickTab(0);
          expect(page.getTabText(0)).toEqual('売上伝票情報');
      });
    });
    describe('シナリオEL1-3　EV1-2', () => {
      it('EL1-3　EV1-2_5 \n' +
        '  仕入伝票情報出力のタブ画面を表示すること', () => {
          page.clickTab(2);
          expect(page.getTabText(2)).toEqual('仕入伝票情報');
      });
    });
    describe('シナリオEL1-4　EV1-3', () => {
      it('EL1-4　EV1-3_6 \n' +
        '  債務情報出力のタブ画面を表示すること', () => {
          page.clickTab(3);
          expect(page.getTabText(3)).toEqual('債務情報');
      });
    });
    describe('シナリオEL1-5　EV1-4', () => {
      it('EL1-5　EV1-4_7 \n' +
        '  在庫移動伝票情報出力のタブ画面を表示すること', () => {
          page.clickTab(4);
          expect(page.getTabText(4)).toEqual('在庫移動伝票情報');
      });
    });
    describe('シナリオEL1-6　EV1-5', () => {
      it('EL1-6　EV1-5_8 \n' +
        '  取引先情報出力のタブ画面を表示すること', () => {
          page.clickTab(5);
          expect(page.getTabText(5)).toEqual('取引先情報');
      });
    });
    describe('シナリオEL1-7　EV1-6', () => {
      it('EL1-7　EV1-6_9 \n' +
        '  車両管理情報出力のタブ画面を表示すること', () => {
          page.clickTab(6);
          expect(page.getTabText(6)).toEqual('車両管理情報');
      });
    });
    describe('シナリオEL1-8　EV1-7', () => {
      it('EL1-8　EV1-7_10 \n' +
        '  在庫情報出力のタブ画面を表示すること', () => {
          page.clickTab(7);
          expect(page.getTabText(7)).toEqual('在庫情報');
      });
    });
    describe('シナリオEL2-2-1　EV2-1', () => {
      it('EL2-2-1　EV2-1_11 \n' +
        '  対象期間の開始日と終了日は1ヶ月前に設定すること', () => {

          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(1);
          page.clickOneMonthAgoLater(0);

          let today = DateTimeUtils.today();
          let expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -2));
          expect(page.getYearText(0)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
          expect(page.getMonthText(0)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));

          today = DateTimeUtils.today();
          expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -1));
          expect(page.getYearText(1)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
          expect(page.getMonthText(1)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
      });
    });
    describe('シナリオEL2-2-4　EV2-2', () => {
      it('EL2-2-4　EV2-2_12 \n' +
        '  対象期間の開始日と終了日は1ヶ月先に設定すること', () => {

          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(1);
          page.clickOneMonthAgoLater(3);

          let today = DateTimeUtils.today();
          let expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, 0));
          expect(page.getYearText(0)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
          expect(page.getMonthText(0)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));

          today = DateTimeUtils.today();
          expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, 1));
          expect(page.getYearText(1)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
          expect(page.getMonthText(1)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
      });
    });
    describe('シナリオEL2-4', () => {
      it('EL2-4_13 \n' +
        '  詳細条件項目を表示すること', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(1);

          page.openCombox(0);
          page.openCombox(3);
          page.openCombox(4);
          // 詳細条件
          page.clickCondictionDetailButton();
          expect(page.countDetailCondictionOpen()).toEqual(1);
      });
    });
    describe('シナリオEL2-5　EV2-4', () => {
      it('EL2-5　EV2-4_14 \n' +
        '  詳細条件を初期化すること', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(1);

          page.openCombox(0);
          page.openCombox(3);
          page.openCombox(4);

          // 詳細条件
          page.openCombox(5);

          // 締日：3
          page.openCombox(3);
          page.clickSelectButton(5);
          // 出力内容：売掛履歴
          page.openCombox(0);
          page.clickSelectButton(1);

          page.clearInputValue(0);
          page.inputValue(0, '01');
          page.clearInputValue(1);
          page.inputValue(1, '08');
          page.clearInputValue(2);
          page.inputValue(2, '01');
          page.clearInputValue(3);
          page.inputValue(3, '09');

          page.clearInputValue(5);
          page.inputValue(5, '1');
          page.clearInputValue(6);
          page.inputValue(6, '2');
          page.clearInputValue(7);
          page.inputValue(7, '3');
          page.clearInputValue(8);
          page.inputValue(8, '4');

          // 条件取消
          page.getScroll();
          page.clickCondictionDetailCancelButton();

          expect(page.getLabelSelectText(0)).toEqual('請求履歴');

          let today = DateTimeUtils.today();
          let expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -1));
          expect(page.getYearText(0)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
          expect(page.getMonthText(0)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));

          today = DateTimeUtils.today();
          expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, 0));
          expect(page.getYearText(1)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
          expect(page.getMonthText(1)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));

          expect(page.getLabelSelectText(1)).toEqual('末日');
          expect(page.getLabelCompoboxDefaultText(4)).toEqual('全組織');
          expect(page.getLabelCompoboxDefaultText(5)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(6)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(7)).toEqual('');
          expect(page.getLabelCompoboxDefaultText(8)).toEqual('');
          expect(page.getLabelConditionTableBodyTdText(0, 0)).toEqual('請求履歴情報');
      });
    });
    describe('シナリオEL3-1-3　EV2-5', () => {
      it('EL3-1-3　EV2-5_15 \n' +
        '  出力パターン編集モーダル画面を開くこと', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(1);
          page.clickEdit(0);
          browser.wait(protractor.ExpectedConditions.visibilityOf(page.modal));
       　 expect($('modal-container').$('.modal-title').getText()).toEqual('出力パターン編集');
      });
    });
    describe('シナリオEL2-1　EV2-6', () => {
      it('EL2-1　EV2-6_16 \n' +
        '  EL3-1を表示すること', () => {

          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(1);

          page.openCombox(0);
          page.openCombox(3);
          page.openCombox(4);

          // 出力内容：請求履歴
          page.openCombox(0);
          page.clickSelectButton(0);
          expect(page.getLabelConditionTableBodyTdText(0, 0)).toEqual('請求履歴情報');
      });
    });
    describe('シナリオ', () => {
      it('EL2-1　EV2-6_17 \n' +
        '  EL2-2-5(締日)を活性にすること', () => {

          // 締日：3
          page.openCombox(3);
          page.clickSelectButton(5);
          expect(page.getLabelSelectText(1)).toEqual('3');
      });
    });
    describe('シナリオ', () => {
      it('EL2-1　EV2-6_18 \n' +
        '  EL3-2を表示すること', () => {
          // 出力内容：売掛履歴
          page.openCombox(0);
          page.clickSelectButton(1);
          expect(page.getLabelConditionTableBodyTdText(0, 0)).toEqual('売掛履歴情報');
      });
    });
    describe('シナリオ', () => {
      it('EL2-1　EV2-6_19 \n' +
        '  EL2-2-5(締日)を非活性にすること', () => {
          expect(page.getAttributeDisable(3)).toEqual('true');
      });
    });
    describe('シナリオEL4-1　EV3-1', () => {
      it('EL4-1　EV3-1_20 \n' +
        '  ヘルプ画面をモーダル表示すること', () => {
          browser.actions().sendKeys(protractor.Key.F1).perform();
          browser.wait(protractor.ExpectedConditions.visibilityOf(helpPage));
          expect(helpPage.isDisplayed()).toBeTruthy();
          helpPage.element(by.buttonText('閉じる')).click();
      });
    });
    describe('シナリオSFT4-1', () => {
      it('SFT4-1_21 \n' +
        '  押下不可であること', () => {
          expect($$('.function__list.disabled').get(0).getText()).toEqual('F2');
      });
    });
    describe('シナリオSFT4-2', () => {
      it('SFT4-2_22 \n' +
        '  押下不可であること', () => {
          expect($$('.function__list.disabled').get(1).getText()).toEqual('F3');
      });
    });
    describe('シナリオSFT4-3', () => {
      it('SFT4-3_23 \n' +
        '  押下不可であること', () => {
          expect($$('.function__list.disabled').get(2).getText()).toEqual('F4');
      });
    });
    describe('シナリオSFT4-4', () => {
      it('SFT4-4_24 \n' +
        '  押下不可であること', () => {
          expect($$('.function__list.disabled').get(3).getText()).toEqual('F5');
      });
    });
    describe('シナリオEL4-2　EV3-2', () => {
      it('EL4-2　EV3-2_25 \n' +
        '  詳細出力条件パネルを表示すること', () => {
          browser.actions().sendKeys(protractor.Key.F6).perform();
          browser.wait(page.loadingFinished());
          expect(page.countDetailCondictionOpen()).toEqual(1);
      });
    });
    describe('シナリオSFT4-5', () => {
      it('SFT4-5_26 \n' +
        '  押下不可であること', () => {
          expect($$('.function__list.disabled').get(4).getText()).toEqual('F7');
      });
    });
    describe('シナリオSFT4-6', () => {
      it('SFT4-6_27 \n' +
        '  押下不可であること', () => {
          expect($$('.function__list.disabled').get(5).getText()).toEqual('F8');
      });
    });
    describe('シナリオEL4-3', () => {
      it('EL4-3_28 \n' +
        '  押下不可であること', () => {
          expect($$('.function__list.disabled').get(6).getText()).toEqual('F9\nF切替');
      });
    });
    describe('シナリオEL4-4　EV3-3', () => {
      it('EL4-4　EV3-3_29 \n' +
        '  トップメニューに遷移すること', () => {
          browser.actions().sendKeys(protractor.Key.F10).perform();
          browser.wait(page.loadingFinished());
          expect(browser.getCurrentUrl()).toEqual(topUrl);
      });
    });
    describe('シナリオEL4-5　EV3-4', () => {
      it('EL4-5　EV3-4_30 \n' +
        '  前の画面に遷移すること', () => {
          browser.get('/');
          const beforeUrl = browser.getCurrentUrl();
          browser.wait(page.loadingFinished());
          page.navigateTo();
          browser.wait(page.loadingFinished());
          browser.actions().sendKeys(protractor.Key.F11).perform();
          browser.wait(page.loadingFinished());
          expect(browser.getCurrentUrl()).toBe(beforeUrl);
      });
    });
    describe('シナリオEL4-6　EV3-5', () => {
      it('EL4-6　EV3-5_31 \n' +
        '  テキスト出力処理を実行すること', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          browser.actions().sendKeys(protractor.Key.F12).perform();
          browser.wait(protractor.ExpectedConditions.visibilityOf($('bl-loading')));
          expect($$('div.message').get(1).getText()).toBe('出力処理中です。\nしばらくお待ちください。');
      });
    });
    describe('シナリオEV2-3', () => {
      it('EV2-3_37 \n' +
        '  メッセージを表示し、処理を終了すること\n' +
        '  メッセージ：対象期間を入力してください。', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(1);

          page.clearInputValue(0);
          page.inputValue(0, '');
          page.clearInputValue(1);
          page.inputValue(1, '');
          page.clearInputValue(2);
          page.inputValue(2, '1');
          page.clearInputValue(3);
          page.inputValue(3, '10');
          browser.actions().sendKeys(protractor.Key.F12).perform();
          browser.wait(protractor.ExpectedConditions.visibilityOf(dialog.dialog));
          expect($('div.message-container').$('div.message').getText()).toBe('対象期間を入力してください。');
          page.clickOk();
      });
    });
    describe('シナリオEV2-3', () => {
      it('EV2-3_39 \n' +
        '  メッセージを表示し、処理を終了すること\n' +
        '  メッセージ：対象期間を入力してください。', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(1);

          page.clearInputValue(0);
          page.inputValue(0, '1');
          page.clearInputValue(1);
          page.inputValue(1, '10');
          page.clearInputValue(2);
          page.inputValue(2, '');
          page.clearInputValue(3);
          page.inputValue(3, '');
          page.getEleInput(3).sendKeys(protractor.Key.TAB);
          browser.actions().sendKeys(protractor.Key.F12).perform();
          browser.wait(protractor.ExpectedConditions.visibilityOf(dialog.dialog));
          expect($('div.message-container').$('div.message').getText()).toBe('対象期間を入力してください。');
          page.clickOk();
      });
    });
    describe('シナリオEV2-3', () => {
      it('EV2-3_41 \n' +
        '  メッセージを表示し、処理を終了すること\n' +
        '  メッセージ：対象期間が不正です。入力内容を確認してください。', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(1);

          page.clearInputValue(0);
          page.inputValue(0, '01');
          page.clearInputValue(1);
          page.inputValue(1, '11');
          page.clearInputValue(2);

          page.inputValue(2, '01');
          page.clearInputValue(3);
          page.inputValue(3, '10');
          page.getEleInput(3).sendKeys(protractor.Key.TAB);
          expect($('div.message-container').$('div.message').getText()).toBe('対象期間が不正です。入力内容を確認してください。');
          page.clickOk();
      });
    });
    describe('シナリオEV2-3', () => {
      it('EV2-3_43 \n' +
        '  メッセージを表示し、処理を終了すること\n' +
        '  メッセージ：対象期間が不正です。入力内容を確認してください。', () => {
          page.inputValue(0, '01');
          page.clearInputValue(1);
          page.inputValue(1, '10');
          page.clearInputValue(2);
          page.inputValue(2, '01');
          page.clearInputValue(3);
          page.inputValue(3, '10');
          page.clearInputValue(0);

          page.inputValue(0, '01');
          page.clearInputValue(1);
          page.inputValue(1, '11');
          page.getEleInput(1).sendKeys(protractor.Key.TAB);
          expect($('div.message-container').$('div.message').getText()).toBe('対象期間が不正です。入力内容を確認してください。');
          page.clickOk();
      });
    });
    describe('シナリオEV0', () => {
      it('EV0_46 \n' +
        '  顧客車両情報タブで保存したテキスト出力パターン情報をテキスト出力情報タブ区分が 「5:債権情報」で取得すること', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(1);

          page.openCombox(0);
          page.openCombox(3);
          page.openCombox(6);

          // 出力内容：請求履歴
          page.openCombox(0);
          page.clickSelectButton(0);
          expect(page.getLabelSelectText(2)).toEqual('パターン１-１');
          page.openCombox(6);
          expect(page.getChoice(30)).toEqual('パターン１-１');
          expect(page.getChoice(31)).toEqual('パターン１-２');
          page.clickSelectButton(31);
      });
    });
    describe('シナリオEV0', () => {
      it('EV0_48 \n' +
        '  LocalStorageから取得したテキスト出力パターン情報.テキスト出力パターン名称の一覧を設定すること\n' +
        '※テキスト出力パターン情報.テキスト出力情報区分：11（請求履歴情報）', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(1);

          expect(page.getLabelSelectText(2)).toEqual('パターン１-２');
      });
    });
    describe('シナリオEV0', () => {
      it('EV0_49 \n' +
        '  顧客車両情報タブで保存したテキスト出力パターン情報をテキスト出力情報タブ区分が 「5:債権情報」で取得すること', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(1);

          page.openCombox(0);
          page.openCombox(3);
          page.openCombox(6);

          // 出力内容：売掛履歴
          page.openCombox(0);
          page.clickSelectButton(1);
          expect(page.getLabelSelectText(2)).toEqual('パターン２-１');
          page.openCombox(6);
          expect(page.getChoice(30)).toEqual('パターン２-１');
          expect(page.getChoice(31)).toEqual('パターン２-２');
          page.clickSelectButton(31);
      });
    });
    describe('シナリオEV0', () => {
      it('EV0_51 \n' +
        '  LocalStorageから取得したテキスト出力パターン情報.テキスト出力パターン名称の一覧を設定すること\n' +
        '※テキスト出力パターン情報.テキスト出力情報区分：12（売掛履歴情報）', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.clickTab(1);

          // 出力内容：売掛履歴
          page.openCombox(0);
          page.clickSelectButton(1);
          expect(page.getLabelSelectText(2)).toEqual('パターン２-２');
      });
    });
    describe('シナリオEV3-5', () => {
      it('EV3-5_53 \n' +
        '  ダイアログにてエラーメッセージを表示し、以降の処理は行わないこと\n' +
        '  メッセージ「権限が無い為、テキスト出力は行えません」', () => {
          CommonUtils.sendXhr('/role/api/v1/useravailablepermission/change/mock', {
            resultList: ExportCreditTestData.USER_AVAILABLE_PERMISSION1,
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
