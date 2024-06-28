import { by, $, ElementFinder, promise, $$ } from 'protractor';

export class BlDialog {
  dialog: ElementFinder;
  name: string;
  /**
   * コンストラクタ
   * 例: $('bl-dialog')
   * @param el エレメント指定
   */
  constructor(name: string) {
    this.name = name;
    this.dialog = $(name);
  }

  /**
   * ダイアログメッセージ取得
   * @return ダイアログメッセージ
   */
  getDialogMessage(): promise.Promise<string> {
    return this.dialog.$('.message-container').$('.message').getText();
  }

  /**
   * OKボタン押下
   */
  clickSave() {
    this.dialog.element(by.buttonText('OK')).click();
  }
    /**
   * はいボタン押下
   */
  clickSaveDialog() {
    this.dialog.element(by.buttonText('はい')).click();
  }

  /**
   * キャンセルボタン押下
   */
  clickCancel() {
    this.dialog.element(by.buttonText('キャンセル')).click();
  }

  clickCancelDialog() {
    this.dialog.$$('button.btn.btn-default').get(0).click();
  }

  /**
   * @return 存在しているか
   */
  isPresent(): promise.Promise<boolean> {
    return this.dialog.isPresent();
  }

  /**
   * @return 表示されているか
   */
  isDisplayed(): promise.Promise<boolean> {
    return this.dialog.isDisplayed();
  }

  /**
   * 主管倉庫ガイドの行を押下
   * @param numRow 行クリック必要
   */
  clickRowMaiWhGuide(numRow: number) {
    $$(this.name + ' ' + 'tbody.visible tr').get(numRow).click();
  }

  /**
   * 得意先ガイドの行を押下
   * @param numRow 行クリック必要
   */
  clickRowCusSearch(numRow: number) {
    $$(this.name + ' ' + 'tbody.visible tr').get(numRow).click();
  }

  /**
   * 新しいダイアログを取得
   */
  getDialogNew() {
    return $$('.modal-dialog').get(1);
  }

  /**
   * 新しいダイアログのタイトルを取得
   */

  isPresentDialogNew() {
    return this.getDialogNew().isPresent();
  }

  /**
   * Get title dialog new
   */
  getTitleDialogNew() {
    return $$('.modal-dialog h4.modal-title').get(1).getAttribute('innerText');
  }

  /**
   * 倉庫コードガイドの行を押下
   * @param numRow 行クリック必要
   */
  clickRowWhGuide(numRow: number) {
    $$(this.name + ' ' + 'tbody.visible tr').get(numRow).click();
  }

  /**
   * 管理組織ガイドの行を押下
   * @param numRow 行クリック必要
   */
  clickRowOrgGuide(numRow: number) {
    $$(this.name + ' ' + 'tbody.visible tr').get(numRow).click();
  }

  /**
   * 選択ボタンを押下
   */
  clickDecision() {
    $$(this.name + ' ' + 'button.btn.btn-success').get(1).click();
  }

  /**
   * クローズボタンを押下
   */
  clickCloseDialogNew() {
    $$(this.name + ' ' + 'button.close').get(1).click();
  }

  /**
   * オーケーボタンを押下
   */
  clickOkDialogNew() {
    this.getDialogNew().element(by.buttonText('OK')).click();
  }
}
