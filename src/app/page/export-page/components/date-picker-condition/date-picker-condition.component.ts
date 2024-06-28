import {
  Component,
  EventEmitter,
  Output,
  Input,
  ViewChild,
} from '@angular/core';
import * as _moment from 'moment';
import {
  debounce as _debounce,
  defer as _defer
} from 'lodash';
import { BlDialogService, BlDateComponent, Era } from '@blcloud/bl-ng-ui-component';
import { DateSeparator, DateTimeOutput, DateTimePadding, DateTimeUtils } from '@blcloud/bl-common';
import { DateMode } from '@blcloud/bl-ng-ui-component';

@Component({
  selector: 'app-date-picker-condition',
  templateUrl: './date-picker-condition.component.html',
  styleUrls: ['./date-picker-condition.component.scss'],
})

export class DatePickerConditionComponent {
  constructor(
    private dialogService: BlDialogService,
  ) { }

  /** 抽出開始日 */
  @Input() startDate: string = null;
  /** 抽出終了日 */
  @Input() endDate: string = null;
  /** 抽出開始日日表示 */
  @Input() displayStartDate = true;
  /** 抽出終了日表示 */
  @Input() displayEndDate = true;
  /** 日付入力モード */
  @Input() dateMode = DateMode.Day;
  /** 和暦/西暦 */
  @Input() era = Era.Jp;
  /** 抽出開始日活性 */
  @Input() displayStart = true;
  /** 抽出終了日活性 */
  @Input() displayEnd = true;
  /** １ヶ月前ボタン活性 */
  @Input() displayStartButton = true;
  /** １ヶ月先ボタン活性 */
  @Input() displayEndButton = true;
  /** 画面フラグ */
  @Input() detailDateCode: string = null;

  /** タブフォーカスキーボードイベント */
  @Output() tabFocusKeyboardEvent = new EventEmitter();

  @Output() startDateChange: EventEmitter<string> = new EventEmitter();

  @Output() endDateChange: EventEmitter<string> = new EventEmitter();

  /** 画面項目：発注日(開始) */
  @ViewChild('startDateEle') private startDateEle: BlDateComponent;

  readonly DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
  /** 日付不正ダイアログ表示フラグ */
  isDisplayValidateDateFlag = false;
  isThisMonth = false;

  private debounceAdjustOneMonth = _debounce(ahead => this.adjustOneMonth(ahead), 300);

  /**
 * 日付初期化処理
 */
  clear(): void {
    this.startDate = '';
    this.endDate = '';
    this.startDateChange.emit(this.startDate);
    this.endDateChange.emit(this.endDate);
  }

  /**
   * 1ヶ月先/1ヶ月前ボタン押下時の処理
   * @param ahead 1ヶ月先の場合true
   */
  onClickOneMonth(ahead = true) {
    this.debounceAdjustOneMonth(ahead);
  }

  /**
   * 次月前月への調整
   * @param ahead 1ヶ月先の場合true
   */
  private adjustOneMonth(ahead) {
    let startDate = this.startDate ? _moment(this.startDate) : _moment().startOf('month');
    let endDate = this.endDate ? _moment(this.endDate) : _moment().endOf('month');
    const isEndOfMonthStart = startDate.clone().endOf('month').date() === startDate.clone().date();
    const isEndOfMonthEnd = endDate.clone().endOf('month').date() === endDate.clone().date();

    // 未入力の場合
    if (!this.startDate && !this.endDate) {
      startDate = ahead ? startDate : startDate.add(-1, 'months');
      endDate = ahead ? endDate.add(1, 'months') : endDate;
    } else if (!this.startDate && this.endDate) {
      // 開始日が未入力の場合
      startDate = ahead ? endDate : endDate.add(-1, 'months');
      endDate = startDate.add(1, 'months');
    } else if (this.startDate && !this.endDate) {
      // 終了日が未入力の場合
      startDate = ahead ? startDate : startDate.add(-1, 'months');
      endDate = startDate.add(1, 'months');
    } else {
      // 設定済みの日付から加減算するの月数の設定
      const amount = ahead ? 1 : -1;
      startDate = startDate.add(amount, 'months');
      endDate = endDate.add(amount, 'months');
    }

    if (isEndOfMonthStart) {
      startDate = startDate.endOf('month');
    }
    if (isEndOfMonthEnd) {
      endDate = endDate.endOf('month');
    }

    this.startDate = startDate.format(this.DEFAULT_DATE_FORMAT);
    this.endDate = endDate.format(this.DEFAULT_DATE_FORMAT);
    this.startDateChange.emit(this.startDate);
    this.endDateChange.emit(this.endDate);
    this.checkStartDate();
  }

  /**
   * フォーカス制御
   */
  onKeyDownToButtonFocus($event) {
    this.tabFocusKeyboardEvent.emit($event);
  }

  /**
   * 対象期間開始日の過去日判定
   */
  private checkStartDate() {
    this.isThisMonth = _moment().isSame(this.startDate, 'month');
  }

  /**
   * 対象期間変更
   * @param $event
   * @param key
   */
  onChangeTargetDate($event, key) {
    const beforeDataStartDate = this.startDate;
    const beforeDataEndDate = this.endDate;
    if (key === 'startDate') {
      this.startDateChange.emit($event);
      this.startDate = $event;
      if (this.dateMode === DateMode.Month) {
        this.startDate = DateTimeUtils.format($event, DateTimeOutput.YM, DateTimePadding.ZERO, DateSeparator.SLASH);
      }
    } else {
      this.endDateChange.emit($event);
      this.endDate = $event;
      if (this.dateMode === DateMode.Month) {
        this.endDate = DateTimeUtils.format($event, DateTimeOutput.YM, DateTimePadding.ZERO, DateSeparator.SLASH);
      }
    }
    const error = this.validateTargetDate();
    if (error) {
      if (!this.isDisplayValidateDateFlag) {
        this.isDisplayValidateDateFlag = true;
        this.dialogService.warn(error.message, '確認').subscribe(dialogRef => {
          this.isDisplayValidateDateFlag = false;
          dialogRef.hide(this.startDateEle);
        });
      }
      _defer(() => {
        this.startDate = beforeDataStartDate;
        this.endDate = beforeDataEndDate;
        this.startDateChange.emit(beforeDataStartDate);
        this.endDateChange.emit(beforeDataEndDate);
      });
      return;
    }
  }

  /**
   * 対象期間の入力チェックを行う
   * @return エラーがある場合は、メッセージ入りのオブジェクト
   */
  private validateTargetDate(): { message: string } {
    const start = _moment(this.startDate);
    const end = _moment(this.endDate);
    if (this.endDate === '1900/01' || this.endDate === '1900-01-01') {
      return null;
    }
    if (this.displayEndDate && start.isAfter(end) && this.endDate !== DateTimeUtils.initial.iso8601.date) {
      return { message: '対象期間が不正です。入力内容を確認してください。' };
    }
    if (this.displayEndDate && start.isAfter(end)) {
      return { message: '対象期間が不正です。入力内容を確認してください。' };
    }

    return null;
  }
}
