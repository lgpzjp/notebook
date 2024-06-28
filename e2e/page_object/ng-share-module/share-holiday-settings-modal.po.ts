import { $, promise, by, protractor, browser } from 'protractor';
import { DateTimeUtils, DateTimeOutput, DateTimePadding, DateSeparator, DateEra } from '@blcloud/bl-common';

/**
 * JapanEraTypeのテキスト
 */
const JAPAN_ERA_TEXT = {
  0: '明治',
  1: '大正',
  2: '昭和',
  3: '平成',
};

export class ShareHolidaySettingsModal {
  ele = $('share-holiday-settings-modal');

  isPresent(): promise.Promise<boolean> {
    return this.ele.isPresent();
  }

  /**
   * @param expectedDate YYYYMMDD
   */
  checkBlDate(expectedDate: string) {
    const expectedDateNum = parseInt(expectedDate, 10);
    const bldate = this.ele.$('bl-date').$('div.bl-date');

    // 元号
    const jEra = JAPAN_ERA_TEXT[DateTimeUtils.getJapanEra(expectedDateNum)];
    expect(bldate.$('bl-dropdown').$$('button.bl-dropdown-toggle > span').get(0).getAttribute('innerText')).toEqual(jEra);

    // 年（和暦）月日
    const expectedDateInput = [
      DateTimeUtils.format(expectedDateNum, DateTimeOutput.Y, DateTimePadding.ZERO, DateSeparator.NONE, DateEra.JP).slice(-2),
      expectedDate.slice(4, 6), // ex) 2018 [02] 10
      expectedDate.slice(-2), // ex) 201802 [10]
    ];
    expect(bldate.$$('input').getAttribute('value')).toEqual(expectedDateInput);
  }

   /**
   * 下部ボタンチェック。引数にはキャンセルも含めてください。
   * @param expectedButton ['決定'...'キャンセル']
   */
  checkFooterButton(expectedButton: string[]) {
    expect(this.ele.$('.modal-footer').$$('button').count()).toBe(expectedButton.length);
    expectedButton.forEach(buttonText => {
      expect(this.ele.$('.modal-footer').element(by.buttonText(buttonText)).isDisplayed()).toBeTruthy();
    });
  }

  clickClose() {
    this.ele.$('button.btn.close[type=button]').click();
  }

  inputDate(month, day) {
    this.ele.$('bl-date').$('div.month-input').$('input').click();
    this.ele.$('bl-date').$('div.month-input').$('input').sendKeys(protractor.Key.BACK_SPACE);
    this.ele.$('bl-date').$('div.month-input').$('input').sendKeys(month);
    this.ele.$('bl-date').$('div.day-input').$('input').click();
    this.ele.$('bl-date').$('div.day-input').$('input').sendKeys(protractor.Key.BACK_SPACE);
    this.ele.$('bl-date').$('div.day-input').$('input').sendKeys(day);
  }

  openInputCalendar() {
    this.ele.$('bl-date').$('button.btn.btn-default.btn-toggle-calendar').click();
  }

  selectDateByDatePicker() {
    $('bs-datepicker-container').$$('td[role=gridcell]').$$('span:not(.is-other-month)').get(0).click();
  }

  /**
   * 曜日指定チェックボックス押下
   */
  clickRepeatSettingCheckBox() {
    this.ele.$('bl-checkbox[ng-reflect-label="営業時間、定期的な休日を設定"]').$('span.check').click();
  }

  /**
   * 曜日指定エリア存在チェック
   */
  checkIsExistRepeatSettingArea(expectIsExist: boolean) {
    expect(this.ele.$$('table').get(1).isPresent()).toBe(expectIsExist);
  }

  /**
   * 日付入力欄の活性化チェック
   */
  checkIsEnableHolidayInput(expectIsEnable: boolean) {
    expect(this.ele.$('.year-input bl-text-input input').isEnabled()).toBe(expectIsEnable);
    expect(this.ele.$('.month-input bl-text-input input').isEnabled()).toBe(expectIsEnable);
    expect(this.ele.$('.day-input bl-text-input input').isEnabled()).toBe(expectIsEnable);
  }

  /**
   * 週指定削除ボタン
   * @param rowNum 週指定ごとにボタンが表示されるため、何行目の週指定か指定する
   */
  clickDeleteWeekDaginiteButton(rowNum: number) {
    this.ele.$$('table').get(1).$$('tr').get(2).$$('div.row-items').get(rowNum).$('button.btn.btn-success').click();
  }

  /**
   * 週指定入力エリアの数
   */
  countWeekDeginateArea() {
    return this.ele.$$('table').get(1).$$('tr').get(2).$$('div.row-items').count();
  }

  clickAddWeekDeginateButton() {
    this.ele.$$('table').get(1).$$('tr').all(by.buttonText('追加する')).get(0).click();
  }

  clickSuccess() {
    this.ele.element(by.buttonText('決定')).click();
  }

  clickRelease() {
    this.ele.element(by.buttonText('休日解除')).click();
  }

  clickCancel() {
    this.ele.element(by.buttonText('キャンセル')).click();
  }

  waitForLoading() {
    browser.wait(protractor.ExpectedConditions.invisibilityOf(
      this.ele.$('div.modal-body > bl-modal-loading > div.bl-modal-loading')
    ));
  }

  getTopMessage() {
    return this.ele.$('.holiday-settings > .main > .contents > span').getText();
  }

  /**
   * classからDOMのテキスト部分を取得
   * @param targetClass DOMのclass
   * @param index 何番目のclassか
   */
  getLabelByClass(targetClass: string, index: number) {
    return this.ele.$$('.' + targetClass).get(index).getText();
  }

  getEveryHolidayLabel() {
    return this.ele.$('bl-checkbox#holiday-settings-modal-every-holiday-checkbox').$('span.checkbox-label').getText();
  }

  clickEvelyHolidayCheckbox() {
    this.ele.$('bl-checkbox#holiday-settings-modal-every-holiday-checkbox').$('span.checkbox-material').click();
  }

  getEveryMonthSettingRemoveButtonClass() {
    return this.ele.$('#holiday-settings-modal-every-month-remove-button').$('span').getAttribute('class');
  }

  getEveryMonthSettingAddButtonText() {
    return this.ele.$('#holiday-settings-modal-every-month-add-button').getText();
  }

  getWeekCheckboxesLabel(checkboxGroupId: string) {
    return this.ele.$('bl-checkbox-group#' + checkboxGroupId).$$('span.checkbox-label').getText();
  }

  getEveryMonthWeekNumSelect() {
    return this.ele.$('bl-select#holiday-settings-modal-every-month-select');
  }

  openEveryMonthWeekNumSelect() {
    this.getEveryMonthWeekNumSelect().$('button.btn.btn-default.dropdown-toggle').click();
  }

  getEveryMonthWeekNumSelectChoise(index: number) {
    return this.getEveryMonthWeekNumSelect().$$('li').get(index).getText();
  }
}
