import { $, ElementFinder, promise, by, Key } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { BlComboBox } from './../../page_object/bl-ng-ui-component/bl-combo-box.po';

export class StockMoveSlipDetail {
  modal: ElementFinder;
  nameEleModal: string;

  targetPeriodDiv: BlComboBox;

  /**
   * コンストラクタ
   * @param el エレメントファインダー
   */
  constructor(el: ElementFinder) {
    this.modal = el;
    this.targetPeriodDiv = new BlComboBox($('bl-select#targetPeriodstockMoveSlip'));
  }
  /**
   * 表示モードの確認
   */
  isPresent(): promise.Promise<boolean> {
    return this.modal.$$('div.tab-option.condition.closed').isPresent();
  }

  /**
   *活性/非活性チェック
   * @param nameOfClass
   * @param index
   */
  isEnabled(nameOfClass: string, index: number) {
    return this.modal.$$('.' + nameOfClass).get(index).isEnabled();
  }

  /**
   *ラベルを取得
   * @param index
   */
  getLabelValue(index: number) {
    return this.modal.$$('label').get(index).getText();
  }

  /**
   *ボタンvalueを取得
   * @param index
   */
  getButtonValue(index: number) {
    return this.modal.$$('button').get(index).getText();
  }

  /**
   *ボタンをクリック
   * @param index
   */
  clickButton(index: number) {
    return this.modal.$$('button').get(index).click();
  }

  /**
   * 入力
   * @param index
   * @param text 入力値
   */
  inputText(index: number, text: string) {
    const el = this.modal.$$('.bl-text-input').get(index);
    el.click(); // 入力値全文選択状態
    el.sendKeys(protractor.Key.BACK_SPACE); // 前の入力値があれば消す
    el.sendKeys(text);
    this.modal.click();
  }

  /**
   * indexからinputタグのvalue値を取得
   * @param index
   */
  getInputValueById(index: number) {
    return this.modal.$$('.bl-text-input').get(index).getAttribute('value');
  }

  /**
   * ボタンvalueを取得
   * @param nameClass
   * @param index
   */
  getButtonlValue(nameClass: string, index: number) {
     return this.modal.$$('.' + nameClass + ' button').get(index).getText();
   }

  isSelected(nameOfClass: string, index: number) {
    return this.modal.$$('.' + nameOfClass).get(index).isSelected();
  }
  /**
   * checkboxをクリック
   * @param tag
   * @param string
   */
  checkbox(nameOfClass: string, index: number) {
    return this.modal.$$(nameOfClass).get(index).click();
  }

  /**
   * コンボボックス(ボタン)をクリック
   * @param tag
   * @param string
   */
  ClickElement(tag: string, id: string) {
    this.modal.$$(tag + '#' + id).click();
  }

  /**
   * 組織をクリック
   * @param tag
   * @param id
   */
  ClickShareComboBox(tag: string, id: string) {
    this.modal.$$(tag + '#' + id).$$('.input-group-btn').click();
  }

  /**
   * 表示値を取得
   * @param nameClass
   * @param index
   */
  exportPatternValue(nameClass: string, index: number) {
    return this.modal.$$('.' + nameClass).get(index).getText();
  }

  /**
   * 時間値を設定
   * @param nameClass
   * @param index
   */
  setDateValue(nameClass: string, index: number, value: string) {
    this.modal.$$('.' + nameClass + ' input').get(index).click();
    this.modal.$$('.' + nameClass + ' input').get(index).sendKeys(protractor.Key.BACK_SPACE);
    return this.modal.$$('.' + nameClass + ' input').get(index).sendKeys(value);
   }

  /**
   * 時間値を取得
   * @param nameClass
   * @param index
   */
   getDateValue(nameClass: string, index: number) {
    return this.modal.$$('.' + nameClass + ' input').get(index).getAttribute('value');
   }

   /**
   * 時間値を取得
   * @param nameClass
   * @param index
   */
  srtDateValue(nameClass: string, index: number) {
    return this.modal.$$('.' + nameClass + ' input').get(index).sendKeys('');
  }

  /**
   * フォーカス設定
   * @param nameClass
   * @param index
   */
  setFocus(nameClass: string, index: number) {
    this.modal.$$('.' + nameClass + ' input').get(index).sendKeys(Key.TAB);
  }

  /**
   * 選択肢をクリック
   * @param index
   */
  clickBtn(nameClass: string, index: number) {
    this.modal.$$(nameClass).get(index).click();
   }

  /**
   * 非表示チェック
   * @param index
   */
  checkboxIsPresent(nameClass: string) {
    return this.modal.$$('.group-2').$$('.' + nameClass).isPresent();
  }

  /**
   * ダイアログのメッセージを取得
   */
  getMessage() {
    return $('div.message-container').$('div.message').getText();
  }

  /**
   * ダイアログが閉じる
   */
  clickDialog(value: string) {
    return $('.modal-content').element(by.buttonText(value)).click();
  }

  /**
   * ダイアログチェック
   */
  dialogIsPresent(nameClass: string) {
    return $(nameClass).isPresent();
  }

  /**
   * 編集をクリック
   */
  clickEdit() {
    this.modal.$$('button.btn.btn-default.btn-edit').click();
  }

  /**
   * 詳細条件F6ボタン押下
   */
  getF6Button() {
    return $('share-footer').$$('share-function-bar li.function__list').get(5);
  }
}
