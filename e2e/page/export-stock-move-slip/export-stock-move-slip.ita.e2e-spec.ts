import { StockMoveSlip } from './export-stock-move-slip.po';
import { StockMoveSlipDetail } from './export-stock-move-slip-detail.po';
import { $, browser, protractor, $$ } from 'protractor';
import { BlDialog } from './../../page_object/bl-ng-ui-component/bl-dialog.po';
import { ShareFooter } from './../../page_object/ng-share-module/share-footer.po';
import { CommonUtils } from '../common-utils';
import { StockMoveSlipTestData } from './export-stock-move-slip-ita-data';
import { DateTimeUtils } from '@blcloud/bl-common';

describe('export-stock-move-slip', () => {
  let page: StockMoveSlip;
  let modal: StockMoveSlipDetail;
  let dialog: BlDialog;
  let footer: ShareFooter;
  let topUrl: string;
  browser.driver.manage().window().maximize();

  beforeAll(() => {
    page = new StockMoveSlip('export-stock-move-slip');
    modal = new StockMoveSlipDetail($('#exportTabStockMoveSlip'));
    dialog = new BlDialog('.modal-content');
    footer = new ShareFooter($('share-footer'));
    topUrl = browser.baseUrl + '/output';
    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  it('APIレスポンスをITA用のデータに変更\n', () => {

    CommonUtils.sendXhr('/cmnservice/api/v1/loginuseremployeebindmodel/change/mock', {
      resultList: StockMoveSlipTestData.LOGIN_USER_INFO,
      status: 200
    });

    CommonUtils.sendXhr('/output/api/v1/exportpatterninfo/change/mock', {
      resultList: StockMoveSlipTestData.EXPORT_PATTERN_INFO,
      status: 200
    });

    CommonUtils.sendXhr('/license/api/v1/serviceavailabilityinfo/change/mock', {
      resultList: StockMoveSlipTestData.SERVICE_AVAILABILITY_INFO_PARTSMAN,
      status: 200
    });

    CommonUtils.sendXhr('/company/api/v1/organizationinformation/change/mock', {
      resultList: StockMoveSlipTestData.SEARCH_ORGANIZATION_INFORMATION,
      status: 200
    });

    CommonUtils.sendXhr('/role/api/v1/useravailablepermission/change/mock', {
      resultList: StockMoveSlipTestData.USER_AVAILABLE_PERMISSION2,
      status: 200
    });

    CommonUtils.sendXhr('/bizcmn/api/v1/stockmgtsetting/change/mock', {
      resultList: StockMoveSlipTestData.STOCKMGTSETTING_MASTER_INFO1,
      status: 200
    });

    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  describe('シナリオケース(在庫移動伝票情報出力タブ)', () => {
    beforeAll(() => {
      page.clickOpenMenu(4);
    });

    describe('イベントID：EL2-2-1', () => {
      it('EL2-2-1 対象期間 \n' +
         '出荷日付：初期表示 \n' +
         '入荷日付：選択肢 \n' +
         '更新日付：選択肢 \n', () => {
         modal.ClickElement('bl-select', 'targetPeriodstockMoveSlip');
         expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('出荷日付');
         expect(modal.targetPeriodDiv.getChoiceText(1)).toEqual('入荷日付');
         expect(modal.targetPeriodDiv.getChoiceText(2)).toEqual('更新日付');
        });
   });

   describe('イベントID：EV2-3', () => {
    it('EV0-1-4 出庫組織 \n' +
    '全組織：初期表示 \n', () => {
    expect(page.getInputValue(6)).toBe('全組織');
    });
  });

  describe('イベントID：EV2-4', () => {
    it('EV2-4 入庫組織 \n' +
    '全組織：初期表示 \n', () => {
    expect(page.getInputValue(7)).toBe('全組織');
    });
  });

  describe('イベントID：EV2-5', () => {
    it('EV2-5 詳細 \n' +
    '「詳細出力条件パネル」はクローズ状態であること \n', () => {
    expect(modal.isPresent()).toBeTruthy();
    });
  });

  describe('イベントID：EV1-1', () => {
     it('EV1-1 「売上伝票情報」を押下 \n' +
        '売上伝票情報出力のタブ画面が表示されること \n', () => {
         page.clickOpenMenu(0);
         expect(page.getActiveTabText()).toEqual('売上伝票情報');
    });
   });

   describe('イベントID：EV1-2', () => {
    it('EV1-2 「債権情報」を押下 \n' +
        '債権情報出力のタブ画面が表示されること \n', () => {
        page.clickOpenMenu(1);
        expect(page.getActiveTabText()).toEqual('債権情報');
    });
   });

   describe('イベントID：EV1-3', () => {
    it('EV1-3 「仕入伝票情報」を押下 \n' +
        '仕入伝票情報出力のタブ画面が表示されること \n', () => {
        page.clickOpenMenu(2);
        expect(page.getActiveTabText()).toEqual('仕入伝票情報');
    });
   });

   describe('イベントID：EV1-4', () => {
    it('EV1-4 「債務情報」を押下 \n' +
        '債務情報出力のタブ画面が表示されること \n', () => {
        page.clickOpenMenu(3);
        expect(page.getActiveTabText()).toEqual('債務情報');
    });
   });

   describe('イベントID：EV1-6', () => {
    it('EV1-6 「取引先情報」を押下 \n' +
       '取引先情報出力のタブ画面が表示されること \n', () => {
       page.clickOpenMenu(5);
       expect(page.getActiveTabText()).toEqual('取引先情報');
    });
   });

   describe('イベントID：EV1-7', () => {
    it('EV1-7 「車両管理情報」を押下 \n' +
       '車両管理情報出力のタブ画面が表示されること \n', () => {
       page.clickOpenMenu(6);
       expect(page.getActiveTabText()).toEqual('車両管理情報');
    });
   });

   describe('イベントID：EV1-8', () => {
    it('EV1-7-8-1 「在庫情報」を押下 \n' +
       '在庫情報出力のタブ画面が表示されること \n', () => {
       page.clickOpenMenu(7);
       expect(page.getActiveTabText()).toEqual('在庫情報');
    });
  });

  describe('イベントID：EL2-2-1', () => {
    it('EL2-2-1「先月移動ボタン」を押下 \n' +
      '「対象期間(開始日)と「対象期間(終了日)」が表示されている日付の1ヶ月前に設定されること \n', () => {
        page.clickOpenMenu(4);
       modal.clickButton(4);
       const today = DateTimeUtils.today();
       let expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -2));
       expect(modal.getDateValue('bl-date', 0)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
       expect(modal.getDateValue('bl-date', 1)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
       expect(modal.getDateValue('bl-date', 2)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));

       expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -1));
       expect(modal.getDateValue('bl-date', 3)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
       expect(modal.getDateValue('bl-date', 4)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
       expect(modal.getDateValue('bl-date', 5)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));
    });
  });

  describe('イベントID：EL2-2-4', () => {
    it('EL2-2-4「翌月移動ボタン」を押下 \n' +
       '「対象期間(開始日)と「対象期間(終了日)」が表示されている日付の1ヶ月後に設定されること \n', () => {
       page.navigateTo();
       browser.wait(page.loadingFinished());
       modal.clickButton(6);
       const  today = DateTimeUtils.today();
       let expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, 0));
       expect(modal.getDateValue('bl-date', 0)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
       expect(modal.getDateValue('bl-date', 1)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
       expect(modal.getDateValue('bl-date', 2)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));

       expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, 1));
       expect(modal.getDateValue('bl-date', 3)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
       expect(modal.getDateValue('bl-date', 4)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
       expect(modal.getDateValue('bl-date', 5)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));
    });
  });

  describe('イベントID：EL2-4', () => {
    it('EVEL2-4 「詳細条件」を押下 \n' +
       '詳細出力条件パネルを表示すること \n', () => {
        modal.clickButton(9);
        expect(modal.isPresent()).toBeFalsy();
    });
  });

  describe('イベントID：EL2-5', () => {
    it('EVEL2-5 「条件取消」を押下 \n' +
       '出力条件を初期値に戻すこと \n', () => {
        modal.clickButton(10);
        expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('出荷日付');
        expect(page.getInputValue(6)).toBe('全組織');
        expect(page.getInputValue(7)).toBe('全組織');
        expect(modal.isPresent()).toBeTruthy();
    });
  });

  describe('イベントID：EL3-1-3', () => {
    it('EL3-1-3 「出力パターン編集」を押下 \n' +
      　'出力パターン編集モーダル画面が開くこと \n', () => {
     　 modal.clickEdit();
     　 expect($('modal-container').$('.modal-title').getText()).toEqual('出力パターン編集');
        browser.wait(page.loadingFinished());
        dialog.clickCancelDialog();
    });
  });

  describe('イベントID：EL4-1', () => {
    it('EL4-1 「お困りですか？」を押下 \n' +
       'ヘルプ画面（共通部品）がモーダル表示されること \n', () => {
       footer.getF1Button().click();
       expect($('modal-container').$('.modal-title').getText()).toEqual('ヘルプ');
       browser.wait(page.loadingFinished());
       modal.clickDialog('閉じる');
    });
  });

  describe('イベントID：SFT4-1', () => {
    it('SFT4-1 「F2」を押下 \n' +
      　'押下不可であること \n', () => {
        expect($$('.function__list.disabled').get(0).getText()).toEqual('F2');
    });
  });

  describe('イベントID：SFT4-2', () => {
    it('SFT4-2 「F3」を押下 \n' +
      　'押下不可であること \n', () => {
        expect($$('.function__list.disabled').get(1).getText()).toEqual('F3');
    });
  });

  describe('イベントID：SFT4-3', () => {
    it('SFT4-3 「F4」を押下 \n' +
      　'押下不可であること \n', () => {
        expect($$('.function__list.disabled').get(2).getText()).toEqual('F4');
    });
  });

  describe('イベントID：SFT4-4', () => {
    it('SFT4-4 「F5」を押下 \n' +
      　'押下不可であること \n', () => {
        expect($$('.function__list.disabled').get(3).getText()).toEqual('F5');
    });
  });

  describe('イベントID：EL4-1', () => {
    it('EL4-1 「F6」を押下 \n' +
       '詳細出力条件パネルを表示すること \n', () => {
       footer.getF6Button().click();
       expect(modal.isPresent()).toBeFalsy();
    });
  });

  describe('イベントID：SFT4-5', () => {
    it('SFT4-5 「F7」を押下 \n' +
      　'押下不可であること \n', () => {
        expect($$('.function__list.disabled').get(4).getText()).toEqual('F7');
    });
  });

  describe('イベントID：SFT4-6', () => {
    it('SFT4-6 「F8」を押下 \n' +
      　'押下不可であること \n', () => {
        expect($$('.function__list.disabled').get(5).getText()).toEqual('F8');
    });
  });

  describe('イベントID：EL4-3', () => {
    it('EL4-3 「F9」を押下 \n' +
      　'押下不可であること \n', () => {
        expect($$('.function__list.disabled').get(6).getText()).toEqual('F9\nF切替');
    });
  });

  describe('イベントID：EL4-4', () => {
    it('EL4-4 「F10」を押下 \n' +
       'トップメニューに遷移すること \n', () => {
        footer.getF10Button().click();
        browser.wait(page.loadingFinished());
        expect(browser.getCurrentUrl()).toEqual(topUrl);
    });
  });

  describe('イベントID：EL4-5', () => {
    it('EL4-5 「F11」を押下 \n' +
       '前の画面に遷移すること \n', () => {
        browser.get('/');
        const beforeUrl = browser.getCurrentUrl();
        browser.wait(page.loadingFinished());
        page.navigateTo();
        browser.wait(page.loadingFinished());
        footer.getF11Button().click();
        browser.wait(page.loadingFinished());
        expect(browser.getCurrentUrl()).toBe(beforeUrl);
    });
  });

  describe('イベントID：EL4-6', () => {
    it('EL4-6 「F12」を押下 \n' +
       'テキスト出力処理を実行すること \n', () => {
        page.navigateTo();
        browser.wait(page.loadingFinished());
        footer.getF12Button().click();
        expect($$('div.message').get(1).getText()).toBe('出力処理中です。\nしばらくお待ちください。');

    });
  });

  describe('イベントID：ELEV2-3', () => {
    it('ELEV2-3-43 ~ ELEV2-3-44　メッセージ：「対象期間が不正です。入力内容を確認してください。」が表示されること \n' +
        '前提条件：対象期間(開始)：令和1年11月01日 \n' +
        '前提条件：対象期間(終了)：令和1年10月31日 \n', () => {
        page.navigateTo();
        browser.wait(page.loadingFinished());
        modal.setDateValue('bl-date', 0, '01');
        modal.setDateValue('bl-date', 1, '11');
        modal.setDateValue('bl-date', 2, '01');
        modal.setDateValue('bl-date', 3, '01');
        modal.setDateValue('bl-date', 4, '10');
        modal.setDateValue('bl-date', 5, '31');
        modal.setFocus('bl-date', 0);
        expect(modal.getMessage()).toBe('対象期間が不正です。入力内容を確認してください。');
        dialog.clickSave();
    });

    it('ELEV2-3-45 ~ ELEV2-3-46　メッセージ：「対象期間が不正です。入力内容を確認してください。」が表示されること \n' +
    '前提条件：対象期間(終了)：令和1年10月31日 \n' +
    '前提条件：対象期間(開始)：令和1年11月01日 \n', () => {
      page.navigateTo();
      browser.wait(page.loadingFinished());
      modal.setDateValue('bl-date', 0, '01');
      modal.setDateValue('bl-date', 1, '10');
      modal.setDateValue('bl-date', 2, '30');
      modal.setDateValue('bl-date', 3, '01');
      modal.setDateValue('bl-date', 4, '10');
      modal.setDateValue('bl-date', 5, '31');
      modal.setDateValue('bl-date', 0, '01');
      modal.setDateValue('bl-date', 1, '11');
      modal.setDateValue('bl-date', 2, '01');
      modal.setFocus('bl-date', 5);
      expect(modal.getMessage()).toBe('対象期間が不正です。入力内容を確認してください。');
      dialog.clickSave();
    });
  });

  describe('イベントID：EV0', () => {
    it('EV0-48 画面初期表示 \n' +
       '出力内容」のチェックボックスのラベルが「出荷」「未入荷」「入荷済」であること \n', () => {
        page.navigateTo();
        browser.wait(page.loadingFinished());

        page.navigateTo();
        browser.wait(page.loadingFinished());
        expect(modal.getLabelValue(1)).toEqual('出荷');
        expect(modal.getLabelValue(2)).toEqual('未入荷');
        expect(modal.getLabelValue(3)).toEqual('入荷済');
    });

    it('EV0-54 画面初期表示 \n' +
       '「出力内容」のチェックボックスのラベルが「出庫」「入庫」であること \n', () => {
        page.navigateTo();
        browser.wait(page.loadingFinished());

        CommonUtils.sendXhr('/bizcmn/api/v1/stockmgtsetting/change/mock', {
          resultList: StockMoveSlipTestData.STOCKMGTSETTING_MASTER_INFO2,
          status: 200
        });
        page.navigateTo();
        browser.wait(page.loadingFinished());
        expect(modal.getLabelValue(1)).toEqual('出庫');
        expect(modal.getLabelValue(2)).toEqual('入庫');
    });
  });

  describe('イベントID：EV3-5', () => {
    it('EV3-5-57 「F12」を押下 \n' +
       'メッセージ「権限が無い為、テキスト出力は行えません」', () => {
        page.navigateTo();
        browser.wait(page.loadingFinished());
        CommonUtils.sendXhr('/role/api/v1/useravailablepermission/change/mock', {
          resultList: StockMoveSlipTestData.USER_AVAILABLE_PERMISSION1,
          status: 200
        });

        page.navigateTo();
        browser.wait(page.loadingFinished());
        footer.getF12Button().click();
        browser.wait(protractor.ExpectedConditions.visibilityOf(dialog.dialog));
        expect(modal.getMessage()).toBe('権限が無い為、テキスト出力は行えません');

    });
  });

 });
});
