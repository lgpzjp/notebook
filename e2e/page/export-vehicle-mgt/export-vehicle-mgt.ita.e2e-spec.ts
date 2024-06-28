import { VehicleMgt } from './export-vehicle-mgt.po';
import { VehicleMgtDetail } from './export-vehicle-mgt-detail.po';
import { $, browser, protractor, $$ } from 'protractor';
import { BlDialog } from './../../page_object/bl-ng-ui-component/bl-dialog.po';
import { ShareFooter } from './../../page_object/ng-share-module/share-footer.po';
import { CommonUtils } from '../common-utils';
import { VehicleMgtTestData } from './export-vehicle-mgt-ita-data';
import { DateTimeUtils } from '@blcloud/bl-common';

describe('export-vehicle-mgt', () => {
  let page: VehicleMgt;
  let modal: VehicleMgtDetail;
  let dialog: BlDialog;
  let footer: ShareFooter;
  let topUrl: string;
  browser.driver.manage().window().maximize();

  beforeAll(() => {
    page = new VehicleMgt('export-vehicle-mgt');
    modal = new VehicleMgtDetail($('#exportTabVehicleMgt'));
    dialog = new BlDialog('.modal-content');
    footer = new ShareFooter($('share-footer'));
    topUrl = browser.baseUrl + '/output';
    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  it('APIレスポンスをITA用のデータに変更\n', () => {

    CommonUtils.sendXhr('/cmnservice/api/v1/loginuseremployeebindmodel/change/mock', {
      resultList: VehicleMgtTestData.LOGIN_USER_INFO,
      status: 200
    });

    CommonUtils.sendXhr('/output/api/v1/exportpatterninfo/change/mock', {
      resultList: VehicleMgtTestData.EXPORT_PATTERN_INFO,
      status: 200
    });

    CommonUtils.sendXhr('/license/api/v1/serviceavailabilityinfo/change/mock', {
      resultList: VehicleMgtTestData.SERVICE_AVAILABILITY_INFO_PARTSMAN,
      status: 200
    });

    CommonUtils.sendXhr('/company/api/v1/organizationinformation/change/mock', {
      resultList: VehicleMgtTestData.SEARCH_ORGANIZATION_INFORMATION,
      status: 200
    });

    CommonUtils.sendXhr('/role/api/v1/useravailablepermission/change/mock', {
      resultList: VehicleMgtTestData.USER_AVAILABLE_PERMISSION2,
      status: 200
    });

    CommonUtils.sendXhr('/role/api/v1/useravailablepermission/change/mock', {
      resultList: VehicleMgtTestData.USER_AVAILABLE_PERMISSION4,
      status: 200
    });

    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  describe('シナリオケース(車両情報出力タブ)', () => {
    beforeAll(() => {
      page.clickOpenMenu(6);
    });

    describe('イベントID：EL2-1', () => {
      it('EL2-1-1 出力内容 \n' +
         '「車両情報」が選択されていること \n', () => {
          modal.ClickElement('bl-select', 'outputVehicleMgt');
          expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('車両情報');
          expect(modal.outputDiv.getChoiceText(1)).toEqual('出荷部品情報');
        });
     });

    describe('イベントID：EL2-2-1', () => {
      it('EL2-2-1-2 対象期間 \n' +
         '「更新日付」が選択されていること \n', () => {
        expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('更新日付');
        expect(modal.isEnabled('button', 3)).toBeFalsy();
        });

      it('EL2-2-1-4 対象期間 \n' +
         '前提条件：「出力内容が「1：出荷部品情報」の場合 \n' +
         '「伝票日付」が選択されていること \n', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          modal.ClickElement('bl-select', 'outputVehicleMgt');
          modal.clickBtn('bl-select', 'outputVehicleMgt', 1);
          expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('伝票日付');
          modal.ClickElement('bl-select', 'targetPeriodVehicleMgt');
          expect(modal.targetPeriodDiv.getChoiceText(1)).toEqual('更新日付');
        });
    });

    describe('イベントID：EL2-3', () => {
      it('EL2-3-5 出力タイプ \n' +
         '前提条件：出力内容が「0：車両情報」の場合 \n' +
         '「車両タイプ」が選択されていること \n', () => {
          modal.ClickElement('bl-select', 'outputVehicleMgt');
          expect(modal.clickBtn('bl-select', 'outputVehicleMgt', 0));
          expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('車両タイプ');
        });

        it('EL2-3-6 出力タイプ \n' +
        '前提条件：出力内容が「1：出荷部品情報」の場合 \n' +
        '「伝票明細タイプ」が選択されていること \n', () => {
         modal.ClickElement('bl-select', 'outputVehicleMgt');
         expect(modal.clickBtn('bl-select', 'outputVehicleMgt', 1));
         expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('伝票明細タイプ');
       });
     });

     describe('イベントID：EL2-4', () => {
      it('EL2-4-7 組織 \n' +
         '「全組織」が選択されていること \n', () => {
          expect(page.getInputValue(6)).toBe('全組織');
        });
     });

     describe('イベントID：EV2-5', () => {
      it('EV2-5-8 詳細 \n' +
      '「詳細出力条件パネル」はクローズ状態であること \n', () => {
      expect(modal.isPresent()).toBeTruthy();
      });
    });

    describe('イベントID：EV2-5-9', () => {
      it('EV2-5-9-9 在庫取寄 \n' +
      '前提条件：出力内容が「1：出荷部品情報」の場合 \n' +
      '「全て」が選択されていること \n', () => {
        modal.ClickElement('bl-select', 'outputVehicleMgt');
        expect(modal.clickBtn('bl-select', 'outputVehicleMgt', 1));
        modal.clickButton(14);
        expect(modal.exportPatternValue('bl-select-label', 3)).toEqual('全て');
      });
    });

    describe('イベントID：EV1-1', () => {
      it('EL1-1-10 「売上伝票情報」を押下 \n' +
         '売上伝票情報出力のタブ画面が表示されること \n', () => {
          page.clickOpenMenu(0);
          expect(page.getActiveTabText()).toEqual('売上伝票情報');
     });
    });

    describe('イベントID：EV1-2', () => {
     it('EV1-2-11 「債権情報」を押下 \n' +
         '債権情報出力のタブ画面が表示されること \n', () => {
         page.clickOpenMenu(1);
         expect(page.getActiveTabText()).toEqual('債権情報');
     });
    });

    describe('イベントID：EV1-3', () => {
     it('EV1-3-12 「仕入伝票情報」を押下 \n' +
         '仕入伝票情報出力のタブ画面が表示されること \n', () => {
         page.clickOpenMenu(2);
         expect(page.getActiveTabText()).toEqual('仕入伝票情報');
     });
    });

    describe('イベントID：EV1-4', () => {
     it('EV1-4-13 「債務情報」を押下 \n' +
         '債務情報出力のタブ画面が表示されること \n', () => {
         page.clickOpenMenu(3);
         expect(page.getActiveTabText()).toEqual('債務情報');
     });
    });

    describe('イベントID：EV1-5', () => {
      it('EV1-5-14 「在庫移動伝票情報」を押下 \n' +
          '在庫移動伝票情報出力のタブ画面が表示されること \n', () => {
          page.clickOpenMenu(4);
          expect(page.getActiveTabText()).toEqual('在庫移動伝票情報');
      });
     });

     describe('イベントID：EV1-6', () => {
      it('EV1-6-15 「取引先情報」を押下 \n' +
          '取引先情報出力のタブ画面が表示されること \n', () => {
          page.clickOpenMenu(5);
          expect(page.getActiveTabText()).toEqual('取引先情報');
      });
     });

     describe('イベントID：EV1-8', () => {
      it('EV1-8-17 「在庫情報」を押下 \n' +
          '在庫情報出力のタブ画面が表示されること \n', () => {
          page.clickOpenMenu(7);
          expect(page.getActiveTabText()).toEqual('在庫情報');
      });
     });

     describe('イベントID：EL2-2-2', () => {
      it('EL2-2-2-18「先月移動ボタン」を押下 \n' +
        '「対象期間(開始日)と「対象期間(終了日)」が表示されている日付の1ヶ月前に設定されること \n', () => {
          page.clickOpenMenu(6);
         modal.clickButton(6);
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

    describe('イベントID：EL2-2-5', () => {
      it('EL2-2-5-19「翌月移動ボタン」を押下 \n' +
         '「対象期間(開始日)と「対象期間(終了日)」が表示されている日付の1ヶ月後に設定されること \n', () => {
         page.navigateTo();
         browser.wait(page.loadingFinished());
         modal.clickButton(7);
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
      it('EVEL2-4-20 「詳細条件」を押下 \n' +
         '詳細出力条件パネルを表示すること \n', () => {
          modal.clickButton(10);
          expect(modal.isPresent()).toBeFalsy();
      });
    });

    describe('イベントID：EL2-6', () => {
      it('EVEL2-6-21 「条件取消」を押下 \n' +
         '出力条件を初期値に戻すこと \n', () => {
          modal.clickButton(11);
          expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('車両情報');
          expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('更新日付');
          expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('車両タイプ');
          expect(page.getInputValue(6)).toBe('全組織');
          expect(modal.isPresent()).toBeTruthy();
      });
    });

    describe('イベントID：EL3-1-3', () => {
      it('EL3-1-3-22 「出力パターン編集」を押下 \n' +
        　'出力パターン編集モーダル画面が開くこと \n', () => {
       　 modal.clickEdit();
       　 expect($('modal-container').$('.modal-title').getText()).toEqual('出力パターン編集');
          browser.wait(page.loadingFinished());
          dialog.clickCancelDialog();
      });
    });

    describe('イベントID：EL2-1', () => {
      it('EL2-1-23~EL2-1-27 出力内容 \n' +
         '前提条件：「0：車両情報」を選択 \n' +
         '出力タイプに「車両タイプ」を表示すること \n' +
         '出力タイプを非活性にすること \n' +
         '組織に「全組織」を表示し、非活性にすること \n', () => {
          expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('車両情報');
          expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('車両タイプ');
          expect(modal.isEnabled('button', 8)).toBeFalsy();
          expect(page.getInputValue(6)).toBe('全組織');
          expect(modal.isEnabled('button', 9)).toBeFalsy();
      });

      it('EL2-1-28~EL2-1-31 出力内容 \n' +
         '前提条件：「1：出荷部品情報」を選択 \n' +
         '対象期間項目「伝票日付」「更新日付」が選択可能であること \n' +
         '出力タイプ「伝票明細タイプ」「部品合計タイプ」が選択可能であること \n' +
         '出力タイプが活性状態であること \n' +
         '組織が活性状態であること \n', () => {
          modal.ClickElement('bl-select', 'outputVehicleMgt');
          expect(modal.clickBtn('bl-select', 'outputVehicleMgt', 1));
          expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('出荷部品情報');
          expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('伝票日付');
          modal.ClickElement('bl-select', 'targetPeriodVehicleMgt');
          expect(modal.targetPeriodDiv.getChoiceText(1)).toEqual('更新日付');
          expect(modal.isEnabled('button', 9)).toBeTruthy();
          modal.ClickElement('bl-select', 'exportInfoVehicleMgt');
          expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('伝票明細タイプ');
          expect(modal.exportInfoTypeDiv.getChoiceText(1)).toEqual('部品合計タイプ');
          expect(modal.isEnabled('button', 10)).toBeTruthy();
      });
    });

    describe('イベントID：EL2-3', () => {
      it('EL2-3-32~EL2-3-33 出力タイプ \n' +
         '前提条件：「0：車両タイプ」を選択 \n' +
         '「出力情報」欄に「車両管理情報」が表示されていること \n' +
         '「出力パターン」欄に「パターン０-１」が表示されていること \n' +
         '前提条件：「1：伝票明細タイプ」を選択 \n' +
         '「出力情報」欄に「出荷部品伝票詳細情報」が表示されていること \n' +
         '「出力パターン」欄に「パターン１-１」が表示されていること \n' +
         '前提条件：「2：出荷部品合計情報」を選択 \n' +
         '「出力情報」欄に「出荷部品合計情報」が表示されていること \n' +
         '「出力パターン」欄に「パターン２-1」が表示されていること \n', () => {
          modal.ClickElement('bl-select', 'outputVehicleMgt');
          expect(modal.clickBtn('bl-select', 'outputVehicleMgt', 0));
          expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('車両タイプ');
          expect(modal.exportPatternValue('cell-label', 0)).toEqual('車両管理情報');
          expect(modal.exportPatternValue('bl-select-label', 3)).toEqual('パターン０-１');
          modal.ClickElement('bl-select', 'outputVehicleMgt');
          expect(modal.clickBtn('bl-select', 'outputVehicleMgt', 1));
          expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('伝票明細タイプ');
          expect(modal.exportPatternValue('cell-label', 0)).toEqual('出荷部品伝票詳細情報');
          expect(modal.exportPatternValue('bl-select-label', 4)).toEqual('パターン１-１');
          modal.ClickElement('bl-select', 'exportInfoVehicleMgt');
          expect(modal.clickBtn('bl-select', 'exportInfoVehicleMgt', 1));
          expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('部品合計タイプ');
          expect(modal.exportPatternValue('cell-label', 0)).toEqual('出荷部品合計情報');
          expect(modal.exportPatternValue('bl-select-label', 4)).toEqual('パターン２-1');
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

    describe('イベントID：EL4-2', () => {
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
          browser.actions().sendKeys(protractor.Key.F12).perform();
          expect($$('div.message').get(1).getText()).toBe('出力処理中です。\nしばらくお待ちください。');

       });
    });

    describe('イベントID：ELEV2-3', () => {
      it('ELEV2-3-51 ~ ELEV2-3-54　メッセージ：「対象期間が不正です。入力内容を確認してください。」が表示されること \n' +
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

      it('ELEV2-3-55 ~ ELEV2-3-58　メッセージ：「対象期間が不正です。入力内容を確認してください。」が表示されること \n' +
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
      it('EV0-60~EV0-64  \n' +
         '出力内容が「0：車両情報」の場合 \n', () => {
          modal.ClickElement('bl-select', 'outputVehicleMgt');
          expect(modal.clickBtn('bl-select', 'outputVehicleMgt', 0));
          expect(modal.exportPatternValue('cell-label', 0)).toEqual('車両管理情報');
          expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('更新日付');
          expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('車両タイプ');
      });

      it('EV0-65~EV0-69  \n' +
         '出力内容が「1：出荷部品情報」の場合 \n' +
         '出力タイプが「1：伝票明細タイプ」の場合 \n', () => {
           modal.ClickElement('bl-select', 'outputVehicleMgt');
           expect(modal.clickBtn('bl-select', 'outputVehicleMgt', 1));
           expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('伝票日付');
           modal.ClickElement('bl-select', 'targetPeriodVehicleMgt');
           expect(modal.targetPeriodDiv.getChoiceText(1)).toEqual('更新日付');
           expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('伝票明細タイプ');
           expect(modal.exportPatternValue('cell-label', 0)).toEqual('出荷部品伝票詳細情報');
      });

      it('EV0-70~EV0-74  \n' +
         '出力内容が「1：出荷部品情報」の場合 \n' +
         '出力タイプが「2:部品合計タイプ」の場合 \n', () => {
           modal.ClickElement('bl-select', 'outputVehicleMgt');
           expect(modal.clickBtn('bl-select', 'outputVehicleMgt', 1));
           expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('伝票日付');
           modal.ClickElement('bl-select', 'targetPeriodVehicleMgt');
           expect(modal.targetPeriodDiv.getChoiceText(1)).toEqual('更新日付');
           modal.ClickElement('bl-select', 'exportInfoVehicleMgt');
           expect(modal.clickBtn('bl-select', 'exportInfoVehicleMgt', 1));
           expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('部品合計タイプ');
           expect(modal.exportPatternValue('cell-label', 0)).toEqual('出荷部品合計情報');
      });

    });

    describe('イベントID：EV3-5', () => {
      it('EV3-5-77 「F12」を押下 \n' +
         'メッセージ「権限が無い為、テキスト出力は行えません」', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          CommonUtils.sendXhr('/role/api/v1/useravailablepermission/change/mock', {
            resultList: VehicleMgtTestData.USER_AVAILABLE_PERMISSION1,
            status: 200
          });

          page.navigateTo();
          browser.wait(page.loadingFinished());
          footer.getF12Button().click();
          browser.wait(protractor.ExpectedConditions.visibilityOf(dialog.dialog));
          expect(modal.getMessage()).toBe('権限が無い為、テキスト出力は行えません');
      });

      it('EV3-5-79 「F12」を押下 \n' +
         'メッセージ「権限が無い為、テキスト出力は行えません」', () => {
          page.navigateTo();
          browser.wait(page.loadingFinished());
          CommonUtils.sendXhr('/role/api/v1/useravailablepermission/change/mock', {
            resultList: VehicleMgtTestData.USER_AVAILABLE_PERMISSION3,
            status: 200
          });

          page.navigateTo();
          browser.wait(page.loadingFinished());
          modal.ClickElement('bl-select', 'outputVehicleMgt');
          expect(modal.clickBtn('bl-select', 'outputVehicleMgt', 1));
          expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('出荷部品情報');
          footer.getF12Button().click();
          browser.wait(protractor.ExpectedConditions.visibilityOf(dialog.dialog));
          expect(modal.getMessage()).toBe('権限が無い為、テキスト出力は行えません');
      });
    });

 });
});
