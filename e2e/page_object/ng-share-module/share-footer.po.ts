import { ElementFinder } from 'protractor';

export class ShareFooter {
  footer: ElementFinder;
  constructor(el: ElementFinder) {
    this.footer = el;
  }

  /**
   * ファンクションキーのラベルエレメントを取得
   * @param functionNum
   */
  getFnText(functionNum: string) {
    const idx = Number(functionNum.split('F')[1]) - 1;
    if (idx === 11) {
      return this.footer.$$('share-function-bar li.function__list').get(idx).$('div.function__list--link > div.function__list--key');
    } else {
      return this.footer.$$('share-function-bar li.function__list').get(idx).$('div.function__list--link > span.function__list--label');
    }
  }

  /**
   * Ｆ1ボタン　エレメント取得
   */
  getF1Button() {
    return this.footer.$$('share-function-bar li.function__list').get(0);
  }

  /**
   * Ｆ2ボタン　エレメント取得
   */
  getF2Button() {
    return this.footer.$$('share-function-bar li.function__list').get(1);
  }

  /**
   * Ｆ3ボタン　エレメント取得
   */
  getF3Button() {
    return this.footer.$$('share-function-bar li.function__list').get(2);
  }

  /**
   * Ｆ4ボタン　エレメント取得
   */
  getF4Button() {
    return this.footer.$$('share-function-bar li.function__list').get(3);
  }

  /**
   * Ｆ5ボタン　エレメント取得
   */
  getF5Button() {
    return this.footer.$$('share-function-bar li.function__list').get(4);
  }

  /**
   * Ｆ6ボタン　エレメント取得
   */
  getF6Button() {
    return this.footer.$$('share-function-bar li.function__list').get(5);
  }

  /**
   * Ｆ7ボタン　エレメント取得
   */
  getF7Button() {
    return this.footer.$$('share-function-bar li.function__list').get(6);
  }

  /**
   * Ｆ8ボタン　エレメント取得
   */
  getF8Button() {
    return this.footer.$$('share-function-bar li.function__list').get(7);
  }

  /**
   * Ｆ9ボタン　エレメント取得
   */
  getF9Button() {
    return this.footer.$$('share-function-bar li.function__list').get(8);
  }

  /**
   * Ｆ10ボタン　エレメント取得
   */
  getF10Button() {
    return this.footer.$$('share-function-bar li.function__list').get(9);
  }

  /**
   * Ｆ11ボタン　エレメント取得
   */
  getF11Button() {
    return this.footer.$$('share-function-bar li.function__list').get(10);
  }

  /**
   * Ｆ12ボタン　エレメント取得
   */
  getF12Button() {
    return this.footer.$$('share-function-bar li.function__list').get(11);
  }

  /**
   * ファンクションキー押下処理
   * @param functionNum
   */
  onClickFunction(functionNum: string) {
    switch (functionNum) {
      case 'F1':
        this.getF1Button().click();
        break;
      case 'F2':
        this.getF2Button().click();
        break;
      case 'F3':
        this.getF3Button().click();
        break;
      case 'F4':
        this.getF4Button().click();
        break;
      case 'F5':
        this.getF5Button().click();
        break;
      case 'F6':
        this.getF6Button().click();
        break;
      case 'F7':
        this.getF7Button().click();
        break;
      case 'F8':
        this.getF8Button().click();
        break;
      case 'F9':
        this.getF9Button().click();
        break;
      case 'F10':
        this.getF10Button().click();
        break;
      case 'F11':
        this.getF11Button().click();
        break;
      case 'F12':
        this.getF12Button().click();
        break;
    }
  }
}
