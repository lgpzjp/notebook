import { ElementFinder, promise, $, by, protractor, browser } from 'protractor';
import { BlTable } from '../bl-ng-ui-component/bl-table.po';

/**
 * 組織ガイド
 */
export class ShareOrganizationGuide {
  ele: ElementFinder;
  table: BlTable;

  /**
   * コンストラクタ
   */
  constructor() {
    this.ele = $('share-organization-guide');
    this.table = new BlTable(this.ele.$('bl-table'));
  }

  /**
   * @return 表示されているかどうか
   */
  isDisplayed(): promise.Promise<boolean> {
    return this.ele.isDisplayed();
  }

  /**
   * 組織選択
   * @param index　選択する行
   */
  selectOrganization(index: number) {
    this.table.getTableRow(index).click();
  }

  /**
   * 組織フィルタ入力
   * @param text フィルタテキスト
   */
  inputOrgCodeFilter(text: string) {
    this.ele.$('input.form-control.ng-valid.ng-touched.ng-dirty').sendKeys(text);
  }

  /**
   * 決定ボタン押下
   * selectOrganization()で行選択したあとでないと押せない
   */
  clickSave() {
    this.ele.element(by.buttonText('決定')).click();
  }

  /**
   * キャンセルボタン押下
   */
  clickCancel() {
    this.ele.element(by.buttonText('キャンセル')).click();
  }

  /**
  * クリック可能まで待機
  * @param element クリック可能まで待機したい対象
  */
  elementClickable(element: ElementFinder) {
    return protractor.ExpectedConditions.elementToBeClickable(element);
  }

  /**
   * ローディング待ち条件の取得
   */
  waitForGuideloading() {
    browser.wait(protractor.ExpectedConditions.invisibilityOf(
      this.ele.$('div.modal-body > bl-modal-loading > div.bl-modal-loading')
    ));
    browser.wait(protractor.ExpectedConditions.invisibilityOf(
      this.ele.$('div.modal-body > div > bl-modal-loading > div.bl-modal-loading')
    ));
  }
}
