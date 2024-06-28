import { PurchaseSlip } from './purchase-slip.po';
import { PurchaseSlipDetail } from './purchase-slip-detail.po';
import { $, browser, protractor } from 'protractor';
import { BlDialog } from './../../page_object/bl-ng-ui-component/bl-dialog.po';
import { ShareFooter } from './../../page_object/ng-share-module/share-footer.po';
import { CommonUtils } from '../common-utils';
import { PurchaseSlipTestData } from './purchase-slip-ita-data';
import { DateTimeUtils } from '@blcloud/bl-common';

describe('purchase-slip', () => {
  let page: PurchaseSlip;
  let modal: PurchaseSlipDetail;
  let dialog: BlDialog;
  let footer: ShareFooter;
  let topUrl: string;
  browser.driver.manage().window().maximize();

  beforeAll(() => {
    page = new PurchaseSlip('export-purchase-slip');
    modal = new PurchaseSlipDetail($('#exportTabPurchaseSlip'));
    dialog = new BlDialog('.modal-content');
    footer = new ShareFooter($('share-footer'));
    topUrl = browser.baseUrl + '/output';
    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  it('APIレスポンスをITA用のデータに変更\n', () => {

    CommonUtils.sendXhr('/cmnservice/api/v1/loginuseremployeebindmodel/change/mock', {
      resultList: PurchaseSlipTestData.LOGIN_USER_INFO,
      status: 200
    });

    CommonUtils.sendXhr('/output/api/v1/exportpatterninfo/change/mock', {
      resultList: PurchaseSlipTestData.EXPORT_PATTERN_INFO,
      status: 200
    });

    CommonUtils.sendXhr('/license/api/v1/serviceavailabilityinfo/change/mock', {
      resultList: PurchaseSlipTestData.SERVICE_AVAILABILITY_INFO_PARTSMAN,
      status: 200
    });

    CommonUtils.sendXhr('/company/api/v1/organizationinformation/change/mock', {
      resultList: PurchaseSlipTestData.SEARCH_ORGANIZATION_INFORMATION,
      status: 200
    });

    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  describe('シナリオケース(仕入情報出力タブ)', () => {
    beforeAll(() => {
      page.clickOpenMenu(2);
    });

    describe('イベントID：EV0-1', () => {
      it('EV0-1-1 出力内容 \n' +
         '仕入：表示/活性 \n' +
         '入荷：表示/活性 \n' +
         '発注：表示/活性 \n' +
         '返品予定：表示/活性 \n' +
         '出金：表示/非活性 \n', () => {
         expect(modal.isEnabled('bl-checkbox', 0)).toBeTruthy();
         expect(modal.isEnabled('bl-checkbox', 1)).toBeTruthy();
         expect(modal.isEnabled('bl-checkbox', 2)).toBeTruthy();
         expect(modal.isEnabled('bl-checkbox', 3)).toBeTruthy();
         expect(modal.isEnabled('bl-checkbox', 4)).toBeFalsy();
        });

      it('EV0-1-2 対象期間 \n' +
         '伝票日付：初期表示 \n' +
         '更新日付：選択肢 \n' +
         '支払締日：選択肢 \n', () => {
         modal.ClickElement('bl-select', 'targetPeriodPurchase');
         expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('伝票日付');
         expect(modal.targetPeriodDiv.getChoiceText(1)).toEqual('更新日付');
         expect(modal.targetPeriodDiv.getChoiceText(2)).toEqual('支払締日');
        });

      it('EV0-1-3 出力タイプ \n' +
        '伝票タイプ：初期表示 \n' +
        '伝票明細タイプ：選択肢 \n', () => {
         modal.ClickElement('bl-select', 'exportInfoTypePurchase');
         expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('伝票タイプ');
         expect(modal.exportInfoTypeDiv.getChoiceText(1)).toEqual('伝票明細タイプ');
       });

      it('EV0-1-4 組織 \n' +
         '全組織：初期表示 \n' +
         '本社：選択肢 \n' +
         '組織１：選択肢 \n' +
         '組織２：選択肢 \n' +
         '組織３：選択肢 \n', () => {
         modal.ClickShareComboBox('share-organization-combo-box', 'organizationPurchase');
         expect(page.getInputValue(6)).toBe('全組織');
         expect(modal.organizationDiv.getChoiceText(0)).toEqual('全組織');
         expect(modal.organizationDiv.getChoiceText(1)).toEqual('本社');
         expect(modal.organizationDiv.getChoiceText(2)).toEqual('組織１');
         expect(modal.organizationDiv.getChoiceText(3)).toEqual('組織２');
         expect(modal.organizationDiv.getChoiceText(4)).toEqual('組織３');
     });

      it('EV0-1-11 詳細 \n' +
         '「詳細出力条件パネル」はクローズ状態であること \n', () => {
         expect(modal.isPresent()).toBeTruthy();
     });

      it('EV0-1-5 組織選択 \n' +
         '仕入組織：初期表示 \n' +
         '支払組織：選択肢 \n', () => {
         modal.ClickElement('button', 'onPanelPurchase');
         modal.ClickElement('bl-select', 'salseOrganizationPurchase');
         expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('仕入組織');
         expect(modal.salseOrganizationDiv.getChoiceText(1)).toEqual('支払組織');
      });

      it('EV0-1-6 仕入先選択 \n' +
         '仕入先：初期表示 \n' +
         '支払先：選択肢 \n', () => {
         modal.ClickElement('bl-select', 'salseSupplierPurchase');
         expect(modal.exportPatternValue('bl-select-label', 3)).toEqual('仕入先');
         expect(modal.salseSupplierDiv.getChoiceText(1)).toEqual('支払先');
      });

      it('EV0-1-7 対象期間 \n' +
         '「対象期間(開始日)」にはシステム日付の1か月前が表示されていること \n', () => {
          const  today = DateTimeUtils.today();
          const  expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -1));
          expect(modal.getDateValue('bl-date', 0)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
          expect(modal.getDateValue('bl-date', 1)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
          expect(modal.getDateValue('bl-date', 2)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));

      });

      it('EV0-1-8 対象期間 \n' +
         '「対象期間(終了日)」にはシステム日付が表示されていること \n', () => {
          const  today = DateTimeUtils.today();
          const  expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, 0));
         expect(modal.getDateValue('bl-date', 3)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
         expect(modal.getDateValue('bl-date', 4)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
         expect(modal.getDateValue('bl-date', 5)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));

      });

      it('EV0-1-9 出力情報 \n' +
         '仕入伝票情報：初期表示 \n', () => {
         expect(modal.exportPatternValue('cell-label', 0)).toEqual('仕入伝票情報');
      });

      it('EV0-1-10 出力パターン \n' +
         '全項目テキスト１：初期表示 \n', () => {
         expect(modal.exportPatternValue('bl-select-label', 4)).toEqual('全項目テキスト１');
      });


   });

   describe('イベントID：EV1-1', () => {
     it('EV1-1-2-1 「売上伝票情報」を押下 \n' +
        '売上伝票情報出力のタブ画面が表示されること \n', () => {
         page.clickOpenMenu(0);
         expect(page.getActiveTabText()).toEqual('売上伝票情報');
    });
   });

   describe('イベントID：EV1-2', () => {
    it('EV1-2-3-1 「債権情報」を押下 \n' +
        '債権情報出力のタブ画面が表示されること \n', () => {
        page.clickOpenMenu(1);
        expect(page.getActiveTabText()).toEqual('債権情報');
    });
   });

   describe('イベントID：EV1-3', () => {
    it('EV1-3-4-1 「債務情報」を押下 \n' +
        '債務情報出力のタブ画面が表示されること \n', () => {
        page.clickOpenMenu(3);
        expect(page.getActiveTabText()).toEqual('債務情報');
    });
   });

   describe('イベントID：EV1-4', () => {
    it('EV1-4-5-1 「在庫移動伝票情報」を押下 \n' +
       '在庫移動伝票情報出力のタブ画面が表示されること \n', () => {
       page.clickOpenMenu(4);
       expect(page.getActiveTabText()).toEqual('在庫移動伝票情報');
    });
   });

   describe('イベントID：EV1-5', () => {
    it('EV1-5-6-1 「取引先情報」を押下 \n' +
       '取引先情報出力のタブ画面が表示されること \n', () => {
       page.clickOpenMenu(5);
       expect(page.getActiveTabText()).toEqual('取引先情報');
    });
   });

   describe('イベントID：EV1-6', () => {
    it('EV1-6-7-1 「車両管理情報」を押下 \n' +
       '車両管理情報出力のタブ画面が表示されること \n', () => {
       page.clickOpenMenu(6);
       expect(page.getActiveTabText()).toEqual('車両管理情報');
    });
   });

   describe('イベントID：EV1-7', () => {
    it('EV1-7-8-1 「在庫情報」を押下 \n' +
       '在庫情報出力のタブ画面が表示されること \n', () => {
       page.clickOpenMenu(7);
       expect(page.getActiveTabText()).toEqual('在庫情報');
    });
  });

  describe('イベントID：EV2-1', () => {
    it('EV2-1-9-1 ~ EV2-1-9-4 \n' +
       '前提条件：「支払締日」を選択時 \n' +
       '(対象期間(終了日)入力項目)が非表示となること \n' +
       '(組織選択)は選択不可となり、「支払組織」が設定値となること \n' +
       '(仕入先選択)は選択不可となり、「支払先」が設定値となること \n' +
       '(出力内容)は選択不可となり、「出金」のみチェックオン状態となること \n', () => {
       page.clickOpenMenu(2);
       modal.ClickElement('bl-select', 'targetPeriodPurchase');
       modal.clickBtn('button.btn.dropdown-item', 2);
       expect(modal.checkboxIsPresent('v-small-item-in-g2')).toBeFalsy();
       expect(modal.checkboxIsPresent('big-item-in-g2_r')).toBeFalsy();
       expect(modal.isEnabled('btn.btn-default.dropdown-toggle', 4)).toBeFalsy();
       expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('支払組織');
       expect(modal.isEnabled('btn.btn-default.dropdown-toggle', 5)).toBeFalsy();
       expect(modal.exportPatternValue('bl-select-label', 3)).toEqual('支払先');
       expect(modal.isEnabled('bl-checkbox', 0)).toBeFalsy();
       expect(modal.isEnabled('bl-checkbox', 1)).toBeFalsy();
       expect(modal.isEnabled('bl-checkbox', 2)).toBeFalsy();
       expect(modal.isEnabled('bl-checkbox', 3)).toBeFalsy();
       expect(modal.isEnabled('bl-checkbox', 4)).toBeFalsy();
       expect(modal.isSelected('bl-checkbox', 0)).toBeFalsy();
       expect(modal.isSelected('bl-checkbox', 1)).toBeFalsy();
       expect(modal.isSelected('bl-checkbox', 2)).toBeFalsy();
       expect(modal.isSelected('bl-checkbox', 3)).toBeFalsy();
       expect(modal.isSelected('bl-checkbox', 4)).toBeTruthy();
    });

    it('EV2-1-9-5 ~ EV2-1-9-8 \n' +
       '前提条件：「支払締日以外」を選択時 \n' +
       '(対象期間(終了日)入力項目)が表示状態となること \n' +
       '(組織選択)は選択可となり、初期状態となること \n' +
       '(仕入先選択)は選択可となり、初期状態となること \n' +
       '(出力内容)は選択可となり、初期状態となること \n', () => {
       modal.ClickElement('bl-select', 'targetPeriodPurchase');
       expect(modal.clickBtn('button.btn.dropdown-item', 0));
       expect(modal.checkboxIsPresent('v-small-item-in-g2')).toBeTruthy();
       expect(modal.checkboxIsPresent('big-item-in-g2_r')).toBeTruthy();
       expect(modal.isEnabled('btn.btn-default.dropdown-toggle', 4)).toBeTruthy();
       expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('仕入組織');
       modal.ClickElement('bl-select', 'salseOrganizationPurchase');
       expect(modal.salseOrganizationDiv.getChoiceText(1)).toEqual('支払組織');
       expect(modal.isEnabled('btn.btn-default.dropdown-toggle', 5)).toBeTruthy();
       expect(modal.exportPatternValue('bl-select-label', 3)).toEqual('仕入先');
       modal.ClickElement('bl-select', 'salseSupplierPurchase');
       expect(modal.salseSupplierDiv.getChoiceText(1)).toEqual('支払先');
       expect(modal.isEnabled('bl-checkbox', 0)).toBeTruthy();
       expect(modal.isEnabled('bl-checkbox', 1)).toBeTruthy();
       expect(modal.isEnabled('bl-checkbox', 2)).toBeTruthy();
       expect(modal.isEnabled('bl-checkbox', 3)).toBeTruthy();
       expect(modal.isEnabled('bl-checkbox', 4)).toBeFalsy();
       expect(modal.isSelected('bl-checkbox', 0)).toBeTruthy();
       expect(modal.isSelected('bl-checkbox', 1)).toBeTruthy();
       expect(modal.isSelected('bl-checkbox', 2)).toBeTruthy();
       expect(modal.isSelected('bl-checkbox', 3)).toBeTruthy();
       expect(modal.isSelected('bl-checkbox', 4)).toBeFalsy();

       modal.ClickElement('bl-select', 'targetPeriodPurchase');
       expect(modal.clickBtn('button.btn.dropdown-item', 1));
       expect(modal.checkboxIsPresent('v-small-item-in-g2')).toBeTruthy();
       expect(modal.checkboxIsPresent('big-item-in-g2_r')).toBeTruthy();
       expect(modal.isEnabled('btn.btn-default.dropdown-toggle', 4)).toBeTruthy();
       expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('仕入組織');
       modal.ClickElement('bl-select', 'salseOrganizationPurchase');
       expect(modal.salseOrganizationDiv.getChoiceText(1)).toEqual('支払組織');
       expect(modal.isEnabled('btn.btn-default.dropdown-toggle', 5)).toBeTruthy();
       expect(modal.exportPatternValue('bl-select-label', 3)).toEqual('仕入先');
       modal.ClickElement('bl-select', 'salseSupplierPurchase');
       expect(modal.salseSupplierDiv.getChoiceText(1)).toEqual('支払先');
       expect(modal.isEnabled('bl-checkbox', 0)).toBeTruthy();
       expect(modal.isEnabled('bl-checkbox', 1)).toBeTruthy();
       expect(modal.isEnabled('bl-checkbox', 2)).toBeTruthy();
       expect(modal.isEnabled('bl-checkbox', 3)).toBeTruthy();
       expect(modal.isEnabled('bl-checkbox', 4)).toBeFalsy();
       expect(modal.isSelected('bl-checkbox', 0)).toBeTruthy();
       expect(modal.isSelected('bl-checkbox', 1)).toBeTruthy();
       expect(modal.isSelected('bl-checkbox', 2)).toBeTruthy();
       expect(modal.isSelected('bl-checkbox', 3)).toBeTruthy();
       expect(modal.isSelected('bl-checkbox', 4)).toBeFalsy();
    });
   });

   describe('イベントID：EV2-2', () => {
    it('EL2-2-2「先月移動ボタン」を押下 \n' +
      '「対象期間(開始日)と「対象期間(終了日)」が表示されている日付の1ヶ月前に設定されること \n', () => {
       modal.clickButton(4);
       const  today = DateTimeUtils.today();
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

  describe('イベントID：EV2-3', () => {
    it('EL2-2-5「翌月移動ボタン」を押下 \n' +
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

  describe('イベントID：EV2-4', () => {
    it('EL2-4-12-5 ~ EL2-4-12-6　メッセージ：「対象期間が不正です。入力内容を確認してください。」が表示されること \n' +
        '前提条件：対象期間(開始)：令和1年8月10日 \n' +
        '前提条件：対象期間(終了)：令和1年8月09日 \n', () => {
        modal.setDateValue('bl-date', 0, '01');
        modal.setDateValue('bl-date', 1, '08');
        modal.setDateValue('bl-date', 2, '10');
        modal.setDateValue('bl-date', 3, '01');
        modal.setDateValue('bl-date', 4, '08');
        modal.setDateValue('bl-date', 5, '09');
        modal.setFocus('bl-date', 0);
        expect(modal.getMessage()).toBe('対象期間が不正です。入力内容を確認してください。');
        dialog.clickSave();
    });

    it('EL2-4-12-7 メッセージが表示されずに、処理が終了すること \n' +
        '前提条件：対象期間(開始)：令和1年8月10日 \n' +
        '前提条件：対象期間(終了)：令和1年8月10日 \n', () => {
      　modal.setDateValue('bl-date', 0, '01');
     　 modal.setDateValue('bl-date', 1, '08');
     　 modal.setDateValue('bl-date', 2, '10');
    　  modal.setDateValue('bl-date', 3, '01');
    　  modal.setDateValue('bl-date', 4, '08');
    　  modal.setDateValue('bl-date', 5, '10');
    　  modal.setFocus('bl-date', 0);
    　  expect(modal.dialogIsPresent('div.modal-dialog.warn-dialog')).toBeFalsy();
    });

    it('EL2-4-12-7 メッセージが表示されずに、処理が終了すること \n' +
        '前提条件：対象期間(開始)：令和1年8月10日 \n' +
        '前提条件：対象期間(終了)：令和1年8月10日 \n', () => {
     　 modal.setDateValue('bl-date', 0, '01');
     　 modal.setDateValue('bl-date', 1, '08');
     　 modal.setDateValue('bl-date', 2, '10');
     　 modal.setDateValue('bl-date', 3, '01');
    　  modal.setDateValue('bl-date', 4, '08');
     　 modal.setDateValue('bl-date', 5, '11');
     　 modal.setFocus('bl-date', 0);
     　 expect(modal.dialogIsPresent('div.modal-dialog.warn-dialog')).toBeFalsy();
    });
  });

  describe('イベントID：EV2-5', () => {
    it('EL2-4-12-1 「条件取消」を押下 \n' +
        ' \n', () => {
         page.navigateTo();
         browser.wait(page.loadingFinished());
         modal.ClickElement('button', 'onPanelPurchase');
         expect(modal.isEnabled('bl-checkbox', 0)).toBeTruthy();
         expect(modal.isEnabled('bl-checkbox', 1)).toBeTruthy();
         expect(modal.isEnabled('bl-checkbox', 2)).toBeTruthy();
         expect(modal.isEnabled('bl-checkbox', 3)).toBeTruthy();
         expect(modal.isEnabled('bl-checkbox', 4)).toBeFalsy();
         expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('伝票日付');
         const  today = DateTimeUtils.today();
         let expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -1));
         expect(modal.getDateValue('bl-date', 0)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
         expect(modal.getDateValue('bl-date', 1)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
         expect(modal.getDateValue('bl-date', 2)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));

         expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, 0));
         expect(modal.getDateValue('bl-date', 3)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
         expect(modal.getDateValue('bl-date', 4)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
         expect(modal.getDateValue('bl-date', 5)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));
    });
  });

  describe('イベントID：EV2-6', () => {
    it('EL2-4-12-1 「出力パターン編集」を押下 \n' +
      　'出力パターン編集モーダル画面が開くこと \n', () => {
     　 modal.clickEdit();
     　 expect($('modal-container').$('.modal-title').getText()).toEqual('出力パターン編集');
    });
  });

  describe('イベントID：EV2-7', () => {
   beforeAll(() => {
      page.navigateTo();
      browser.wait(page.loadingFinished());
    });
    it('EL2-7-15-1 「仕入伝票詳細情報」が表示されること \n' +
      　'前提条件：「出力タイプ」の選択値を「伝票タイプ」から「伝票明細タイプ」に変更 \n', () => {
      　expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('伝票タイプ');
     　 modal.ClickElement('bl-select', 'exportInfoTypePurchase');
     　 modal.clickBtn('button.btn.dropdown-item', 1);
     　 expect(modal.exportPatternValue('cell-label', 0)).toEqual('仕入伝票詳細情報');
    });

    it('EL2-7-15-2 「仕入伝票情報」が表示されること \n' +
       '前提条件：「出力タイプ」の選択値を「伝票明細タイプ」から「伝票タイプ」に変更 \n', () => {
       expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('伝票明細タイプ');
       modal.ClickElement('bl-select', 'exportInfoTypePurchase');
       modal.clickBtn('button.btn.dropdown-item', 0);
       expect(modal.exportPatternValue('cell-label', 0)).toEqual('仕入伝票情報');
    });
  });

  describe('イベントID：EV3-1', () => {
    it('EL3-1-16-1 「お困りですか？」を押下 \n' +
       'ヘルプ画面（共通部品）がモーダル表示されること \n', () => {
       footer.getF1Button().click();
       expect($('modal-container').$('.modal-title').getText()).toEqual('ヘルプ');
       modal.clickDialog('閉じる');
    });
  });

  describe('イベントID：EV3-2', () => {
    it('EL3-2-17-1 「詳細条件」を押下 \n' +
       '「詳細出力条件パネル」が表示されること \n', () => {
       modal.getF6Button().click();
       browser.wait(page.loadingFinished());
       expect(page.countDetailCondictionOpen()).toEqual(1);
    });
  });

  describe('イベントID：EV3-3', () => {
    it('EL3-3-18-1 「トップメニュー」を押下 \n' +
       'トップメニューに遷移すること \n', () => {
        browser.actions().sendKeys(protractor.Key.F10).perform();
        browser.wait(page.loadingFinished());
        expect(browser.getCurrentUrl()).toEqual(topUrl);
    });
  });

  describe('イベントID：EV3-4', () => {
    it('EL3-4-19-1 「戻る」を押下 \n' +
       '前の画面に遷移すること \n', () => {
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

  describe('イベントID：EV3-6', () => {
    it('EL3-6-21-1~EL3-6-21-2 \n' +
       '前提条件：「伝票タイプ」を選択 \n' +
       '「出力情報」欄に「仕入伝票情報」が表示されていること \n' +
       '「出力パターン」欄に「全項目テキスト１」が表示されていること \n', () => {
        modal.ClickElement('bl-select', 'exportInfoTypePurchase');
        modal.clickBtn('button.btn.dropdown-item', 0);
        expect(modal.exportPatternValue('cell-label', 0)).toEqual('仕入伝票情報');
        expect(modal.exportPatternValue('bl-select-label', 4)).toEqual('全項目テキスト１');
    });

    it('EL3-6-21-3~EL3-6-21-4 \n' +
       '前提条件：「伝票明細タイプ」を選択 \n' +
       '「出力情報」欄に「仕入伝票詳細情報」が表示されていること \n' +
       '「出力パターン」欄に「全項目テキスト２」が表示されていること \n', () => {
        modal.ClickElement('bl-select', 'exportInfoTypePurchase');
        modal.clickBtn('button.btn.dropdown-item', 1);
        expect(modal.exportPatternValue('cell-label', 0)).toEqual('仕入伝票詳細情報');
        expect(modal.exportPatternValue('bl-select-label', 4)).toEqual('全項目テキスト２');
    });
  });

  describe('イベントID：EV3-5', () => {
    it('EL3-4-19-1 「出力開始」を押下 \n' +
       '前提条件：「出力内容」を全て未チェック \n' +
       'メッセージ：「出力内容が指定されていません。」が表示されること \n', () => {
        modal.checkbox('bl-checkbox', 0);
        modal.checkbox('bl-checkbox', 1);
        modal.checkbox('bl-checkbox', 2);
        modal.checkbox('bl-checkbox', 3);
        expect(modal.isSelected('bl-checkbox', 0)).toBeFalsy();
        expect(modal.isSelected('bl-checkbox', 1)).toBeFalsy();
        expect(modal.isSelected('bl-checkbox', 2)).toBeFalsy();
        expect(modal.isSelected('bl-checkbox', 3)).toBeFalsy();
        expect(modal.isSelected('bl-checkbox', 4)).toBeFalsy();

        browser.actions().sendKeys(protractor.Key.F12).perform();
        browser.wait(protractor.ExpectedConditions.visibilityOf(dialog.dialog));
        expect(modal.getMessage()).toBe('出力内容が指定されていません。');
        dialog.clickSave();

    });
  });

 });
});
