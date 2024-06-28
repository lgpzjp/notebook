import { ElementFinder, promise　} from 'protractor';

export class BlComboBox {
  comboBox: ElementFinder;

  /**
   * コンストラクタ
   * @param el エレメント指定
   */
  constructor(el: ElementFinder) {
    this.comboBox = el;
  }

  /**
   * コンボボックス展開
   */
  openComboBox() {
    this.comboBox.$('button.btn.dropdown-toggle').click();
  }

  /**
   * 選択肢取得
   * @param index 選択肢番号
   * @return 選択肢要素
   */
  getChoice(index: number): ElementFinder {
    return this.comboBox.$$('li').get(index);
  }

  /**
   * 選択肢文言取得
   * @param index 選択肢番号
   * @return 選択肢文言
   */
  getChoiceText(index: number): promise.Promise<string> {
    return this.getChoice(index).$('button.dropdown-item').getText();
  }

  /**
   * 選択肢選択
   * @param index 選択肢番号
   */
  selectChoice(index: number) {
    this.getChoice(index).$('button.dropdown-item').click();
  }

  /**
   * 値取得
   * @return 値
   */
  getInputValue(): promise.Promise<string> {
    return this.comboBox.$('input').getAttribute('value');
  }

}
