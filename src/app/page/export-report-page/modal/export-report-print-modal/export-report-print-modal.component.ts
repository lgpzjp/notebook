import { Component, Injector } from '@angular/core';
import { finalize, mergeMap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of as ObservableOf } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { isNil as _isNil, isFunction as _isFunction, assign as _assign, find as _find, isEmpty as _isEmpty, first as _first } from 'lodash';

import { AbstractPrintModal, GenericPrintRef } from '@blcloud/bl-ng-share-module';
import { ModalReason } from '@blcloud/bl-ng-ui-component';
import { IGenericPrintCondition, IReportOutputResult } from '@blcloud/bl-datamodel';
import { ReportOutputDiv } from '@blcloud/bl-datamodel/enum/common/report-output-div';
import { PrintPaperFeedingImageDiv } from '@blcloud/bl-datamodel/enum/common/print-paper-feeding-image-div';

import { ExportReportPrintModalService } from './export-report-print-modal.service';

/**
 * 帳票出力印刷モーダル
 */
@Component({
  selector: 'app-export-report-print-modal',
  templateUrl: './export-report-print-modal.component.html',
  styleUrls: ['./export-report-print-modal.component.scss'],
})
export class ExportReportPrintModalComponent extends AbstractPrintModal {
  /**
   * コンストラクタ
   * @param injector Injector
   * @param service 帳票出力印刷サービス
   */
  constructor(injector: Injector, service: ExportReportPrintModalService) {
    super(injector, service);
  }

  /**
   * @override
   */
  onAfterShown() {
    this.focusPrintButton();
  }

  /**
   * @override
   */
  protected createGenericPrintRef(reportOutputDiv: string, isPreview: boolean): GenericPrintRef {
    const subject: Subject<{ continue: boolean; genericPrintConditionList?: IGenericPrintCondition[] }> = new Subject();

    // 通知受けた場合の処理
    subject.subscribe((response) => {
      subject.complete();

      // 処理続行
      if (response.continue) {
        // 汎用印刷情報の更新
        if (!_isNil(response.genericPrintConditionList)) {
          this.genericPrint.genericPrintConditionList = response.genericPrintConditionList;
        }

        // 汎用印刷指示を生成
        const genericPrintInstruction = this.printService.createGenericPrintInstruction(
          reportOutputDiv,
          isPreview,
          this.genericPrint,
          this.getSelectedReportLayoutSetting()
        );

        // 印刷処理
        let executePrint$ = this.printService.executePrint(this.updateGenericPrintInstruction(genericPrintInstruction));
        if (_isFunction(this.data.executePrint)) {
          // 指定された場合は印刷処理を変更
          executePrint$ = this.data.executePrint(this.updateGenericPrintInstruction(genericPrintInstruction));
        }

        // 印刷実行
        executePrint$
          .pipe(
            mergeMap((reportOutputResult) => {
              // プレビューの場合、印刷後処理を不要
              if (isPreview) {
                return ObservableOf(reportOutputResult);
              }
              if (reportOutputDiv === ReportOutputDiv.DirectPrint) {
                // ダイレクト印刷を実行した場合、印刷後処理の実施タイミング調整
                return ObservableOf(reportOutputResult);
              }
              // その以外の場合、印刷後処理を行う
              return this.afterPrintProcEx(reportOutputResult);
            }),
            finalize(() => this.hideLoading())
          )
          .subscribe(
            (reportOutputResult) => {
              // ダイレクト印刷を実行した場合
              if (reportOutputDiv === ReportOutputDiv.DirectPrint && !isPreview) {
                // 印刷プログレスバーを表示
                this.printService
                  .showProgressBar(reportOutputResult.reportOutputHistoryId, this.getSelectedReportLayoutSetting())
                  .pipe(
                    // 印刷プログレスバー表示後、印刷後処理を行う
                    mergeMap(() => this.afterPrintProcEx(reportOutputResult))
                  )
                  .subscribe(() => {
                    this.endPrint(ModalReason.Done);
                  });
              } else {
                // ダイアログを閉じる
                this.endPrint(ModalReason.Done);
              }
            },
            (error) => {
              this.printInstructionErrorHandler(error);
            }
          );

        // 印刷キャンセル
      } else {
        this.endPrint(ModalReason.Cancel);
      }
    });

    return new GenericPrintRef(subject, reportOutputDiv, isPreview);
  }

  /**
   * @override
   */
  protected changeReportId(reportId: string): Observable<null> {
    if (this.genericPrint.reportId === reportId) {
      // 変更なしなら何もしない
      return ObservableOf(null);
    }

    if (!_isNil(reportId)) {
      // 帳票IDがリスト内に存在するか確認
      const exist =
        _find(this.reportLayoutSettingList, (reportLayoutSetting) => {
          return reportLayoutSetting.reportId === reportId;
        }) !== undefined;

      if (!exist) {
        // 存在しないならリストの先頭に変更
        reportId = !_isEmpty(this.reportLayoutSettingList) ? _first(this.reportLayoutSettingList).reportId : null;
      }
    }

    this.genericPrint = _assign({}, this.genericPrint, { reportId });
    const selected = this.getSelectedReportLayoutSetting();
    if (!_isNil(selected)) {
      // 給紙方法表示有無を更新
      this.genericPrint = _assign(this.genericPrint, {
        isShowPaperFeeding: selected.printPaperFeedingImageDiv === PrintPaperFeedingImageDiv.LeftSide,
      });

      // 帳票作成サービス区分を更新
      this.genericPrint = _assign(this.genericPrint, { reportMakerServiceDiv: selected.reportMakerServiceDiv });
    }

    return ObservableOf(null);
  }

  /**
   * 印刷後処理を行う
   * @param reportOutputResult 印刷結果
   * @returns 印刷結果
   */
  private afterPrintProcEx(reportOutputResult: IReportOutputResult): Observable<IReportOutputResult> {
    if (this.isAvailableFunctionEx(this.data.afterPrintEvent)) {
      // 印刷後処理
      return this.data.afterPrintEvent(reportOutputResult, this).pipe(
        // エラーハンドリング
        catchError((error) => {
          if (this.isAvailableFunctionEx(this.data.afterPrintErrorEvent)) {
            // エラーハンドリング設定する時、呼び出す元を依存する
            return this.data.afterPrintErrorEvent(reportOutputResult, error);
          } else {
            // エラーハンドリング設定しない時、本体処理に影響しないように、印刷が続ける
            return ObservableOf(reportOutputResult);
          }
        })
      );
    } else {
      // 処理未設定場合、何でもしない
      return ObservableOf(reportOutputResult);
    }
  }

  /**
   * 有効メソッドかどうかを判断する
   * @param func メソッド
   * @returns 有効かどうか
   */
  private isAvailableFunctionEx(func: Function): boolean {
    return !_isNil(func) && _isFunction(func);
  }
}
