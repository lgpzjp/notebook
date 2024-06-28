
import { $, ElementFinder, browser } from 'protractor';
import { protractor } from 'protractor/built/ptor';

export class PurchaseSlip {
  page: ElementFinder;
  nameElePage: string;

  /**
  * コンストラクタ
  * @param pageName ページ名称
  */
  constructor(protected pageName: string) {
    this.nameElePage = 'div.main-app.l-wrapper';
    this.page = $(this.nameElePage);
  }

  /**
   * ページのURLに遷移する
   */
  navigateTo(): void {
    browser.get('http://localhost:4200/output');
  }

  /**
   * Menuをクリック
   */
  clickOpenMenu(index: number) {
    this.page.$$('.nav-link').get(index).click();
  }

  /**
  * ローディング待ち条件の取得
  */
  loadingFinished() {
    return protractor.ExpectedConditions.invisibilityOf(
      $('bl-loading > div.bl-loading')
    );
  }

  /**
   * 要素のテキストを取得
   * @param index 要素のインデックス
   * @param nameOfClass クラス名
   */
  getClassContextNameOnPageValue(index: number, nameOfClass: string) {
    return this.page.$$(nameOfClass).get(index).getText();
  }

  /**
   * 要素名フィルタを取得
   * @param index 索引
   */
  getEleInput(index: number) {
    return this.page.$('app-export-purchase-slip').$$('input.form-control').get(index);
  }

  /**
   * 名前フィルタを取得
   * @param index 索引
   */
  getInputValue(index: number) {
    return this.getEleInput(index).getAttribute('value');
  }

  /**
   * 削除ボタンするとき、ポップアップ削除を取得
   */
  getDialog() {
    return $('div.modal-content');
  }

  /**
   * アクティブタブの値を取得
   */
  getActiveTabText() {
    return this.page.$('bl-tab-container').$('.nav-item.tab-greenish.active').getText();
  }

  /**
   * 詳細条件表示チェック
   */
  countDetailCondictionOpen() {
    return this.page.$('app-detail-purchase-slip-condition').$$('div.tab-option.condition.open.opened').count();
  }

}

