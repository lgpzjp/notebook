import { ElementFinder } from 'protractor';
import { BlComboBox } from '../bl-ng-ui-component/bl-combo-box.po';

export class ContactInfoList {
  ele: ElementFinder;

  /**
 * コンストラクタ
 * @param ele エレメント指定
 */
  constructor(ele: ElementFinder) {
    this.ele = ele;
  }

  getListSize() {
    return this.ele.$$('.contact-info-list-container > :not(.add-btn)').count();
  }

  getList() {
    return this.ele.$$('.contact-info-list-container > :not(.add-btn)');
  }

  checkValue(expects: any[]) {
    const actual = this.getList();
    expects.forEach((e, idx) => {
      const combo = new BlComboBox(actual.get(idx).$('bl-combo-box'));
      expect(combo.getInputValue()).toBe(e.typeCode);
      expect(actual.get(idx).$$('bl-text-input input').get(1).getAttribute('value')).toBe(e.information);
    });
  }

  inputValue(idx: number, input: any) {
    this.ele.$$('.contact-info-list-container > .add-btn button').click();
    const combo = new BlComboBox(this.getList().get(idx).$('bl-combo-box'));
    combo.openComboBox();
    combo.selectChoice(input.typeCode);
    this.getList().get(idx).$$('bl-text-input input').get(1).sendKeys(input.information);
  }
}
