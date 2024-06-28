import { ElementFinder, $, protractor } from 'protractor';

export class BlWjFlexGridHelper {
  wjGrid: ElementFinder;

  /**
   * コンストラクタ
   * @param el エレメント指定
   */
  constructor(el?: ElementFinder) {
    if (el) {
      this.wjGrid = el;
    } else {
      this.wjGrid = $('bl-wj-flexgrid-helper');
    }
  }

  /**
   * ヘッダ行取得
   * @param rowIndex ヘッダ行の行数（ヘッダ行が複数行になることがある）
   */
  getColumnHeaderRow(rowIndex: number) {
    return this.wjGrid.$('div[wj-part=ch] > div.wj-colheaders').$$('div.wj-row').get(rowIndex);
  }

  /**
   * 列ヘッダのテキストを取得(1列)
   * @param headerRowIndex ヘッダ行の何行目か
   * @param colIndex　何列目か
   */
  getColumnHeaderCellText(headerRowIndex: number, colIndex: number) {
    return this.getColumnHeaderRow(headerRowIndex).$$('div.wj-cell').get(colIndex).getText();
  }

  /**
   * 列ヘッダを取得(1列)
   * @param headerRowIndex ヘッダ行の何行目か
   * @param colIndex　何列目か
   */
  getColumnHeaderCell(headerRowIndex: number, colIndex: number) {
    return this.getColumnHeaderRow(headerRowIndex).$$('div.wj-cell').get(colIndex);
  }

  /**
   * グリッド左上パネルを取得
   */
  getTopLeftRow(rowIndex: number) {
    return this.wjGrid.$('div[wj-part=tl] > div.wj-topleft').$$('div.wj-row').get(rowIndex);
  }

  /**
   * グリッドのNo列の各行のパネルを取得
   */
  getNoCell(rowIndex: number) {
    return this.wjGrid.$('div[wj-part=rh] > div.wj-rowheaders').$$('div.wj-cell').get(rowIndex);
  }

  /**
   * グリッド左上パネルのセルのテキスト取得
   * @param rowIndex 左上パネルの何行目か
   * @param colIndex 左上パネルの何列目か
   */
  getTopLeftCellText(rowIndex: number, colIndex: number) {
    return this.getTopLeftRow(rowIndex).$$('div.wj-cell').get(colIndex).getText();
  }

  /**
   * データ部分の行取得
   */
  getRootRow(rowIndex: number) {
    return this.wjGrid.$('div[wj-part=root] > div.wj-cells').$$('div.wj-row').get(rowIndex + 1);
  }

  /**
   * データ部のセル取得
   */
  getCell(rowIndex: number, colIndex: number) {
    return this.getRootRow(rowIndex).$$('div.wj-cell[role=gridcell]').get(colIndex);
  }

  /**
   * データ部のセルのテキスト取得
   *
   * 編集可能セルの場合、編集中はDOM構成が変わるため取得できません。
   */
  getCellText(rowIndex: number, colIndex: number) {
    return this.getCell(rowIndex, colIndex).getText();
  }

  /**
   * データ部のセルが編集可能かどうか
   */
  isCellEditable(rowIndex: number, colIndex: number) {
    this.getCell(rowIndex, colIndex).click();
    return this.getCell(rowIndex, colIndex).$('input').isPresent();
  }

  /**
   * データ部のセルに入力
   */
  inputToCell(rowIndex: number, colIndex: number, text: string) {
    const cell =  this.getCell(rowIndex, colIndex);
    cell.click();
    const input = cell.$('div.wj-flex-grid-cell-template-container').$('input');
    input.sendKeys(protractor.Key.BACK_SPACE); // 前の入力値があれば消す
    input.sendKeys(text);
  }

  getOparateCell(rowIndex: number) {
    return this.getCell(rowIndex, 0);
  }

  openContextMenu(rowIndex: number) {
    this.getOparateCell(rowIndex).$('button').click();
  }

  /**
   * 先にopenContextMenu()でコンテキストメニューを開いてください
   */
  getContextMenuItems() {
    return $('div[wj-part=dropdown]').$$('div[role=menuitem]');
  }

  /**
   * 行ヘッダ列のセル取得
   * @param rowIndex 行
   */
  getRowHeaderCell(rowIndex: number) {
    return this.getRowHeaderColumn().$$('div.wj-cell.wj-header').get(rowIndex);
  }

  /**
   * 行ヘッダ列を取得
   */
  getRowHeaderColumn() {
    return this.wjGrid.$('div[wj-part=rh]');
  }
}
