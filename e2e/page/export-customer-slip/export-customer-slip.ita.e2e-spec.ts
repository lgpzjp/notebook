import { CustomerSlip } from './export-customer-slip.po';
import { CustomerSlipDetail } from './export-customer-slip-detail.po';
import { $, browser, protractor, $$ } from 'protractor';
import { BlDialog } from './../../page_object/bl-ng-ui-component/bl-dialog.po';
import { ShareFooter } from './../../page_object/ng-share-module/share-footer.po';
import { CommonUtils } from '../common-utils';
import { CustomerSlipTestData } from './export-customer-slip-ita-data';
import { DateTimeUtils } from '@blcloud/bl-common';

describe('export-customer-slip', () => {
  let page: CustomerSlip;
  let modal: CustomerSlipDetail;
  let dialog: BlDialog;
  let footer: ShareFooter;
  let topUrl: string;
  browser.driver.manage().window().maximize();

  beforeAll(() => {
    page = new CustomerSlip('export-customer-slip');
    modal = new CustomerSlipDetail($('#exportTabCustomerSlip'));
    dialog = new BlDialog('.modal-content');
    footer = new ShareFooter($('share-footer'));
    topUrl = browser.baseUrl + '/output';
    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  it('APIレスポンスをITA用のデータに変更\n', () => {

    CommonUtils.sendXhr('/cmnservice/api/v1/loginuseremployeebindmodel/change/mock', {
      resultList: CustomerSlipTestData.LOGIN_USER_INFO,
      status: 200
    });

    CommonUtils.sendXhr('/output/api/v1/exportpatterninfo/change/mock', {
      resultList: CustomerSlipTestData.EXPORT_PATTERN_INFO,
      status: 200
    });

    CommonUtils.sendXhr('/license/api/v1/serviceavailabilityinfo/change/mock', {
      resultList: CustomerSlipTestData.SERVICE_AVAILABILITY_INFO_PARTSMAN,
      status: 200
    });

    CommonUtils.sendXhr('/company/api/v1/organizationinformation/change/mock', {
      resultList: CustomerSlipTestData.SEARCH_ORGANIZATION_INFORMATION,
      status: 200
    });

    CommonUtils.sendXhr('/role/api/v1/useravailablepermission/change/mock', {
      resultList: CustomerSlipTestData.USER_AVAILABLE_PERMISSION2,
      status: 200
    });

    page.navigateTo();
    browser.wait(page.loadingFinished());
  });

  describe('シナリオケース(取引先情報出力タブ)', () => {
    beforeAll(() => {
      page.clickOpenMenu(5);
    });

    describe('イベントID：EL1-6', () => {
      it('EL1-6-1 取引先情報 \n' +
         '選択状態であること \n', () => {
          expect(page.getActiveTabText()).toEqual('取引先情報');
        });
   });

    describe('イベントID：EL2-1', () => {
      it('EV2-1-2 出力内容 \n' +
         '「得意先」が選択されていること \n', () => {
          expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('得意先');
        });
   });

   describe('イベントID：EL2-3', () => {
    it('EV2-3-2 管理組織 \n' +
       '「全組織」が選択されていること \n', () => {
        expect(page.getInputValue(6)).toBe('全組織');
      });
   });

     describe('イベントID：EV2-5', () => {
       it('EL2-4-4~EL2-4-5 詳細 \n' +
          '活性になっていること \n' +
          '「詳細出力条件パネル」はクローズ状態であること \n', () => {
          expect(modal.isEnabled('button', 8)).toBeTruthy();
          expect(modal.isPresent()).toBeTruthy();
       });
     });

     describe('イベントID：EL3-1-1', () => {
       it('EL3-1-1-6 テキスト出力情報 \n' +
          '「顧客情報」と表示されていること \n', () => {
          expect(modal.exportPatternValue('cell-label', 0)).toEqual('顧客情報');
       });
     });

     describe('イベントID：EL3-1-2', () => {
       it('EL3-1-2-7 出力パターン \n' +
          '「パターン１」と表示されていること \n', () => {
          expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('パターン１');
       });
     });

     describe('イベントID：EL4-1', () => {
       it('EL4-1-8 F1ボタン \n' +
          '活性になっていること \n', () => {
          expect(footer.getF1Button().isEnabled).toBeTruthy();
       });
     });

     describe('イベントID：EL4-2', () => {
       it('EL4-2-9 F6ボタン \n' +
          '活性になっていること \n', () => {
          expect(footer.getF6Button().isEnabled).toBeTruthy();
       });
     });

     describe('イベントID：EL4-3', () => {
       it('EL4-3-10 F9ボタン \n' +
          '非活性になっていること \n', () => {
          expect($$('.function__list.disabled').get(6).getText()).toEqual('F9\nF切替');
       });
     });

     describe('イベントID：EL4-4', () => {
       it('EL4-4-11 F10ボタン \n' +
          '活性になっていること \n', () => {
          expect(footer.getF10Button().isEnabled).toBeTruthy();
       });
     });

     describe('イベントID：EL4-5', () => {
       it('EL4-5-12 F11ボタン \n' +
          '活性になっていること \n', () => {
         expect(footer.getF11Button().isEnabled).toBeTruthy();
       });
     });

     describe('イベントID：EL4-6', () => {
       it('EL4-6-13 F12ボタン \n' +
          '活性になっていること \n', () => {
         expect(footer.getF12Button().isEnabled).toBeTruthy();
       });
     });

     describe('イベントID：EL2-4-3', () => {
       it('EL2-4-3-14 取引有無 \n' +
          '前提条件：出力内容で「得意先」が選択されていること \n' +
          '「全て」が選択されていること \n', () => {
         expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('得意先');
         footer.getF6Button().click();
         expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('全て');
       });
     });

     describe('イベントID：EL2-3', () => {
       it('EL2-3-24 管理組織 \n' +
          '前提条件：出力内容で「仕入先」が選択されていること \n' +
          '「全組織」が選択されていること \n', () => {
           modal.ClickElement('bl-select', 'outputCustomerSlip');
           expect(modal.clickBtn('bl-select', 'outputCustomerSlip', 1));
           expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('仕入先');
           expect(page.getInputValue(6)).toBe('全組織');
       });
     });

     describe('イベントID：EL2-4', () => {
       it('EL2-4-25~EL2-4-26 管理組織 \n' +
          '前提条件：出力内容で「仕入先」を選択 \n' +
          '活性になっていること \n' +
          '「詳細条件がクローズ状態となっていること \n', () => {
           page.navigateTo();
           browser.wait(page.loadingFinished());
           modal.ClickElement('bl-select', 'outputCustomerSlip');
           expect(modal.clickBtn('bl-select', 'outputCustomerSlip', 1));
           expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('仕入先');
           expect(modal.isEnabled('button', 8)).toBeTruthy();
           expect(modal.isPresent()).toBeTruthy();
       });
     });

     describe('イベントID：EL3-2-1', () => {
       it('EL3-2-1-27 テキスト出力情報 \n' +
          '前提条件：出力内容で「仕入先」を選択 \n' +
          '「仕入先情報」を表示されていること \n', () => {
           expect(modal.exportPatternValue('cell-label', 0)).toEqual('仕入先情報');
       });
     });

     describe('イベントID：EL3-2-2', () => {
       it('EL3-2-2-28 出力パターン \n' +
          '前提条件：出力内容で「仕入先」を選択 \n' +
          '「パターン２」を表示されていること \n', () => {
           expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('パターン２');
       });
     });

     describe('イベントID：EL2-3', () => {
       it('EL2-3-39 管理組織 \n' +
          '前提条件：出力内容で「組織」を選択 \n' +
          '「全組織」が選択されていること \n', () => {
           modal.ClickElement('bl-select', 'outputCustomerSlip');
           expect(modal.clickBtn('bl-select', 'outputCustomerSlip', 2));
           expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('組織');
           expect(page.getInputValue(6)).toBe('全組織');
       });
     });

     describe('イベントID：EL2-4', () => {
       it('EL2-4-40 詳細条件ボタン \n' +
          '前提条件：出力内容で「組織」を選択 \n' +
          '非活性になっていること \n', () => {
           expect(modal.isEnabled('button', 11)).toBeFalsy();
       });
     });

     describe('イベントID：EL3-3-1', () => {
       it('EL3-3-1-41 テキスト出力情報 \n' +
          '前提条件：出力内容で「組織」を選択 \n' +
          '「組織情報」を表示されていること \n', () => {
           expect(modal.exportPatternValue('cell-label', 0)).toEqual('組織情報');
       });
     });

     describe('イベントID：EL3-3-2', () => {
       it('EL3-3-2-42 出力パターン \n' +
          '前提条件：出力内容で「組織」を選択 \n' +
          '「パターン３」と表示されていること \n', () => {
           expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('パターン３');
       });
     });

     describe('イベントID：EV1-1', () => {
       it('EL1-1-43 「売上伝票情報」を押下 \n' +
          '売上伝票情報出力のタブ画面が表示されること \n', () => {
           page.clickOpenMenu(0);
           expect(page.getActiveTabText()).toEqual('売上伝票情報');
      });
     });

     describe('イベントID：EV1-2', () => {
       it('EV1-2-44 「債権情報」を押下 \n' +
           '債権情報出力のタブ画面が表示されること \n', () => {
           page.clickOpenMenu(1);
           expect(page.getActiveTabText()).toEqual('債権情報');
       });
      });

      describe('イベントID：EV1-3', () => {
       it('EV1-3-45 「仕入伝票情報」を押下 \n' +
           '仕入伝票情報出力のタブ画面が表示されること \n', () => {
           page.clickOpenMenu(2);
           expect(page.getActiveTabText()).toEqual('仕入伝票情報');
       });
      });

      describe('イベントID：EV1-4', () => {
       it('EV1-4-46 「債務情報」を押下 \n' +
           '債務情報出力のタブ画面が表示されること \n', () => {
           page.clickOpenMenu(3);
           expect(page.getActiveTabText()).toEqual('債務情報');
       });
      });

      describe('イベントID：EV1-5', () => {
        it('EV1-5-47 「在庫移動伝票情報」を押下 \n' +
            '在庫移動伝票情報出力のタブ画面が表示されること \n', () => {
            page.clickOpenMenu(4);
            expect(page.getActiveTabText()).toEqual('在庫移動伝票情報');
        });
       });

       describe('イベントID：EV1-6', () => {
        it('EV1-6-48 「取引先情報」を押下 \n' +
            '取引先情報出力のタブ画面が表示されること \n', () => {
            page.clickOpenMenu(5);
            expect(page.getActiveTabText()).toEqual('取引先情報');
        });
       });

       describe('イベントID：EV1-7', () => {
         it('EV1-7-49 「車両管理情報」を押下 \n' +
            '車両管理情報出力のタブ画面が表示されること \n', () => {
            page.clickOpenMenu(6);
            expect(page.getActiveTabText()).toEqual('車両管理情報');
         });
        });

        describe('イベントID：EV1-8', () => {
         it('EV1-8-50 「在庫情報」を押下 \n' +
            '在庫情報出力のタブ画面が表示されること \n', () => {
            page.clickOpenMenu(7);
            expect(page.getActiveTabText()).toEqual('在庫情報');
         });
       });

       describe('イベントID：EL2-2-1', () => {
         it('EL2-2-1-51「先月移動ボタン」を押下 \n' +
           '「対象期間(開始日)と「対象期間(終了日)」が表示されている日付の1ヶ月前に設定されること \n', () => {
           page.clickOpenMenu(5);
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
         it('EL2-2-4-52「翌月移動ボタン」を押下 \n' +
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

       describe('イベントID：EL3-1-3', () => {
         it('EL3-1-3-54 「出力パターン編集」を押下 \n' +
             '前提条件：出力内容で「得意先」を選択 \n' +
           　'出力パターン編集モーダル画面が開くこと \n', () => {
             expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('得意先');
          　 modal.clickEdit();
          　 expect($('modal-container').$('.modal-title').getText()).toEqual('出力パターン編集');
             browser.wait(page.loadingFinished());
             dialog.clickCancelDialog();
         });
       });

       describe('イベントID：EL3-2-3', () => {
         it('EL3-2-3-55 「出力パターン編集」を押下 \n' +
             '前提条件：出力内容で「仕入先」を選択 \n' +
           　'出力パターン編集モーダル画面が開くこと \n', () => {
             modal.ClickElement('bl-select', 'outputCustomerSlip');
             expect(modal.clickBtn('bl-select', 'outputCustomerSlip', 1));
             expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('仕入先');
          　 modal.clickEdit();
          　 expect($('modal-container').$('.modal-title').getText()).toEqual('出力パターン編集');
             browser.wait(page.loadingFinished());
             dialog.clickCancelDialog();
         });
       });

       describe('イベントID：EL3-3-3', () => {
         it('EL3-3-3-56 「出力パターン編集」を押下 \n' +
             '前提条件：出力内容で「組織」を選択 \n' +
           　'出力パターン編集モーダル画面が開くこと \n', () => {
             modal.ClickElement('bl-select', 'outputCustomerSlip');
             expect(modal.clickBtn('bl-select', 'outputCustomerSlip', 2));
             expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('組織');
          　 modal.clickEdit();
          　 expect($('modal-container').$('.modal-title').getText()).toEqual('出力パターン編集');
             browser.wait(page.loadingFinished());
             dialog.clickCancelDialog();
         });
       });

       describe('イベントID：EL2-4-4-2', () => {
         it('EL2-4-4-2-57　詳細画面に「先月移動ボタン」を押下 \n' +
         　 '前提条件：出力内容「得意先」を選択 \n' +
            '前提条件：取引有無「全て」以外 \n' +
            '「対象期間(開始日)と「対象期間(終了日)」が表示されている日付の1ヶ月前に設定されること \n', () => {
            modal.ClickElement('bl-select', 'outputCustomerSlip');
            expect(modal.clickBtn('bl-select', 'outputCustomerSlip', 0));
            expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('得意先');
            footer.getF6Button().click();
            modal.ClickElement('bl-select', 'billingDiv');
            expect(modal.clickBtn('bl-select', 'billingDiv', 2));
            expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('伝票あり');
            modal.clickButton(17);
            const today = DateTimeUtils.today();
            let expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -2));
            expect(modal.getDateValue('bl-date', 6)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
            expect(modal.getDateValue('bl-date', 7)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
            expect(modal.getDateValue('bl-date', 8)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));

            expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -1));
            expect(modal.getDateValue('bl-date', 9)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
            expect(modal.getDateValue('bl-date', 10)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
            expect(modal.getDateValue('bl-date', 11)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));
         });
       });

       describe('イベントID：EL2-4-4-5', () => {
         it('EL2-4-4-5 詳細画面に「翌月移動ボタン」を押下 \n' +
            '前提条件：出力内容「得意先」を選択 \n' +
            '前提条件：取引有無「全て」以外 \n' +
            '「対象期間(開始日)と「対象期間(終了日)」が表示されている日付の1ヶ月後に設定されること \n', () => {
            page.navigateTo();
            browser.wait(page.loadingFinished());
            modal.ClickElement('bl-select', 'outputCustomerSlip');
            expect(modal.clickBtn('bl-select', 'outputCustomerSlip', 0));
            expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('得意先');
            footer.getF6Button().click();
            modal.ClickElement('bl-select', 'billingDiv');
            expect(modal.clickBtn('bl-select', 'billingDiv', 2));
            expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('伝票あり');
            modal.clickButton(22);
            const  today = DateTimeUtils.today();
            let expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, 0));
            expect(modal.getDateValue('bl-date', 6)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
            expect(modal.getDateValue('bl-date', 7)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
            expect(modal.getDateValue('bl-date', 8)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));

            expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, 1));
            expect(modal.getDateValue('bl-date', 9)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
            expect(modal.getDateValue('bl-date', 10)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
            expect(modal.getDateValue('bl-date', 11)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));
         });
       });

       describe('イベントID：EL2-5', () => {
         it('EVEL2-5-59 「条件取消」を押下 \n' +
            '出力条件を初期値に戻すこと \n', () => {
             modal.clickButton(23);
             expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('得意先');
             expect(page.getInputValue(6)).toBe('全組織');
             expect(modal.isPresent()).toBeTruthy();
         });
       });

       describe('イベントID：EL2-4-8-2', () => {
         it('EL2-4-8-2-60　詳細画面に「先月移動ボタン」を押下 \n' +
         　 '前提条件：出力内容「仕入先」を選択 \n' +
            '前提条件：取引有無「全て」以外 \n' +
            '「対象期間(開始日)と「対象期間(終了日)」が表示されている日付の1ヶ月前に設定されること \n', () => {
            page.navigateTo();
            browser.wait(page.loadingFinished());
            modal.ClickElement('bl-select', 'outputCustomerSlip');
            expect(modal.clickBtn('bl-select', 'outputCustomerSlip', 1));
            expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('仕入先');
            footer.getF6Button().click();
            modal.ClickElement('bl-select', 'supplierDiv');
            expect(modal.clickBtn('bl-select', 'supplierDiv', 2));
            expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('伝票あり');
            modal.clickButton(17);
            const today = DateTimeUtils.today();
            let expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -2));
            expect(modal.getDateValue('bl-date', 6)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
            expect(modal.getDateValue('bl-date', 7)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
            expect(modal.getDateValue('bl-date', 8)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));

            expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -1));
            expect(modal.getDateValue('bl-date', 9)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
            expect(modal.getDateValue('bl-date', 10)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
            expect(modal.getDateValue('bl-date', 11)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));
         });
       });

       describe('イベントID：EL2-4-8-5', () => {
         it('EL2-4-8-5-61 詳細画面に「翌月移動ボタン」を押下 \n' +
            '前提条件：出力内容「仕入先」を選択 \n' +
            '前提条件：取引有無「全て」以外 \n' +
            '「対象期間(開始日)と「対象期間(終了日)」が表示されている日付の1ヶ月後に設定されること \n', () => {
            page.navigateTo();
            browser.wait(page.loadingFinished());
            modal.ClickElement('bl-select', 'outputCustomerSlip');
            expect(modal.clickBtn('bl-select', 'outputCustomerSlip', 1));
            expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('仕入先');
            footer.getF6Button().click();
            modal.ClickElement('bl-select', 'supplierDiv');
            expect(modal.clickBtn('bl-select', 'supplierDiv', 2));
            expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('伝票あり');
            modal.clickButton(22);
            const  today = DateTimeUtils.today();
            let expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, 0));
            expect(modal.getDateValue('bl-date', 6)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
            expect(modal.getDateValue('bl-date', 7)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
            expect(modal.getDateValue('bl-date', 8)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));

            expectYmd = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, 1));
            expect(modal.getDateValue('bl-date', 9)).toEqual(('00' + (Number(expectYmd.slice(0, 4)) - 2018)).slice( -2 ));
            expect(modal.getDateValue('bl-date', 10)).toEqual(('00' + (expectYmd.slice(5, 7))).slice( -2 ));
            expect(modal.getDateValue('bl-date', 11)).toEqual(('00' + (expectYmd.slice(8, 10))).slice( -2 ));
         });
       });

       describe('イベントID：EL2-5', () => {
         it('EVEL2-5-62 「条件取消」を押下 \n' +
            '出力条件を初期値に戻すこと \n', () => {
             modal.clickButton(23);
             expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('得意先');
             expect(page.getInputValue(6)).toBe('全組織');
             expect(modal.isPresent()).toBeTruthy();
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

       describe('イベントID：ELEV2-3', () => {
         it('ELEV2-3-82 ~ ELEV2-3-83　メッセージ：「対象期間が不正です。入力内容を確認してください。」が表示されること \n' +
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

       describe('イベントID：EV2-11', () => {
         it('EV2-11-84~EV2-11-86 出力内容 \n' +
            '前提条件：出力内容「得意先」を選択 \n' +
            '出力情報１に「顧客情報」を表示すること \n' +
            '出力パターン１に「パターン１」を表示すること \n', () => {
             expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('得意先');
             expect(modal.exportPatternValue('cell-label', 0)).toEqual('顧客情報');
             expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('パターン１');
         });

         it('EV2-11-87~EV2-11-89 出力内容 \n' +
            '前提条件：出力内容「仕入先」を選択 \n' +
            '出力情報１に「仕入先情報」を表示すること \n' +
            '出力パターン１に「パターン２」を表示すること \n', () => {
             modal.ClickElement('bl-select', 'outputCustomerSlip');
             expect(modal.clickBtn('bl-select', 'outputCustomerSlip', 1));
             expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('仕入先');
             expect(modal.exportPatternValue('cell-label', 0)).toEqual('仕入先情報');
             expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('パターン２');
         });

         it('EV2-11-90~EV2-11-92 出力内容 \n' +
            '前提条件：出力内容「組織」を選択 \n' +
            '出力情報１に「組織情報」を表示すること \n' +
            '出力パターン１に「パターン２」を表示すること \n', () => {
             modal.ClickElement('bl-select', 'outputCustomerSlip');
             expect(modal.clickBtn('bl-select', 'outputCustomerSlip', 2));
             expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('組織');
             expect(modal.exportPatternValue('cell-label', 0)).toEqual('組織情報');
             expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('パターン３');
         });
       });

       describe('イベントID：EV2-4', () => {
         it('EV2-4-93~EV2-4-96 取引有無 \n' +
            '前提条件：出力内容で「得意先」が選択されていること \n' +
            '前提条件：取引有無が「全て」以外 \n' +
            '操作内容：取引有無を「全て」に変更 \n' +
            'EL2-4-4-2「先月移動ボタン」が非活性となること \n' +
            'EL2-4-4-5「翌月移動ボタン」が非活性となること \n' +
            'EL2-4-4-3「対象期間(開始日)」が非活性となること \n' +
            'EL2-4-4-4「対象期間(終了日)」を表示し、非活性とすること \n', () => {
             page.navigateTo();
             browser.wait(page.loadingFinished());
             expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('得意先');
             footer.getF6Button().click();
             modal.ClickElement('bl-select', 'billingDiv');
             expect(modal.clickBtn('bl-select', 'billingDiv', 1));
             expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('請求あり');
             modal.ClickElement('bl-select', 'billingDiv');
             expect(modal.clickBtn('bl-select', 'billingDiv', 0));
             expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('全て');
             expect(modal.isEnabled('button', 13)).toBeFalsy();
             expect(modal.isEnabled('button', 18)).toBeFalsy();
             expect(modal.isEnabledDate('bl-date', 6)).toBeFalsy();
             expect(modal.isEnabledDate('bl-date', 7)).toBeFalsy();
             expect(modal.isEnabledDate('bl-date', 8)).toBeFalsy();
             expect(modal.isEnabledDate('bl-date', 9)).toBeFalsy();
             expect(modal.isEnabledDate('bl-date', 10)).toBeFalsy();
             expect(modal.isEnabledDate('bl-date', 11)).toBeFalsy();
         });

         it('EV2-4-97~EV2-4-101 取引有無 \n' +
            '前提条件：出力内容で「得意先」が選択されていること \n' +
            '前提条件：取引有無が「請求あり」以外 \n' +
            '操作内容：取引有無を「請求あり」に変更 \n' +
            'EL2-4-4-1「対象期間項目」を「請求締日」に変更こと \n' +
            'EL2-4-4-2「先月移動ボタン」が活性となること \n' +
            'EL2-4-4-5「翌月移動ボタン」が活性となること \n' +
            'EL2-4-4-3「対象期間(開始日)」が活性となること \n' +
            'EL2-4-4-4「対象期間(終了日)」が非表示になること \n', () => {
             page.navigateTo();
             browser.wait(page.loadingFinished());
             expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('得意先');
             footer.getF6Button().click();
             modal.ClickElement('bl-select', 'billingDiv');
             expect(modal.clickBtn('bl-select', 'billingDiv', 1));
             expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('請求あり');
             expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('請求締日');
             expect(modal.isEnabled('button', 14)).toBeTruthy();
             expect(modal.isEnabled('button', 17)).toBeTruthy();
             expect(modal.isEnabledDate('bl-date', 6)).toBeTruthy();
             expect(modal.isEnabledDate('bl-date', 7)).toBeTruthy();
             expect(modal.isEnabledDate('bl-date', 8)).toBeTruthy();
             expect(modal.isPresentDate('bl-date', 9)).toBeFalsy();
             expect(modal.isPresentDate('bl-date', 10)).toBeFalsy();
             expect(modal.isPresentDate('bl-date', 11)).toBeFalsy();
         });

         it('EV2-4-102~EV2-4-106 取引有無 \n' +
            '前提条件：出力内容で「得意先」が選択されていること \n' +
            '前提条件：取引有無が「伝票あり」以外 \n' +
            '操作内容：取引有無を「伝票あり」に変更 \n' +
            'EL2-4-4-1「対象期間項目」を「伝票日付」に変更すること \n' +
            'EL2-4-4-2「先月移動ボタン」を活性にすること \n' +
            'EL2-4-4-5「翌月移動ボタン」を活性にすること \n' +
            'EL2-4-4-3「対象期間(開始日)」を活性にすること \n' +
            'EL2-4-4-4「対象期間(終了日)」を活性にすること \n', () => {
             page.navigateTo();
             browser.wait(page.loadingFinished());
             expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('得意先');
             footer.getF6Button().click();
             modal.ClickElement('bl-select', 'billingDiv');
             expect(modal.clickBtn('bl-select', 'billingDiv', 2));
             expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('伝票あり');
             expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('伝票日付');
             expect(modal.isEnabled('button', 14)).toBeTruthy();
             expect(modal.isEnabled('button', 19)).toBeTruthy();
             expect(modal.isEnabledDate('bl-date', 6)).toBeTruthy();
             expect(modal.isEnabledDate('bl-date', 7)).toBeTruthy();
             expect(modal.isEnabledDate('bl-date', 8)).toBeTruthy();
             expect(modal.isEnabledDate('bl-date', 9)).toBeTruthy();
             expect(modal.isEnabledDate('bl-date', 10)).toBeTruthy();
             expect(modal.isEnabledDate('bl-date', 11)).toBeTruthy();
         });

       });

       describe('イベントID：EV2-5', () => {
         it('EV2-4-107~EV2-4-110 取引有無 \n' +
            '前提条件：出力内容で「仕入先」が選択されていること \n' +
            '前提条件：取引有無が「全て」以外 \n' +
            '操作内容：取引有無を「全て」に変更 \n' +
            'EL2-4-4-2「先月移動ボタン」が非活性となること \n' +
            'EL2-4-4-5「翌月移動ボタン」が非活性となること \n' +
            'EL2-4-4-3「対象期間(開始日)」が非活性となること \n' +
            'EL2-4-4-4「対象期間(終了日)」を表示し、非活性とすること \n', () => {
             page.navigateTo();
             browser.wait(page.loadingFinished());
             modal.ClickElement('bl-select', 'outputCustomerSlip');
             expect(modal.clickBtn('bl-select', 'outputCustomerSlip', 1));
             expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('仕入先');
             footer.getF6Button().click();
             modal.ClickElement('bl-select', 'supplierDiv');
             expect(modal.clickBtn('bl-select', 'supplierDiv', 1));
             expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('支払あり');
             modal.ClickElement('bl-select', 'supplierDiv');
             expect(modal.clickBtn('bl-select', 'supplierDiv', 0));
             expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('全て');
             expect(modal.isEnabled('button', 16)).toBeFalsy();
             expect(modal.isEnabled('button', 21)).toBeFalsy();
             expect(modal.isEnabledDate('bl-date', 6)).toBeFalsy();
             expect(modal.isEnabledDate('bl-date', 7)).toBeFalsy();
             expect(modal.isEnabledDate('bl-date', 8)).toBeFalsy();
             expect(modal.isEnabledDate('bl-date', 9)).toBeFalsy();
             expect(modal.isEnabledDate('bl-date', 10)).toBeFalsy();
             expect(modal.isEnabledDate('bl-date', 11)).toBeFalsy();
         });

         it('EV2-4-111~EV2-4-115 取引有無 \n' +
            '前提条件：出力内容で「仕入先」が選択されていること \n' +
            '前提条件：取引有無が「支払あり」以外 \n' +
            '操作内容：取引有無を「支払あり」に変更 \n' +
            'EL2-4-4-1「対象期間項目」を「請求締日」に変更こと \n' +
            'EL2-4-4-2「先月移動ボタン」が活性となること \n' +
            'EL2-4-4-5「翌月移動ボタン」が活性となること \n' +
            'EL2-4-4-3「対象期間(開始日)」が活性となること \n' +
            'EL2-4-4-4「対象期間(終了日)」が非表示になること \n', () => {
             page.navigateTo();
             browser.wait(page.loadingFinished());
             modal.ClickElement('bl-select', 'outputCustomerSlip');
             expect(modal.clickBtn('bl-select', 'outputCustomerSlip', 1));
             expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('仕入先');
             footer.getF6Button().click();
             modal.ClickElement('bl-select', 'supplierDiv');
             expect(modal.clickBtn('bl-select', 'supplierDiv', 1));
             expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('支払あり');
             expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('支払締日');
             expect(modal.isEnabled('button', 14)).toBeTruthy();
             expect(modal.isEnabled('button', 17)).toBeTruthy();
             expect(modal.isEnabledDate('bl-date', 6)).toBeTruthy();
             expect(modal.isEnabledDate('bl-date', 7)).toBeTruthy();
             expect(modal.isEnabledDate('bl-date', 8)).toBeTruthy();
             expect(modal.isPresentDate('bl-date', 9)).toBeFalsy();
             expect(modal.isPresentDate('bl-date', 10)).toBeFalsy();
             expect(modal.isPresentDate('bl-date', 11)).toBeFalsy();
         });

         it('EV2-4-116~EV2-4-120 取引有無 \n' +
            '前提条件：出力内容で「仕入先」が選択されていること \n' +
            '前提条件：取引有無が「伝票あり」以外 \n' +
            '操作内容：取引有無を「伝票あり」に変更 \n' +
            'EL2-4-4-1「対象期間項目」を「伝票日付」に変更すること \n' +
            'EL2-4-4-2「先月移動ボタン」を活性にすること \n' +
            'EL2-4-4-5「翌月移動ボタン」を活性にすること \n' +
            'EL2-4-4-3「対象期間(開始日)」を活性にすること \n' +
            'EL2-4-4-4「対象期間(終了日)」を活性にすること \n', () => {
             page.navigateTo();
             browser.wait(page.loadingFinished());
             modal.ClickElement('bl-select', 'outputCustomerSlip');
             expect(modal.clickBtn('bl-select', 'outputCustomerSlip', 1));
             expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('仕入先');
             footer.getF6Button().click();
             modal.ClickElement('bl-select', 'supplierDiv');
             expect(modal.clickBtn('bl-select', 'supplierDiv', 2));
             expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('伝票あり');
             expect(modal.exportPatternValue('bl-select-label', 2)).toEqual('伝票日付');
             expect(modal.isEnabled('button', 17)).toBeTruthy();
             expect(modal.isEnabled('button', 22)).toBeTruthy();
             expect(modal.isEnabledDate('bl-date', 6)).toBeTruthy();
             expect(modal.isEnabledDate('bl-date', 7)).toBeTruthy();
             expect(modal.isEnabledDate('bl-date', 8)).toBeTruthy();
             expect(modal.isEnabledDate('bl-date', 9)).toBeTruthy();
             expect(modal.isEnabledDate('bl-date', 10)).toBeTruthy();
             expect(modal.isEnabledDate('bl-date', 11)).toBeTruthy();
         });

       });

       describe('イベントID：EV2-8', () => {
         it('EV2-8-121~EV2-8-122 詳細画面期間 \n' +
            '前提条件：出力内容「得意先」を選択 \n' +
            '前提条件：取引有無「伝票あり」を選択 \n' +
            '前提条件：対象期間(開始)：令和1年11月01日 \n' +
            '前提条件：対象期間(終了)：令和1年10月31日 \n' +
            'メッセージ：「対象期間が不正です。入力内容を確認してください。」が表示されること \n', () => {
            page.navigateTo();
            browser.wait(page.loadingFinished());
            modal.ClickElement('bl-select', 'outputCustomerSlip');
            expect(modal.clickBtn('bl-select', 'outputCustomerSlip', 0));
            expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('得意先');
            footer.getF6Button().click();
            modal.ClickElement('bl-select', 'billingDiv');
            expect(modal.clickBtn('bl-select', 'billingDiv', 2));
            expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('伝票あり');
            modal.setDateValue('bl-date', 6, '01');
            modal.setDateValue('bl-date', 7, '11');
            modal.setDateValue('bl-date', 8, '01');
            modal.setDateValue('bl-date', 9, '01');
            modal.setDateValue('bl-date', 10, '10');
            modal.setDateValue('bl-date', 11, '31');
            modal.setFocus('bl-date', 6);
            expect(modal.getMessage()).toBe('対象期間が不正です。入力内容を確認してください。');
         });

         it('EV2-8-123~EV2-8-124 詳細画面期間 \n' +
            '前提条件：出力内容「仕入先」を選択 \n' +
            '前提条件：取引有無「伝票あり」を選択 \n' +
            '前提条件：対象期間(開始)：令和1年11月01日 \n' +
            '前提条件：対象期間(終了)：令和1年10月31日 \n' +
            'メッセージ：「対象期間が不正です。入力内容を確認してください。」が表示されること \n', () => {
            page.navigateTo();
            browser.wait(page.loadingFinished());
            modal.ClickElement('bl-select', 'outputCustomerSlip');
            expect(modal.clickBtn('bl-select', 'outputCustomerSlip', 1));
            expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('仕入先');
            footer.getF6Button().click();
            modal.ClickElement('bl-select', 'supplierDiv');
            expect(modal.clickBtn('bl-select', 'supplierDiv', 2));
            expect(modal.exportPatternValue('bl-select-label', 1)).toEqual('伝票あり');
            modal.setDateValue('bl-date', 6, '01');
            modal.setDateValue('bl-date', 7, '10');
            modal.setDateValue('bl-date', 8, '30');
            modal.setDateValue('bl-date', 9, '01');
            modal.setDateValue('bl-date', 10, '10');
            modal.setDateValue('bl-date', 11, '31');
            modal.setDateValue('bl-date', 6, '01');
            modal.setDateValue('bl-date', 7, '11');
            modal.setDateValue('bl-date', 8, '01');
            modal.setFocus('bl-date', 11);
            expect(modal.getMessage()).toBe('対象期間が不正です。入力内容を確認してください。');
            dialog.clickSave();
         });
       });

       describe('イベントID：EV2-9', () => {
         it('EV2-9 「条件取消」を押下 \n' +
            '出力条件を初期値に戻すこと \n', () => {
             modal.clickButton(23);
             expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('得意先');
             expect(page.getInputValue(6)).toBe('全組織');
             expect(modal.isPresent()).toBeTruthy();
         });
       });

       describe('イベントID：EV3-2', () => {
         it('EV3-2-147~EV3-2-148 「お困りですか？」を押下 \n' +
            'ヘルプ画面（共通部品）がモーダル表示されること \n', () => {
            footer.getF1Button().click();
            expect($('modal-container').$('.modal-title').getText()).toEqual('ヘルプ');
            browser.wait(page.loadingFinished());
            modal.clickDialog('閉じる');
         });
       });

      describe('イベントID：EV3-2', () => {
        it('EV3-2-147~EV3-2-150 「F6」を押下 \n' +
           '詳細出力条件パネルを表示すること \n', () => {
           page.navigateTo();
           browser.wait(page.loadingFinished());
           expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('得意先');
           footer.getF6Button().click();
           expect(modal.isPresent()).toBeFalsy();
        });

        it('EV3-2-147~EV3-2-150 「F6」を押下 \n' +
           '詳細出力条件パネルを表示すること \n', () => {
           page.navigateTo();
           browser.wait(page.loadingFinished());
           modal.ClickElement('bl-select', 'outputCustomerSlip');
           expect(modal.clickBtn('bl-select', 'outputCustomerSlip', 1));
           expect(modal.exportPatternValue('bl-select-label', 0)).toEqual('仕入先');
           footer.getF6Button().click();
           expect(modal.isPresent()).toBeFalsy();
        });
      });

      describe('イベントID：EV3-3', () => {
        it('EV3-3~151~EV3-3~152 「F10」を押下 \n' +
           'トップメニューに遷移すること \n', () => {
            footer.getF10Button().click();
            browser.wait(page.loadingFinished());
            expect(browser.getCurrentUrl()).toEqual(topUrl);
        });
      });

      describe('イベントID：EV3-4', () => {
        it('EV3-4~153~EV3-4~154 「F11」を押下 \n' +
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

      describe('イベントID：EV3-5', () => {
        it('EV3-5-57 「F12」を押下 \n' +
           'メッセージ「権限が無い為、テキスト出力は行えません」', () => {
            page.navigateTo();
            browser.wait(page.loadingFinished());
            CommonUtils.sendXhr('/role/api/v1/useravailablepermission/change/mock', {
              resultList: CustomerSlipTestData.USER_AVAILABLE_PERMISSION1,
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
