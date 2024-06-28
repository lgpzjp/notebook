import { $, ElementFinder, by } from 'protractor';

export class BlDropdown {
  dropdown: ElementFinder;

  constructor(dropdown?: ElementFinder) {
    if (dropdown) {
      this.dropdown = dropdown;
    } else {
      this.dropdown = $('bl-dropdown');
    }
  }

  setDropdown(dropdown: ElementFinder) {
    this.dropdown = dropdown;
  }

  /**
   * ドロップダウン選択肢の取得
   */
  getDropdown() {
    return this.dropdown.$('ul.dropdown-menu').$$('li');
  }

  /**
   * ドロップダウン選択肢の文言の取得
   * @param index ドロップダウン選択肢のインデックス
   */
  getDropdownText(index: number) {
    return this.dropdown.$('ul.dropdown-menu').$$('li').get(index).getText();
  }

  /**
   * ドロップダウンを選択する
   * @param ボタンの表示文言
   */
  selectDropdown(buttonName: string) {
    this.dropdown.click();
    this.getDropdown().all(by.buttonText(buttonName)).click();
  }

  /**
   * コンボボックス展開
   */
  openDropdown() {
    this.dropdown.$('button.btn.dropdown-toggle').click();
  }
}
