import { delay as _delay } from 'lodash';

export class AbstractConditionsComponent {
  private readonly _changeWait = 200;

  /** @ignore パネル表示・非表示 */
  _isOpened = false;

  /** @ignore パネルが開かれた */
  _hasOpened = false;

  /** @ignore パネルが閉じられた */
  _hasClosed = !this._hasOpened;

  /**
   * 詳細出力条件を表示
   */
  open() {
    this._isOpened = true;
    this.onChangeOpenStatus();
  }

  /**
   * 詳細出力条件を非表示
   */
  close() {
    this._isOpened = false;
    this.onChangeOpenStatus();
  }

  /**
   * 詳細出力条件の表示ステータスを変更
   */
  changeOpenStatus() {
    this._isOpened = !this._isOpened;
    this.onChangeOpenStatus();
  }

  /**
   * change 詳細出力条件
   */
  private onChangeOpenStatus() {
    _delay(() => {
      this._hasOpened = this._isOpened;
      this._hasClosed = !this._isOpened;
    }, this._changeWait);
  }
}
