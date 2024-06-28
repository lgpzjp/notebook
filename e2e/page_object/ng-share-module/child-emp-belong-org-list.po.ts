import { ElementFinder } from 'protractor';
import { BlComboBox } from '../bl-ng-ui-component/bl-combo-box.po';

export class ChildEmpBelongOrgList {
  ele: ElementFinder;

  /**
 * コンストラクタ
 * @param ele エレメント指定
 */
  constructor(ele: ElementFinder) {
    this.ele = ele;
  }

  getListSize() {
    return this.ele.$$('.emp-belong-org-list-container > :not(.add-btn)').count();
  }

  getList() {
    return this.ele.$$('.emp-belong-org-list-container > :not(.add-btn)');
  }

  checkValue(expects: any[]) {
    const actual = this.getList();
    expects.forEach((e, idx) => {
      expect(actual.get(idx).$('.org-code bl-text-input input').getAttribute('value')).toBe(e.code);
      expect(actual.get(idx).$('.org-name span').getAttribute('innerText')).toBe(e.name);
      const jobType = new BlComboBox(actual.get(idx).$('bl-combo-box'));
      expect(jobType.getInputValue()).toBe(e.jobType);
    });
  }

  inputValue(idx: number, input: any) {
    this.getList().get(idx).$('.org-code bl-text-input input').sendKeys(input.code);
    const jobType = new BlComboBox(this.getList().get(idx).$('bl-combo-box'));
    jobType.openComboBox();
    jobType.selectChoice(input.jobType);
  }
}
