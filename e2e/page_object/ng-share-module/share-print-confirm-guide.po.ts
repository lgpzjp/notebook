
import { $, element, by } from 'protractor';

/**
 * 汎用印刷ガイドDOM操作クラス
 */
export class SharePrintConfirmGuide {
  guide = $('share-print-confirm-guide');

  /**
   * 汎用印刷ガイドが表示されているかどうか
   */
  isDisplayed() {
    return this.guide.isDisplayed();
  }

  /**
   * 汎用印刷ガイドが存在しているかどうか
   */
  isPresent() {
    return this.guide.isPresent();
  }

  /**
   * ガイドの印刷ボタンクリックする
   */
  clickPrintButton() {
    element.all(by.buttonText('印刷')).get(0).click();
  }

  /**
   * ガイドのPDF出力ボタンクリックする
   */
  clickPdfOutPutButton() {
    element.all(by.buttonText('PDF出力')).get(0).click();
  }

}


