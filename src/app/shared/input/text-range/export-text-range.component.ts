import { Component, EventEmitter, Output, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { isNil as _isNil } from 'lodash';

import { BlTextInputComponent } from '@blcloud/bl-ng-ui-component';

@Component({
  selector: 'app-export-text-range',
  templateUrl: './export-text-range.component.html',
  styleUrls: ['./export-text-range.component.scss'],
})

export class ExportTextRangeComponent implements OnChanges {
  /** 開始値 */
  @Input() startValue = '';
  /** 終了値 */
  @Input() endValue = '';
  /** オプション */
  @Input() option: string;
  /** 最大桁数 */
  @Input() maxlength: number;
  /** 表示位置 */
  @Input() align: string;
  /** 非活性フラグ */
  @Input() disabled = false;
  /** Enter押下時のフォーカス先 */
  @Input() nextTarget: any;

  /** 開始値変更イベント(双方向バインディング用) */
  @Output() startValueChange: EventEmitter<string> = new EventEmitter();
  /** 終了値変更イベント(双方向バインディング用) */
  @Output() endValueChange: EventEmitter<string> = new EventEmitter();
  /** 変更イベント */
  @Output() changeEvent: EventEmitter<{ start: string, end: string }> = new EventEmitter();

  /** 開始日入力コンポーネント */
  @ViewChild('startTextInput') private startTextInput: BlTextInputComponent;
  /** 終了日入力コンポーネント */
  @ViewChild('endTextInput') private endTextInput: BlTextInputComponent;

  /** 開始値 */
  _startValue = '';
  /** 終了値 */
  _endValue = '';

  /** 終了入力コンポーネントでEnter押下時のフォーカス処理 */
  _nextFocusFunction = function nextFocusFunction(event: KeyboardEvent): void {
    if (this.nextTarget) {
      this.nextTarget.focus();
      event.preventDefault();
      event.stopPropagation();
    }
  }.bind(this);

  ngOnChanges(changes: SimpleChanges) {
    if (!_isNil(changes.startValue)) {
      this._startValue = this.startValue;
    }

    if (!_isNil(changes.endValue)) {
      this._endValue = this.endValue;
    }
  }

  /**
   * フォーカスします。
   */
  focus() {
    this.focusStart();
  }

  /**
   * 開始入力コンポーネントにフォーカスします。
   */
  focusStart() {
    this.startTextInput.focus();
  }

  /**
   * 終了入力コンポーネントにフォーカスします。
   */
  focusEnd() {
    this.endTextInput.focus();
  }

  /**
   * クリアします。
   */
  clear() {
    this._startValue = '';
    this._endValue = '';
  }

  /**
   * 開始値変更イベントハンドラ
   * @param value 開始値
   */
  onChangeStartValue(value: string) {
    if (value === this.startValue) {
      return;
    }
    this.startValueChange.emit(value);
  }

  /**
   * 終了値変更イベントハンドラ
   * @param value 終了値
   */
  onChangeEndValue(value: string) {
    if (value === this.endValue) {
      return;
    }
    this.endValueChange.emit(value);
  }


  /**
   * フォーカスアウトイベントハンドラ
   */
  onBlur() {
    if (this._startValue === this.startValue && this._endValue === this.endValue) {
      return;
    }
    this.changeEvent.emit({ start: this._startValue, end: this._endValue });
  }
}
