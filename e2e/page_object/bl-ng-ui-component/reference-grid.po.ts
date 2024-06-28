import { browser, $, ElementFinder, protractor, promise, Key, by } from 'protractor';

export class BlReferenceGrid {
  grid: ElementFinder;

  constructor(grid?: ElementFinder) {
    if (grid) {
      this.grid = grid;
    } else {
      this.grid = $('bl-reference-grid');
    }
  }

  /**
   * ヘッダのラベルチェックを行う。
   * @param expectValueArray 期待値の配列。[0:一列目の期待値, 1:2列目の期待値, ...]
   */
  checkHeader(expectValueArray: string[]) {
    expectValueArray.forEach((expectValue, index) => {
      expect(this.getHeaderCellLabel(index)).toEqual(expectValue);
    });
  }

  /**
   * データ行のチェックを行う。
   * @param rowNum チェック対象行
   * @param expectValueArray 期待値の配列。[0:一列目の期待値, 1:2列目の期待値, ...]
   */
  checkRow(rowNum: number, expectValueArray: string[]) {
    expectValueArray.forEach((expectValue, index) => {
      expect(this.getBodyCellLabel(rowNum, index)).toEqual(expectValue);
    });
  }

  isDisplayed(): promise.Promise<boolean> {
    return this.grid.isDisplayed();
  }

  isPresent(): promise.Promise<boolean> {
    return this.grid.isPresent();
  }

  setGrid(grid: ElementFinder) {
    this.grid = grid;
  }

  getHeader() {
    return this.grid.$('div.ag-header-container > div.ag-header-row');
  }

  getPinnedLeftHeader() {
    return this.grid.$('div.ag-pinned-left-header > div.ag-header-row');
  }

  getHeaderCellLabel(idx: number) {
    return this.getHeader().$$('div.ag-header-cell').get(idx).$('div.ag-header-cell-label.bl-grid-header__label').getAttribute('innerText');
  }

  getPinnedLeftHeaderCellLabel(idx: number) {
    const header = this.getPinnedLeftHeader().$$('div.ag-header-cell').get(idx);
    return header.$('div.ag-header-cell-label.bl-grid-header__label').getAttribute('innerText');
  }

  getBody() {
    return this.grid.$$('div.ag-body-container');
  }

  getPinnedLeftCols() {
    return this.grid.$$('div.ag-pinned-left-cols-container');
  }

  getBodyRowCount(): promise.Promise<number> {
    return this.getBody().$$('div.ag-row').count();
  }

  /**
   * 現在表示中の行を取得する
   * ag-gridの機能にてフィルタリングされた結果により、本関数が返却する行が変わります。
   * @param idx 行番号
   */
  getBodyRow(idx: number): ElementFinder {
    return this.getBody().$$('div.ag-row').get(idx);
  }

  /**
   * 固定の行番号で取得する
   * ag-gridの機能にてフィルタリングされた結果に関わらず、本関数が返却する行は変わりません。
   * フィルタリングされた結果で行を取得したい場合はgetBodyRowを使ってください。
   * @param idx 行番号
   */
  getBodyRowByFixedIndex(idx: number): ElementFinder {
    return this.getBody().$$(`div[row-index="${idx}"]`).get(0);
  }

  getPinnedLeftColsRow(idx: number): ElementFinder {
    return this.getPinnedLeftCols().$$('div.ag-row').get(idx);
  }

  /**
   * その行の内容を配列で返却します。
   */
  getBodyCellLabelList(row: ElementFinder): promise.Promise<string> {
    return row.$$('div[role="gridcell"]').getAttribute('innerText');
  }

  getBodyCellLabel(r: number, c: number, useFixedRowIndex?: boolean) {
    if (useFixedRowIndex) {
      return this.getBodyRowByFixedIndex(r).$$('div.ag-cell').get(c).getAttribute('innerText');
    }
    // getTextで値を取得しようとすると、画面外の要素の値が''になってしまうので、getAttribute('innerText')で取得する。
    return this.getBodyRow(r).$$('div.ag-cell').get(c).getAttribute('innerText');
  }

  /**
   * チェックボックスの状態確認
   * @param r 行インデックス
   * @param c 列インデックス
   * @return null or 'true' チェックしているかどうか
   */
  getBodyCheckBoxChecked(r: number, c: number, useFixedRowIndex?: boolean) {
    if (useFixedRowIndex) {
      return this.getBodyRowByFixedIndex(r).$$('div.ag-cell').get(c).$('input[type=checkbox]').getAttribute('checked');
    }
    return this.getBodyRow(r).$$('div.ag-cell').get(c).$('input[type=checkbox]').getAttribute('checked');
  }

  getNoRowsMessage() {
    return this.grid.$('div.grid-overlay--no-rows').getAttribute('innerText');
  }

  getBodyRowId(r: number) {
    return this.getBodyRow(r).getAttribute('row-id');
  }
  getFocusRowId() {
    return this.getBody().$$('div.ag-row-selected').get(0).getAttribute('row-id');
  }

  selectRow(r: number) {
    return this.getBodyRow(r).click();
  }

  selectDoubleClickRow(r: number) {
    return browser.actions().doubleClick(this.getBodyRow(r)).perform();
  }

  selectSpaceKeyRow(r: number) {
    this.selectRow(r);
    return browser.actions().sendKeys(protractor.Key.SPACE).perform();
  }

  scrollGrid(n: number) {
    this.selectRow(0);
    for (let i = 0; i < n; i++) {
      browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
    }
  }

  getDropdown(c: number) {
    this.getPinnedLeftColsRow(0).$$('div.ag-cell').get(c).click();
    return this.grid.$$('div.ag-popup-editor ul.dropdown-menu li');
  }

  getDropdownMenu(r: number, c: number) {
    this.getPinnedLeftColsRow(r).$$('div.ag-cell').get(c).click();
    return this.grid.$$('div.ag-popup-editor ul.dropdown-menu li');
  }

  clickDropdownMenu(item: number) {
    this.grid.$$('div.ag-popup-editor ul.dropdown-menu li').get(item).$('button.dropdown-item').click();
  }

  selectDropdown(r: number, select: number) {
    this.getDropdown(r).get(select).$('button.dropdown-item').click();
  }

  selectDropdownByArrowKey(c: number, select: number) {
    this.getDropdown(c);
    for (let i = 0; i < select; i++) {
      browser.actions().sendKeys(Key.ARROW_DOWN).perform();
    }
    browser.actions().sendKeys(Key.ENTER).perform();
    this.getHeader().click();
  }

  /**
   * コンテキスメニューの取得
   */
  getContextMenu() {
    return this.grid.$('div.ag-popup-editor').$('bl-row-menu-cell-popup');
  }

  /**
     * コンテキストメニューを選択する
     * @param 行番号
     * @param ボタンの表示文言
     */
  selectContextMenu(rowIndex: number, buttonName: string) {
    this.getLeftColContainer().$$('bl-list-grid-row-menu-cell').get(rowIndex).click();
    this.getContextMenu().all(by.buttonText(buttonName)).click();
  }

  /**
   * コンテキスメニューがある領域
   */
  getLeftColContainer() {
    return this.grid.$$('div.ag-pinned-left-cols-container');
  }

  /**
   * 操作メニュー表示ボタン押下
   * @param rowIndex 行クリック必要
   */
  clickOpeMenu(rowIndex: number) {
    this.getLeftColContainer().$$('bl-list-grid-row-menu-cell').get(rowIndex).click();
  }
}
