import { ElementFinder, protractor } from 'protractor';

export class BlDate {
  ele: ElementFinder;

  /**
 * コンストラクタ
 * @param ele エレメント指定
 */
  constructor(ele: ElementFinder) {
    this.ele = ele;
  }

  checkValue(expects: any) {
    this.checkYear(expects.year);
    this.checkMonth(expects.month);
    this.checkDay(expects.day);
  }

  checkYear(year) {
    expect(this.ele.$('.year-input bl-text-input input').getAttribute('value')).toBe(year);
  }
  checkMonth(month) {
    expect(this.ele.$('.month-input bl-text-input input').getAttribute('value')).toBe(month);
  }
  checkDay(day) {
    expect(this.ele.$('.day-input bl-text-input input').getAttribute('value')).toBe(day);
  }

  inputValue(input: any) {
    this.inputYear(input.year);
    this.inputMonth(input.month);
    this.inputDay(input.day);
  }

  inputYear(year) {
    this.ele.$('.year-input bl-text-input input').click();
    this.ele.$('.year-input bl-text-input input').sendKeys(protractor.Key.BACK_SPACE);
    this.ele.$('.year-input bl-text-input input').sendKeys(year);
  }

  inputMonth(month) {
    this.ele.$('.month-input bl-text-input input').click();
    this.ele.$('.month-input bl-text-input input').sendKeys(protractor.Key.BACK_SPACE);
    this.ele.$('.month-input bl-text-input input').sendKeys(month);
  }

  inputDay(day) {
    this.ele.$('.day-input bl-text-input input').click();
    this.ele.$('.day-input bl-text-input input').sendKeys(protractor.Key.BACK_SPACE);
    this.ele.$('.day-input bl-text-input input').sendKeys(day);
  }
}
