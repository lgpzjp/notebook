import { browser, $, ElementFinder, protractor, promise, Key, ElementArrayFinder } from 'protractor';

export class BlTable {
  table: ElementFinder;

  constructor(table?: ElementFinder) {
    if (table) {
      this.table = table;
    } else {
      this.table = $('bl-table');
    }
  }

  /**
   * テーブルのヘッダを取得する
   */
  getTableHeader(): ElementFinder {
    return this.table.$('thead').$$('tr').first();
  }

  /**
   * ヘッダの内容を取得する
   * @param col 列インデックス
   */
  getTableHeaderColumnText(col: number): promise.Promise<String> {
    return this.getTableHeader().$$('th').get(col).getAttribute('innerText');
  }

  /**
   * ボディの行数を取得する
   */
  getTableRowCount(): promise.Promise<number> {
    return this.table.$$('tbody').$$('tr').count();
  }

  /**
   * １行取得
   * @param row 行インデックス
   * @return 1行
   */
  getTableRow(row: number): ElementFinder {
    return this.table.$('tbody').$$('tr').get(row);
  }

  /**
   * １行取得
   * @param row 行インデックス
   * @return 1行
   */
  getTableRowColumn(row: number): ElementArrayFinder {
    return this.table.$('tbody').$$('tr').get(row).$$('td');
  }

  /**
   * １行のテキストを取得
   * @param row 行インデックス
   * @param col 列インデックス
   * @return テキスト
   */
  getTableColumneText(row: number, col: number): promise.Promise<string> {
    return this.getTableRow(row).$$('td').get(col).getAttribute('innerText');
  }

  /**
   * 行を選択する
   * @param row 行インデックス
   */
  selectTableRow(row: number) {
    this.getTableRow(row).click();
  }
}
