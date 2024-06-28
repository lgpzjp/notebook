import { $, browser, by, ElementFinder, protractor } from 'protractor';
import { BlComboBox } from '../../page_object/bl-ng-ui-component/bl-combo-box.po';

export class ExportStock {
  page: ElementFinder;
  comboBox: ElementFinder;
  modal = $('modal-container');

  /** 出力内容 */
  outputInfo: BlComboBox;

  /** 組織 */
  organization: BlComboBox;

  /** 締日 */
  cutoffDay: BlComboBox;

  /**
   * 出力内容を選択しフォーカスアウト
   */
  selectOutputInfo(itemNum: number) {
    this.outputInfo.openComboBox();
    this.outputInfo.selectChoice(itemNum);
  }

  /**
   * 組織を選択しフォーカスアウト
   */
  selectOrganization(itemNum: number) {
    this.organization.openComboBox();
    this.organization.selectChoice(itemNum);
  }

  /**
   * 締日を選択しフォーカスアウト
   */
  selectCutoffDay(itemNum: number) {
    this.cutoffDay.openComboBox();
    this.cutoffDay.selectChoice(itemNum);
  }

  /**
   * コンストラクタ
   * @param pageName ページ名称
   */
  constructor(protected pageName: string) {
    this.page = $('div.main-app.l-wrapper');
    this.outputInfo = new BlComboBox($('app-export-stock').$('bl-combo-box#outputInfo'));
    this.organization = new BlComboBox($('app-export-stock').$('bl-combo-box#organization'));
    this.cutoffDay = new BlComboBox($('app-export-stock').$('bl-combo-box#cutoffDay'));
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
   * タイトル取得
   */
  getTitle() {
    return this.page.$('div.l-main > app-export-page > div.navbar > div.navbar__title > span').getText();
  }

  /**
   * ラベルタイトルの取得
   */
  getLabelTitleText() {
    return this.page.$('app-export-stock').$('div.tab-header').getText();
  }

  /**
   * ラベルチェックボックスの取得
   * @param index 何番目のclassか
   */
  getLabelCheckBoxText(index: number) {
    return this.page.$('app-export-stock').$$('span.checkbox-label').get(index).getText();
  }

  /**
   * ラベルselectの取得
   * @param index 何番目のclassか
   */
  getLabelSelectText(index: number) {
    return this.page.$('app-export-stock').$$('div.bl-select-label').get(index).getText();
  }

  /**
   * セレクト展開
   * @param index セレクトボタン番号
   */
  openSelect(index: number) {
    this.page.$('app-export-stock').$$('div.bl-select-caret').get(index).click();
  }

  /**
   * コンボボックス展開
   * @param index コンボボックス番号
   */
  openCombox(index: number) {
    this.page.$('app-export-stock').$$('span.caret').get(index).click();
  }

  /**
   * コンボボックス展開
   */
  openOrganizationComboBox() {
    this.page.$('app-export-stock').$('share-organization-combo-box').$('span.caret').click();
  }

  /**
   * 選択肢取得
   * @param index セレクトボタン番号
   * @return 選択肢要素
   */
  getChoice(index: number) {
    return this.page.$('app-export-stock').$$('button.dropdown-item').get(index).getText();
  }

  /**
   * ラベルbuttonの取得
   * @param index 何番目のclassか
   */
  getLabelButtonText(index: number) {
    return this.page.$('app-export-stock').$$('div.small-item-in-g2 > button.btn-default').get(index).getText();
  }

  /**
   * ラベルの取得
   * @param index 何番目のclassか
   */
  getLabelText(index: number) {
    return this.page.$('app-export-stock').$$('div.group-1 > label').get(index).getText();
  }

  /**
   * 対象期間ラベルの取得
   */
  getLabelPeriodText() {
    return this.page.$('app-export-stock').$('div.group-2 > label').getText();
  }

  /**
   * ラベル詳細条件の取得
   * @param i 何番目のclassか
   * @param j 何番目のclassか
   */
  getLabelButtonDetailText(i: number, j: number) {
    return this.page.$('app-export-stock').$$('div.big-g-2').get(i).$$('span').get(j).getText();
  }

  /**
   * ラベル条件タイトルの取得
   * @param index 何番目のclassか
   */
  getLabelConditionTableTitleText(index: number) {
    return this.page.$('app-export-stock').$$('div.condition-table-title').get(index).getText();
  }

  /**
   * ラベル条件ボディの取得
   * @param i 何番目のclassか
   * @param j 何番目のclassか
   */
  getLabelConditionTableBodyThText(i: number, j: number) {
    return this.page.$('app-export-stock').$$('div.condition-table-body').get(i).$$('th').get(j).getText();
  }

  /**
   * 出力パターンセレクトの取得
   * @param index 何番目のclassか
   */
  getLabelExportPatternText(index: number) {
    return this.page.$('app-export-stock').$$('div.condition-table-body').get(index).$('div.bl-select-label').getText();
  }

  /**
   * ラベル条件ボディの取得
   * @param i 何番目のclassか
   * @param j 何番目のclassか
   */
  getLabelConditionTableBodyTdText(i: number, j: number) {
    return this.page.$('app-export-stock').$$('div.condition-table-body').get(i).$$('td').get(j).getText();
  }

  /**
   * ラベル編集ボタンの取得
   * @param index 何番目のclassか
   */
  getLabelEditButtonText(index: number) {
    return this.page.$('app-export-stock').$$('button.btn-edit').get(index).getText();
  }

  /**
   * select要素クリックする
   * @return 選択肢要素
   */
  clickSlipDetailButton(index: number) {
    return this.page.$('app-export-stock').$('app-export-stock').$$('button.dropdown-item').get(index).click();
  }

  /**
   * 詳細条件クリックする
   * @return 選択肢要素
   */
  clickCondictionDetailButton() {
    return this.page.$('app-export-stock').$('div.big-g-2').$('span.caret').click();
  }

  /**
   * 名前フィルタをクリア
   * @param index 索引
   */
  clearInputValue(index: number) {
    this.clearElementValue(this.getEleInput(index));
  }

  /**
   * エレメントをクリア
   * @param ele エレメントクリアが必要です
   */
  clearElementValue(ele: ElementFinder) {
    ele.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
    ele.sendKeys(protractor.Key.BACK_SPACE);
  }

  /**
   * 要素名フィルタを取得
   * @param index 索引
   */
  getEleInput(index: number) {
    return this.page.$('app-export-stock').$$('input.form-control').get(index);
  }

  /**
   * 入力値
   * @param index 入力した数字列
   * @param value 入力する文字列
   */
  inputValue(index: number, value: string) {
    this.getEleInput(index).sendKeys(value);
  }

  /**
   * 名前フィルタを取得
   * @param index 索引
   */
  getInputValue(index: number) {
    return this.getEleInput(index).getAttribute('value');
  }

  /**
   * ラベルselectの取得
   * @param i 何番目のclassか
   * @param j 何番目のclassか
   */
  getLabelSelectOrgText(i: number, j: number) {
    return this.page.$('app-export-stock').$$('ul.dropdown-menu').get(i).$$('button.dropdown-item').get(j).getText();
  }

  /**
   * ラベル詳細取消の取得
   * @param index 索引
   */
  getLabelButtonDetailCancelText(index: number) {
    return this.page.$('app-export-stock').$$('div.search-condition-detail-footer-btn > button').get(index).getText();
  }

  /**
   * 要素値を取得
   * @param index 入力した数字列
   * @param nameOfClass クラス名
   */
  getElementValue(index: number, nameOfClass: string) {
    return this.page.$('app-export-stock').$$(nameOfClass).get(index);
  }

  /**
   *
   *チェックボックスを取得
   *@param index 入力した数字列
   */
  checkBox(index: number) {
    return this.getElementValue(index, 'input.bl-checkbox');
  }

  /**
   * 選択肢文言取得
   * @param index 選択肢番号
   * @return 選択肢文言
   */
  getChoiceText(index: number) {
    return this.page.$('app-export-stock').$$('button.dropdown-item').get(index).getText();
  }
  /**
   * タブが選択されるかどうか
   * @param index 選択肢番号
   */
  clickTab(index: number) {
    this.page.$('bl-tab-container').$$('.nav-item').get(index).click();
  }

  /**
   * タブの値を取得
   * @param index 選択肢番号
   */
  getTabText(index: number) {
    return this.page.$('bl-tab-container').$$('.nav-item').get(index).getText();
  }

  /**
   * select要素クリックする
   * @param index 選択肢番号
   * @return 選択肢要素
   */
  clickSelectButton(index: number) {
    return this.page.$('app-export-stock').$$('button.btn.dropdown-item').get(index).click();
  }

  /**
   * アクティブタブの値を取得
   */
  getActiveTabText() {
    return this.page.$('bl-tab-container').$('.nav-item.tab-greenish.active').getText();
  }

  /**
   * デートピッカーの数を取得
   */
  countDatePickerRigth(index: number) {
    return this.page.$('app-export-stock').$$('app-date-picker-condition').get(index).$$('div.bl-date-input-container').count();
  }

  /**
   * 組織選択
   * @param id DOMのid
   */
  getOrganizationSelect(id: string) {
    return this.page.$('.' + id).$('button.btn.btn-default.dropdown-toggle').getAttribute('disabled');
  }

  /**
   * セレクト有効、無効チェック
   * @param index 番号
   */
  checkBlSelectIsDisabled(index: number) {
    return this.page.$('app-export-stock').$$('div.btn-group.bl-select').get(index).getAttribute('ng-reflect-is-disabled');
  }

  /**
   * 詳細条件表示チェック
   */
  countDetailCondictionOpen() {
    return this.page.$('app-detail-stock-condition').$$('div.tab-option.condition.open.opened').count();
  }

  /**
   * 詳細条件非表示チェック
   */
  countDetailCondictionClose() {
    return this.page.$('app-detail-stock-condition').$$('div.tab-option.condition.closed').count();
  }

  /**
   * 編集ボタン押下
   * @param index 番号
   */
  clickEdit(index: number) {
    this.page.$('app-export-stock').$$('button.btn.btn-default.btn-edit').get(index).click();
  }

  /** キャンセルボタン押下 */
  clickCancel() {
    this.modal.element(by.buttonText('キャンセル')).click();
  }

  /**
   * 年の値を取得
   */
  getYearText(index: number) {
    return this.page.$('app-export-stock').$$('input.form-control.bl-text-input.bl-date-input-year').get(index).getAttribute('value');
  }

  /**
   * 月の値を取得
   */
  getMonthText(index: number) {
    return this.page.$('app-export-stock').$$('input.form-control.bl-text-input.bl-date-input-month').get(index).getAttribute('value');
  }

  /**
   * 日の値を取得
   */
  getDayText(index: number) {
    return this.page.$('app-export-stock').$$('input.form-control.bl-text-input.bl-date-input-day').get(index).getAttribute('value');
  }

  /**
   * ＜１ヶ月前、１ヶ月先＞クリック
   * @param index 番号
   */
  clickOneMonthAgoLater(index: number) {
    this.page.$('app-export-stock').$('app-date-picker-condition').$$('button.btn.btn-default').get(index).click();
  }

  /**
   * チェックボックスクリック
   * @param index 番号
   */
  clickCheckBox(id: string) {
    const el = this.page.$('app-export-stock').$('bl-checkbox#' + id);
    el.click(); // 入力値全文選択状態
  }

  /**
   * 条件取消クリック
   */
  clickCondictionDetailCancelButton() {
    this.page.$('app-export-stock').$('div.search-condition-detail-footer-btn').$('button.btn.btn-default').click();
  }

  /** OKボタン押下 */
  clickOk() {
    this.modal.element(by.buttonText('OK')).click();
  }

  scroll(ele: ElementFinder) {
    browser.executeScript('arguments[0].scrollIntoView();', ele.getWebElement());
  }

  /**
   * スクロールバーのスライド
   */
  getScroll() {
    const ele = this.page.$('app-export-stock').$('div.search-condition-detail-footer-btn').$('button.btn.btn-default');
    this.scroll(ele);
  }

  /**
   * ラベルの取得
   * @param i 何番目のclassか
   */
  getLabelCompoboxDefaultText(i: number) {
    return this.page.$('app-export-stock').$$('bl-text-input').get(i).getAttribute('ng-reflect-value');
  }

  /**
   *
   *焦点を合わせる
   */
  focusOut() {
    return this.page.$('app-export-stock').$('div.tab-header').click();
  }

}
