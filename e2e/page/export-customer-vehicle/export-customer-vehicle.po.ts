import { ElementFinder, browser, $, protractor } from 'protractor';

export class ExportCustomerVehicle {
  page: ElementFinder;

  /**
   * コンストラクタ
   * @param pageName ページ名称
   */
  constructor(protected pageName: string) {
    this.page = $('div.main-app.l-wrapper');
  }

  /**
   * ページのURLに遷移する
   */
  navigateTo(): void {
    browser.get('/' + this.pageName);
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
   * グリッド画面ローディング待ち条件の取得
   */
  gridLoadingFinished() {
    return protractor.ExpectedConditions.invisibilityOf(
      $('div.ag-overlay-wrapper > div.grid-overlay')
    );
  }

  /**
   * タブの数を取得
   */
  getCountTab() {
    return this.page.$('bl-tab-container').$$('.nav-item').count();
  }

  /**
   * タブの名前を取得
   * @param index 選択肢番号
   */
  getTabText(index: number) {
    return this.page.$('bl-tab-container').$$('.nav-item').get(index).getText();
  }

}
