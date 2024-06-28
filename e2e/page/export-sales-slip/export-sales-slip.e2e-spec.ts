import { $, browser, by, ElementFinder, protractor } from 'protractor';
import { CommonUtils } from '../common-utils';
import { ExportSalesSlip } from './export-sales-slip.po';
import { ExportSalesSlipTestData } from './export-sales-slip.test-data';
import { BlDialog } from '../../page_object/bl-ng-ui-component/bl-dialog.po';
import { DateTimeUtils } from '@blcloud/bl-common';

describe('export-sales-slip', () => {
  let page: ExportSalesSlip;
  let helpPage: ElementFinder;
  let topUrl: string;
  let dialog: BlDialog;

  browser.driver.manage().window().maximize();

  beforeAll(() => {
    page = new ExportSalesSlip('output');
    helpPage = $('.modal-content');
    topUrl = browser.baseUrl + '/output';
    dialog = new BlDialog('bl-dialog');
    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  it('モックの返却値をテストデータに変更', () => {
    CommonUtils.sendXhr('/cmnservice/api/v1/loginuseremployeebindmodel/change/mock', {
      resultList: ExportSalesSlipTestData.LOGIN_USER_INFO2,
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
    CommonUtils.sendXhr('/role/api/v1/useravailablepermission/change/mock', {
      resultList: ExportSalesSlipTestData.USER_AVAILABLE_PERMISSION,
      status: 200
    });
    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  describe('シナリオケース', () => {

    describe('EV0', () => {
      it('シナリオEV0_1-1 \n' +
        '・項目「出力内容」の活性状態が以下の通りとなること\n' +
        '　※別紙（パターン）■EL2-1出力内容', () => {
        expect(page.checkBox(0).isSelected()).toBeTruthy();
        expect(page.checkBox(1).isSelected()).toBeTruthy();
        expect(page.checkBox(2).isSelected()).toBeTruthy();
        expect(page.checkBox(3).isSelected()).toBeTruthy();
        expect(page.checkBox(4).isSelected()).toBeFalsy();
      });
    });

    describe('EV0', () => {
      it('シナリオEV0_1-2 \n' +
        '・EL2-2「対象期間」の選択肢と初期値が以下の通りとなること \n' +
        '　※別紙（パターン）■EL2-2対象期間', () => {
          expect(page.getLabelSelectText(0)).toEqual('伝票日付');
          page.openSelect(0);
          expect(page.getChoice(0)).toEqual('伝票日付');
          expect(page.getChoice(1)).toEqual('更新日付');
          expect(page.getChoice(2)).toEqual('請求締日');
      });
    });

    describe('EV0', () => {
      it('シナリオEV0_1-3 \n' +
        '・EL2-3「出力タイプ」の選択肢と初期値が以下の通りとなること \n' +
        '　※別紙（パターン）■EL2-3出力タイプ', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          expect(page.getLabelSelectText(1)).toEqual('伝票タイプ');
          page.openSelect(1);
          expect(page.getChoice(0)).toEqual('伝票タイプ');
          expect(page.getChoice(1)).toEqual('伝票明細タイプ');
      });
    });

    describe('EV0', () => {
      it('シナリオEV0_1-4 \n' +
        '・EL2-4「組織」の選択肢と初期値が以下の通りとなること \n' +
        '　※別紙（パターン）■EL2-4組織', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.openOrganizationComboBox();
          expect(page.getChoiceText(0)).toEqual('全組織');
          expect(page.getChoiceText(1)).toEqual('本社');
          expect(page.getChoiceText(2)).toEqual('組織１');
          expect(page.getChoiceText(3)).toEqual('組織２');
          expect(page.getChoiceText(4)).toEqual('組織３');
      });
      it('モックの返却値をテストデータに変更', () => {
        CommonUtils.sendXhr('/cmnservice/api/v1/loginuseremployeebindmodel/change/mock', {
          resultList: ExportSalesSlipTestData.LOGIN_USER_INFO1,
          status: 200
        });
        page.navigateTo();
        browser.wait(page.loadingFinished());
        expect(page.getInputValue(6)).toBe('全組織');
      });
    });

    describe('EV0', () => {

      it('モックの返却値をテストデータに変更', () => {
        CommonUtils.sendXhr('/cmnservice/api/v1/loginuseremployeebindmodel/change/mock', {
          resultList: ExportSalesSlipTestData.LOGIN_USER_INFO2,
          status: 200
        });
      });
      it('シナリオEV0_1-5 \n' +
        '・EL2-5-2「組織選択」の選択肢と初期値が以下の通りとなること \n' +
        '　※別紙（パターン）■EL2-5-2組織選択', () => {
        page.navigateTo();
        browser.wait(page.loadingFinished());
        page.openSelect(1);
        page.clickSelectButton(1);
        page.clickCondictionDetailButton();

        expect(page.getLabelSelectText(2)).toEqual('売上組織');
        page.openSelect(2);
        expect(page.getLabelSelectOrgText(1, 0)).toEqual('売上組織');
        expect(page.getLabelSelectOrgText(1, 1)).toEqual('請求組織');
      });
    });

    describe('EV0', () => {
      it('シナリオEV0_1-6 \n' +
        '・EL2-5-3「得意先選択」の選択肢と初期値が以下の通りとなること \n' +
        '　※別紙（パターン）■EL2-5-3得意先選択', () => {

        page.navigateTo();
        browser.wait(page.loadingFinished());
        page.openSelect(1);
        page.clickSelectButton(1);
        page.clickCondictionDetailButton();

        expect(page.getLabelSelectText(3)).toEqual('得意先');
        page.openSelect(3);
        expect(page.getLabelSelectOrgText(1, 0)).toEqual('得意先');
        expect(page.getLabelSelectOrgText(1, 1)).toEqual('請求先');
      });
    });

    describe('EV0', () => {
      it('シナリオEV0_1-7 \n' +
        '・EL2-2-3「対象期間(開始日)」にはシステム日付の1か月前が表示されていること', () => {
          const today = DateTimeUtils.today();
          const expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -1));
          expect(page.getYearText(0)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
          expect(page.getMonthText(0)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
          expect(page.getDayText(0)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));
      });
    });

    describe('EV0', () => {
      it('シナリオEV0_1-8 \n' +
        '・EL2-2-4「対象期間(終了日)」にはシステム日付が表示されていること', () => {
          const today = DateTimeUtils.today();
          const expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, 0));
          expect(page.getYearText(1)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
          expect(page.getMonthText(1)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
          expect(page.getDayText(1)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));
      });
    });

    describe('EV0', () => {
      it('シナリオEV0_1-9 \n' +
        '・EL3-1-1「出力情報１」欄に以下値が表示されていること \n' +
        '　「売上伝票情報」', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          expect(page.getLabelConditionTableBodyTdText(0, 0)).toEqual('売上伝票情報');
      });
    });

    describe('EV0', () => {
      it('シナリオEV0_1-10 \n' +
        '・EL3-1-2「出力パターン１」欄に以下値が表示されていること \n' +
        '　「全項目テキスト１」', () => {
        expect(page.getLabelExportPatternText(0)).toEqual('全項目テキスト１');
      });
    });

    describe('EV0', () => {
      it('シナリオEV0_1-11 \n' +
        '・EL2-5「詳細出力条件パネル」はクローズ状態であること', () => {
          expect(page.countDetailCondictionClose()).toEqual(1);
      });
    });

    describe('EV1-1', () => {
      it('シナリオEV1-1_2-1 \n' +
        '・債権情報出力のタブ画面が表示されること', () => {
          page.clickTab(1);
          expect(page.getActiveTabText()).toEqual('債権情報');
      });
    });

    describe('EV1-2', () => {
      it('シナリオEV1-2_3-1 \n' +
        '・仕入伝票情報出力のタブ画面が表示されること', () => {
          page.clickTab(2);
          expect(page.getActiveTabText()).toEqual('仕入伝票情報');

      });
    });

    describe('EV1-3', () => {
      it('シナリオEV1-3_4-1 \n' +
        '・債務情報出力のタブ画面が表示されること', () => {
          page.clickTab(3);
          expect(page.getActiveTabText()).toEqual('債務情報');

      });
    });

    describe('EV1-4', () => {
      it('シナリオEV1-4_5-1 \n' +
        '・在庫移動伝票情報出力のタブ画面が表示されること', () => {
          page.clickTab(4);
          expect(page.getActiveTabText()).toEqual('在庫移動伝票情報');

      });
    });

    describe('EV1-5', () => {
      it('シナリオEV1-5_6-1 \n' +
        '・取引先情報出力のタブ画面が表示されること', () => {
          page.clickTab(5);
          expect(page.getActiveTabText()).toEqual('取引先情報');

      });
    });

    describe('EV1-6', () => {
      it('シナリオEV1-6_7-1 \n' +
        '・車両管理情報出力のタブ画面が表示されること', () => {
          page.clickTab(6);
          expect(page.getActiveTabText()).toEqual('車両管理情報');

      });
    });

    describe('EV1-7', () => {
      it('シナリオEV1-7_8-1 \n' +
        '・在庫情報出力のタブ画面が表示されること', () => {
          page.clickTab(7);
          expect(page.getActiveTabText()).toEqual('在庫情報');
          page.clickTab(0);

      });
    });

    describe('EV2-1', () => {
      it('シナリオEV2-1_9-1 \n' +
        '・EL2-2-4(対象期間(終了日)入力項目)が非表示となること', () => {

          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.openSelect(0);
          page.clickSelectButton(2);
          page.clickCondictionDetailButton();

          expect(page.countDatePickerRigth(0)).toEqual(1);
      });
    });

    describe('EV2-1', () => {
      it('シナリオEV2-1_9-2 \n' +
        '・EL2-5-2(組織選択)は選択不可となり、「請求組織」が設定値となること', () => {
          expect(page.checkBlSelectIsDisabled(2)).toBeTruthy();
      });
    });

    describe('EV2-1', () => {
      it('シナリオEV2-1_9-3 \n' +
        '・EL2-5-3(得意先選択)は選択不可となり、「請求先」が設定値となること', () => {
          expect(page.checkBlSelectIsDisabled(3)).toBeTruthy();

      });
    });

    describe('EV2-1', () => {
      it('シナリオEV2-1_9-4 \n' +
        '・EL2-1(出力内容)は選択不可となり、「入金」のみチェックオン状態となること', () => {
          expect(page.checkBox(0).isEnabled()).toBeFalsy();
          expect(page.checkBox(1).isEnabled()).toBeFalsy();
          expect(page.checkBox(2).isEnabled()).toBeFalsy();
          expect(page.checkBox(3).isEnabled()).toBeFalsy();
          expect(page.checkBox(4).isEnabled()).toBeFalsy();

          expect(page.checkBox(0).isSelected()).toBeFalsy();
          expect(page.checkBox(1).isSelected()).toBeFalsy();
          expect(page.checkBox(2).isSelected()).toBeFalsy();
          expect(page.checkBox(3).isSelected()).toBeFalsy();
          expect(page.checkBox(4).isSelected()).toBeTruthy();

      });
    });

    describe('EV2-1', () => {
      it('シナリオEV2-1_9-5 \n' +
        '・EL2-2-4(対象期間(終了日)入力項目)が表示状態となること', () => {

          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.openSelect(0);
          page.clickSelectButton(1);
          page.clickCondictionDetailButton();

          expect(page.countDatePickerRigth(0)).toEqual(2);
      });
    });

    describe('EV2-1', () => {
      it('シナリオEV2-1_9-6 \n' +
        '・EL2-5-2(組織選択)は選択可となり、選択肢と初期値が以下の通りとなること \n' +
        '　※別紙（パターン）■EL2-4組織', () => {

          page.openSelect(2);
          expect(page.getLabelSelectOrgText(1, 0)).toEqual('売上組織');
          expect(page.getLabelSelectOrgText(1, 1)).toEqual('請求組織');
      });
    });

    describe('EV2-1', () => {
      it('シナリオEV2-1_9-7 \n' +
        '・EL2-5-3(得意先選択)は選択可となり、選択肢と初期値が以下の通りとなること \n' +
        '　※別紙（パターン）■EL2-5-3得意先選択', () => {

          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.openSelect(0);
          page.clickSelectButton(1);
          page.clickCondictionDetailButton();

          page.openSelect(3);
          expect(page.getLabelSelectOrgText(1, 0)).toEqual('得意先');
          expect(page.getLabelSelectOrgText(1, 1)).toEqual('請求先');
      });
    });

    describe('EV2-1', () => {
      it('シナリオEV2-1_9-8 \n' +
        '・EL2-1(出力内容)は選択可となり、活性状態と選択値が以下の通りとなること \n' +
        '　※別紙（パターン）■EL2-1出力内容', () => {
          expect(page.checkBox(0).isEnabled()).toBeTruthy();
          expect(page.checkBox(1).isEnabled()).toBeTruthy();
          expect(page.checkBox(2).isEnabled()).toBeTruthy();
          expect(page.checkBox(3).isEnabled()).toBeTruthy();
          expect(page.checkBox(4).isEnabled()).toBeFalsy();

          expect(page.checkBox(0).isSelected()).toBeTruthy();
          expect(page.checkBox(1).isSelected()).toBeTruthy();
          expect(page.checkBox(2).isSelected()).toBeTruthy();
          expect(page.checkBox(3).isSelected()).toBeTruthy();
          expect(page.checkBox(4).isSelected()).toBeFalsy();

      });
    });

    describe('EV2-2', () => {
      it('シナリオEV2-2_10-1 \n' +
        '・EL2-2-3「対象期間(開始日)とEL2-2-4「対象期間(終了日)」が表示されている日付の1ヶ月前に設定されること', () => {
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

    describe('EV2-3', () => {
      it('シナリオEV2-3_11-1 \n' +
        '・EL2-2-3「対象期間(開始日)とEL2-2-4「対象期間(終了日)」が表示されている日付の1ヶ月後に設定されること', () => {

          page.navigateTo();
          browser.wait(page.loadingFinished());

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

    describe('EV2-4', () => {
      it('シナリオEV2-4_12-1 \n' +
        '・下記メッセージを表示し、処理を終了すること \n' +
        '　メッセージ：対象期間が不正です。入力内容を確認してください。', () => {

          page.navigateTo();
          browser.wait(page.loadingFinished());

          page.clearInputValue(0);
          page.inputValue(0, '01');
          page.clearInputValue(1);
          page.inputValue(1, '08');
          page.clearInputValue(2);
          page.inputValue(2, '10');
          page.clearInputValue(3);
          page.inputValue(3, '01');
          page.clearInputValue(4);
          page.inputValue(4, '08');
          page.clearInputValue(5);
          page.inputValue(5, '09');
          page.openSelect(0);
          expect($('div.message-container').$('div.message').getText()).toBe('対象期間が不正です。入力内容を確認してください。');
          page.clickOk();
        });
    });

    describe('EV2-4', () => {
      it('シナリオEV2-4_12-2 \n' +
        '・メッセージが表示されずに、処理が終了すること', () => {

          page.navigateTo();
          browser.wait(page.loadingFinished());

          page.clearInputValue(0);
          page.inputValue(0, '01');
          page.clearInputValue(1);
          page.inputValue(1, '08');
          page.clearInputValue(2);
          page.inputValue(2, '10');
          page.clearInputValue(3);
          page.inputValue(3, '01');
          page.clearInputValue(4);
          page.inputValue(4, '08');
          page.clearInputValue(5);
          page.inputValue(5, '10');
          page.openSelect(1);
      });
    });

    describe('EV2-4', () => {
      it('シナリオEV2-4_12-3 \n' +
        '・メッセージが表示されずに、処理が終了すること', () => {

          page.navigateTo();
          browser.wait(page.loadingFinished());

          page.clearInputValue(0);
          page.inputValue(0, '01');
          page.clearInputValue(1);
          page.inputValue(1, '08');
          page.clearInputValue(2);
          page.inputValue(2, '10');
          page.clearInputValue(3);
          page.inputValue(3, '01');
          page.clearInputValue(4);
          page.inputValue(4, '08');
          page.clearInputValue(5);
          page.inputValue(5, '11');
          page.openSelect(1);
      });
    });

    describe('EV2-5', () => {
      it('シナリオEV2-5_13-1 \n' +
        '・項目「出力内容」の活性状態が以下の通りとなること \n' +
        '　※別紙（パターン）■EL2-1出力内容', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          // 対象期間
          page.openSelect(0);
          // 出力タイプ
          page.openSelect(1);
          // 詳細条件
          page.clickCondictionDetailButton();
          // 組織選択
          page.openSelect(2);
          // 得意先選択
          page.openSelect(3);

          // 出力内容
          page.clickCheckBox('salesSlipExportContentLabelSales');
          page.clickCheckBox('salesSlipExportContentLabelEstimate');
          page.clickCheckBox('salesSlipExportContentLabelOrder');
          page.clickCheckBox('salesSlipExportContentLabelLoan');
          // 対象期間
          page.openSelect(0);
          page.clickSelectButton(1);
          // 出力タイプ
          page.openSelect(1);
          page.clickSelectButton(4);
          // 組織選択
          page.openSelect(2);
          page.clickSelectButton(6);

          // 条件取消
          page.getScroll();
          page.clickCondictionDetailCancelButton();

          expect(page.checkBox(0).isEnabled()).toBeTruthy();
          expect(page.checkBox(1).isEnabled()).toBeTruthy();
          expect(page.checkBox(2).isEnabled()).toBeTruthy();
          expect(page.checkBox(3).isEnabled()).toBeTruthy();
          expect(page.checkBox(4).isEnabled()).toBeFalsy();

          expect(page.checkBox(0).isSelected()).toBeTruthy();
          expect(page.checkBox(1).isSelected()).toBeTruthy();
          expect(page.checkBox(2).isSelected()).toBeTruthy();
          expect(page.checkBox(3).isSelected()).toBeTruthy();
          expect(page.checkBox(4).isSelected()).toBeFalsy();
      });
    });

    describe('EV2-5', () => {
      it('シナリオEV2-5_13-2 \n' +
        '・EL2-2「対象期間」の選択肢と初期値が以下の通りとなること \n' +
        '　※別紙（パターン）■EL2-2対象期間', () => {
          expect(page.getLabelSelectText(0)).toEqual('伝票日付');
          // 詳細条件
          page.clickCondictionDetailButton();
          // 対象期間
          page.openSelect(0);

          expect(page.getChoice(0)).toEqual('伝票日付');
          expect(page.getChoice(1)).toEqual('更新日付');
          expect(page.getChoice(2)).toEqual('請求締日');
      });
    });

    describe('EV2-5', () => {
      it('シナリオEV2-5_13-3 \n' +
        '・EL2-3「出力タイプ」の選択肢と初期値が以下の通りとなること \n' +
        '　※別紙（パターン）■EL2-3出力タイプ', () => {
          expect(page.getLabelSelectText(1)).toEqual('伝票タイプ');
          page.openSelect(1);
          expect(page.getChoice(3)).toEqual('伝票タイプ');
          expect(page.getChoice(4)).toEqual('伝票明細タイプ');
      });
    });

    describe('EV2-5', () => {
      it('シナリオEV2-5_13-4 \n' +
        '・EL2-4「組織」の選択肢と初期値が以下の通りとなること \n' +
        '　※別紙（パターン）■EL2-4組織', () => {
          page.openOrganizationComboBox();
          expect(page.getChoiceText(5)).toEqual('全組織');
          expect(page.getChoiceText(6)).toEqual('本社');
          expect(page.getChoiceText(7)).toEqual('組織１');
          expect(page.getChoiceText(8)).toEqual('組織２');
          expect(page.getChoiceText(9)).toEqual('組織３');

      });
    });

    describe('EV2-5', () => {
      it('シナリオEV2-5_13-7 \n' +
        '・EL2-2-3「対象期間(開始日)」にはシステム日付の1か月前が表示されていること', () => {
          const today = DateTimeUtils.today();
          const expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -1));
          expect(page.getYearText(0)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
          expect(page.getMonthText(0)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
          expect(page.getDayText(0)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));

      });
    });

    describe('EV2-5', () => {
      it('シナリオEV2-5_13-8 \n' +
        '・EL2-2-4「対象期間(終了日)」にはシステム日付が表示されていること', () => {
          const today = DateTimeUtils.today();
          const expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, 0));
          expect(page.getYearText(1)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
          expect(page.getMonthText(1)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
          expect(page.getDayText(1)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));
      });
    });

    describe('EV2-5', () => {
      it('シナリオEV2-5_13-5 \n' +
        '・EL2-5-2「組織選択」の選択肢と初期値が以下の通りとなること \n' +
        '　※別紙（パターン）■EL2-5-2組織選択', () => {

          page.navigateTo();
          browser.wait(page.loadingFinished());
          // 対象期間
          page.openSelect(0);
          // 出力タイプ
          page.openSelect(1);
          // 詳細条件
          page.clickCondictionDetailButton();
          // 組織選択
          page.openSelect(2);
          // 得意先選択
          page.openSelect(3);

          // 組織選択
          page.openSelect(2);
          page.clickSelectButton(6);
          // 得意先選択
          page.openSelect(3);
          page.clickSelectButton(8);

          // 条件取消
          page.getScroll();
          page.clickCondictionDetailCancelButton();

          expect(page.getLabelSelectText(2)).toEqual('売上組織');
          page.openSelect(2);
          expect(page.getLabelSelectOrgText(2, 0)).toEqual('売上組織');
          expect(page.getLabelSelectOrgText(2, 1)).toEqual('請求組織');
      });
    });

    describe('EV2-5', () => {
      it('シナリオEV2-5_13-6 \n' +
        '・EL2-5-3「得意先選択」の選択肢と初期値が以下の通りとなること \n' +
        '　※別紙（パターン）■EL2-5-3得意先選択', () => {

          expect(page.getLabelSelectText(3)).toEqual('得意先');
          page.openSelect(3);
          expect(page.getLabelSelectOrgText(3, 0)).toEqual('得意先');
          expect(page.getLabelSelectOrgText(3, 1)).toEqual('請求先');
      });
    });

    describe('EV2-5', () => {
      it('シナリオEV2-5_13-9 \n' +
        '・EL3-1-1「出力情報１」欄に以下値が表示されていること \n' +
        '　「売上伝票情報」', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          // 出力タイプ
          page.openSelect(1);
          // 詳細条件
          page.clickCondictionDetailButton();

          // 出力タイプ
          page.openSelect(1);
          page.clickSelectButton(1);

          // 条件取消
          page.getScroll();
          page.clickCondictionDetailCancelButton();
          page.clickCondictionDetailCancelButton();

          expect(page.getLabelConditionTableBodyTdText(0, 0)).toEqual('売上伝票情報');
      });
    });

    describe('EV2-5', () => {
      it('シナリオEV2-5_13-10 \n' +
        '・EL3-1-2「出力パターン１」欄に以下値が表示されていること \n' +
        '　「全項目テキスト1」', () => {
          expect(page.getLabelExportPatternText(0)).toEqual('全項目テキスト１');
      });
    });

    describe('EV2-6', () => {
      it('シナリオEV2-6_14-1 \n' +
        '・出力パターン編集モーダル画面が開くこと', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.openSelect(1);
          page.clickSelectButton(1);
          page.clickCondictionDetailButton();
          page.getScroll();
          page.clickEdit(0);
          browser.wait(page.loadingFinished());
          browser.wait(protractor.ExpectedConditions.visibilityOf(page.modal));

      });
    });

    describe('EV2-7', () => {
      it('シナリオEV2-7_15-1 \n' +
        '・EL3-2「売上伝票詳細情報出力パターン」が表示されること', () => {

          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.openSelect(1);
          page.clickSelectButton(1);
          expect(page.getLabelConditionTableBodyTdText(0, 0)).toEqual('売上伝票詳細情報');

      });
    });

    describe('EV2-7', () => {
      it('シナリオEV2-7_15-2 \n' +
        '・EL3-1「売上伝票情報出力パターン」が表示されること', () => {

          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.openSelect(1);
          page.clickSelectButton(1);
          page.openSelect(1);
          page.clickSelectButton(0);
          expect(page.getLabelConditionTableBodyTdText(0, 0)).toEqual('売上伝票情報');

      });
    });

    describe('EV3-1', () => {
      it('シナリオEV3-1_16-1 \n' +
        '・ヘルプ画面（共通部品）がモーダル表示されること', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          browser.actions().sendKeys(protractor.Key.F1).perform();
          browser.wait(protractor.ExpectedConditions.visibilityOf(helpPage));
          expect(helpPage.isDisplayed()).toBeTruthy();
          helpPage.element(by.buttonText('閉じる')).click();
      });
    });

    describe('EV3-2', () => {
      it('シナリオEV3-2_17-1 \n' +
        '・EL2-5「詳細出力条件パネル」が表示されること', () => {
          browser.actions().sendKeys(protractor.Key.F6).perform();
          browser.wait(page.loadingFinished());
          expect(page.countDetailCondictionOpen()).toEqual(1);
      });
    });

    describe('EV3-3', () => {
      it('シナリオEV3-3_18-1 \n' +
        '・トップメニューに遷移すること', () => {
          browser.actions().sendKeys(protractor.Key.F10).perform();
          browser.wait(page.loadingFinished());
          expect(browser.getCurrentUrl()).toEqual(topUrl);
      });
    });

    describe('EV3-4', () => {
      it('シナリオEV3-4_19-1 \n' +
        '・前の画面に遷移すること', () => {

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

    describe('EV3-5', () => {
      it('シナリオEV3-5_20-1 \n' +
        '・下記メッセージを表示し、処理を終了すること \n' +
        '　メッセージ：出力内容が指定されていません。', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());

          // 出力内容
          page.clickCheckBox('salesSlipExportContentLabelSales');
          page.clickCheckBox('salesSlipExportContentLabelEstimate');
          page.clickCheckBox('salesSlipExportContentLabelOrder');
          page.clickCheckBox('salesSlipExportContentLabelLoan');

          browser.actions().sendKeys(protractor.Key.F12).perform();
          browser.wait(protractor.ExpectedConditions.visibilityOf(dialog.dialog));
          expect($('div.message-container').$('div.message').getText()).toBe('出力内容が指定されていません。');
          page.clickOk();
      });
    });

    describe('EV3-6', () => {
      it('シナリオEV3-6_21-1 \n' +
        '・EL3-1-1「出力情報１」欄に以下値が表示されていること \n' +
        '　「売上伝票情報」 \n' +
        '　※初期表示(EV0-1-1)で取得した値', () => {

          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.openSelect(1);
          page.clickSelectButton(1);
          page.openSelect(1);
          page.clickSelectButton(0);
          expect(page.getLabelConditionTableBodyTdText(0, 0)).toEqual('売上伝票情報');
      });
    });

    describe('EV3-6', () => {
      it('シナリオEV3-6_21-2 \n' +
        '・EL3-1-2「出力パターン１」欄に以下値が表示されていること \n' +
        '　「全項目テキスト１」 \n' +
        '　※初期表示(EV0-1-1)で取得した値', () => {
          expect(page.getLabelExportPatternText(0)).toEqual('全項目テキスト１');

      });
    });

    describe('EV3-6', () => {
      it('シナリオEV3-6_21-3 \n' +
        '・EL3-2-1「出力情報２」欄に以下値が表示されていること \n' +
        '　「売上伝票詳細情報」 \n' +
        '　※初期表示(EV0-1-1)で取得した値', () => {

          page.navigateTo();
          browser.wait(page.loadingFinished());
          page.openSelect(1);
          page.clickSelectButton(1);
          expect(page.getLabelConditionTableBodyTdText(0, 0)).toEqual('売上伝票詳細情報');
      });
    });

    describe('EV3-6', () => {
      it('シナリオEV3-6_21-4 \n' +
        '・EL3-2-2「出力パターン２」欄に以下値が表示されていること \n' +
        '　「全項目テキスト２」 \n' +
        '　※初期表示(EV0-1-1)で取得した値', () => {
          expect(page.getLabelExportPatternText(0)).toEqual('全項目テキスト２');

      });
    });

    describe('EV3-5', () => {
      it('シナリオEV3-5_20-3 \n' +
        '・下記メッセージを表示し、処理を終了すること \n' +
        '　メッセージ：出力パターン情報項目は必須項目です。選択してください。', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          CommonUtils.sendXhr('/output/api/v1/exportpatterninfo/change/mock', {
            resultList: [],
            status: 200
          });
          page.navigateTo();
          browser.wait(page.loadingFinished());
          // 対象期間
          page.openSelect(0);
          // 出力タイプ
          page.openSelect(1);
          // 詳細条件
          page.clickCondictionDetailButton();
          // 組織選択
          page.openSelect(2);
          // 得意先選択
          page.openSelect(3);

          // 対象期間
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
          page.inputValue(5, '31');

          // 担当者コード
          page.clearInputValue(7);
          page.inputValue(7, '100');
          page.clearInputValue(8);
          page.inputValue(8, '101');
          // 得意先コード
          page.clearInputValue(9);
          page.inputValue(9, '1101');
          page.clearInputValue(10);
          page.inputValue(10, '1102');
          // 締日
          page.clearInputValue(11);
          page.inputValue(11, '30');
          browser.actions().sendKeys(protractor.Key.F12).perform();

          browser.wait(protractor.ExpectedConditions.visibilityOf(dialog.dialog));
          expect($('div.message-container').$('div.message').getText()).toBe('出力パターン情報項目は必須項目です。選択してください。');
          page.clickOk();
      });
    });

  });
});
