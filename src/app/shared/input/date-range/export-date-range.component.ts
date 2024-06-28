import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { isNil as _isNil, defer as _defer } from 'lodash';

import { DateTimeUtils } from '@blcloud/bl-common';
import { BlDateComponent, DateMode, Era } from '@blcloud/bl-ng-ui-component';

@Component({
  selector: 'app-export-date-range',
  templateUrl: './export-date-range.component.html',
  styleUrls: ['./export-date-range.component.scss'],
})

export class ExportDateRangeComponent implements OnChanges {
  /** 開始値 */
  @Input() startValue = DateTimeUtils.initial.iso8601.date;
  /** 終了値 */
  @Input() endValue = DateTimeUtils.initial.iso8601.date;
  /** 日付入力モード */
  @Input() dateMode = DateMode.Day;
  /** 和暦/西暦 */
  @Input() era = Era.Jp;
  /** 非活性フラグ */
  @Input() disabled = false;
  /** １ヶ月前後ボタン表示フラグ */
  @Input() displayMonthButton = true;
  /** Enter押下時のフォーカス先 */
  @Input() nextTarget: any;
  /** cssスタイル */
  @Input() styles: { [key: string]: string };

  /** 開始値変更イベント(双方向バインディング用) */
  @Output() startValueChange: EventEmitter<string> = new EventEmitter();
  /** 終了値変更イベント(双方向バインディング用) */
  @Output() endValueChange: EventEmitter<string> = new EventEmitter();
  /** 変更イベント */
  @Output() changeEvent: EventEmitter<{ start: string, end: string }> = new EventEmitter();

  /** 開始日入力コンポーネント */
  @ViewChild('startDateInput') private startDateInput: BlDateComponent;
  /** 終了日入力コンポーネント */
  @ViewChild('endDateInput') private endDateInput: BlDateComponent;

  /** 開始値 */
  _startValue: string;
  /** 終了値 */
  _endValue: string;

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
    this.startDateInput.focus();
  }

  /**
   * 終了入力コンポーネントにフォーカスします。
   */
  focusEnd() {
    this.endDateInput.focus();
  }

  /**
   * クリアします。
   */
  clear() {
    this._startValue = DateTimeUtils.initial.iso8601.date;
    this._endValue = DateTimeUtils.initial.iso8601.date;
  }

  /**
   * 「今月」クリックイベントハンドラ
   */
  onClickThisMonth() {
    const today = DateTimeUtils.today();
    const year = DateTimeUtils.getYear(today);
    const month = DateTimeUtils.getMonth(today);
    const startDate = DateTimeUtils.convertDate(year, month, 1);
    const endDate = DateTimeUtils.addDays(DateTimeUtils.addMonths(startDate, 1), -1);
    this._startValue = DateTimeUtils.formatIso(startDate);
    this._endValue = DateTimeUtils.formatIso(endDate);
    this.startValueChange.emit(this._startValue);
    this.endValueChange.emit(this._endValue);
  }

  /**
   * 1ヶ月前クリックイベントハンドラ
   */
  onClickBeforeMonth() {
    if (this._startValue && this._startValue !== DateTimeUtils.initial.iso8601.date) {
      this._startValue = DateTimeUtils.formatIso(DateTimeUtils.addMonths(DateTimeUtils.parseDate(this._startValue), -1));
      this.startValueChange.emit(this._startValue);
    }
    if (this._endValue && this._endValue !== DateTimeUtils.initial.iso8601.date) {
      this._endValue = DateTimeUtils.formatIso(DateTimeUtils.addMonths(DateTimeUtils.parseDate(this._endValue), -1));
      this.endValueChange.emit(this._endValue);
    }
  }

  /**
   * 1ヶ月後クリックイベントハンドラ
   */
  onClickAfterMonth() {
    if (this._startValue && this._startValue !== DateTimeUtils.initial.iso8601.date) {
      this._startValue = DateTimeUtils.formatIso(DateTimeUtils.addMonths(DateTimeUtils.parseDate(this._startValue), 1));
      this.startValueChange.emit(this._startValue);
    }
    if (this._endValue && this._endValue !== DateTimeUtils.initial.iso8601.date) {
      this._endValue = DateTimeUtils.formatIso(DateTimeUtils.addMonths(DateTimeUtils.parseDate(this._endValue), 1));
      this.endValueChange.emit(this._endValue);
    }
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
    _defer(() => {
      if (this._startValue === this.startValue && this._endValue === this.endValue) {
        return;
      }
      this.changeEvent.emit({ start: this._startValue, end: this._endValue });
    });
  }
}
