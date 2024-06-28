import { AfterViewInit, Injector, OnDestroy, OnInit } from '@angular/core';
import { Router, ParamMap } from '@angular/router';
import { isEmpty as _isEmpty, isNil as _isNil, defer as _defer } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { of as RxOf } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';

import { IOrganizationInformation, ILoginUserEmployeeBindModel, IGenericPrintCondition, IReportOutputResult } from '@blcloud/bl-datamodel';
import { StringUtils, LocalStorageUtils } from '@blcloud/bl-common';
import { BlAppContext, HttpStatus, BlApiErrorInfo, BlUrlQueryKey } from '@blcloud/bl-ng-common';
import { OperationHistoryLogResource } from '@blcloud/bl-ng-resource';
import { AbstractContainer, BlDialogService, BlLoadingService, BlModalService, ModalReason } from '@blcloud/bl-ng-ui-component';
import { FnKey, FunctionRole, PageId, ScreenService } from '@blcloud/bl-ng-share-module';

import { ExportReportPanelContainerComponent } from '../container/export-report-panel-container.component';
import { ExportReportPrintModalComponent } from '../modal/export-report-print-modal/export-report-print-modal.component';
import { IGenericPrintModalDataEx } from '../modal/export-report-print-modal/export-report-print-modal.interface';

/**
 * 帳票出力パネル基底クラス
 */
export abstract class AbstractExportReportPanel extends AbstractContainer implements OnInit, AfterViewInit, OnDestroy {
  /**
   * 組織選択表示モード
   *
   * 組織選択を行うコンボボックスを表示する場合はWithAllCompanyDivを設定してください。
   */
  organizationSelectMode: string;

  /**
   * 本社機能モード(trueの場合に本社機能が有効となる)
   *
   * 組織選択を行うコンボボックスを表示する場合に設定可能
   */
  officeControl = true;

  /** 組織コード */
  protected organizationCodeList = [];

  /** Router */
  protected router: Router;

  protected route: ActivatedRoute;

  /** コンテキスト */
  protected appContext: BlAppContext;

  /** 画面管理リソースサービス */
  protected screenService: ScreenService;

  /** ローディングサービス */
  protected loadingService: BlLoadingService;

  /** ダイアログ管理サービス */
  protected dialogService: BlDialogService;

  /** モーダル管理サービス */
  protected modalService: BlModalService;

  /** 操作履歴ログリソースクラス */
  protected operationHistoryLogResource: OperationHistoryLogResource;

  /** ログインユーザー情報 */
  protected loginUser: ILoginUserEmployeeBindModel;

  /** 組織一覧 */
  organizationList: IOrganizationInformation[];

  /** 購読 */
  protected subscription: Subscription = new Subscription();

  /** フォーカスがあたっているガイドボタン */
  private currentGuideButton: HTMLButtonElement;

  /** 印刷開始位置非表示 */
  protected hidePrintPosition = true;

  /** 画面ID */
  pageId = PageId.OutputReport;

  /** 設定識別ID */
  settingDataId = '';

  /** 帳票出力結果 */
  reportOutputResult: IReportOutputResult;

  /**
   * コンストラクタ
   * @param injector Injector
   */
  constructor(private injector: Injector) {
    super();
    this.router = this.injector.get(Router);
    this.appContext = this.injector.get(BlAppContext);
    this.screenService = this.injector.get(ScreenService);
    this.loadingService = this.injector.get(BlLoadingService);
    this.dialogService = this.injector.get(BlDialogService);
    this.modalService = this.injector.get(BlModalService);
    this.operationHistoryLogResource = this.injector.get(OperationHistoryLogResource);
    this.route = this.injector.get(ActivatedRoute);
  }

  ngOnInit() {
    this.initFunction();
  }

  ngAfterViewInit() {
    this.initContainer().subscribe(() => {
      this.initSubscription();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * 条件を初期化します。
   */
  protected abstract initCondition(): void;

  /**
   * 汎用印刷条件を生成します。
   */
  protected abstract makeGenericPrintConditionList(): IGenericPrintCondition[];

  protected makeReportIdList(): string[] {
    return [];
  }

  /**
   * 拡張汎用印刷条件を生成します。
   */
  protected makeGenericPrintModalData(): IGenericPrintModalDataEx {
    return {
      /** 画面ID */
      pageId: this.pageId,
      reportIdList: this.makeReportIdList(),
      afterPrintEvent: (reportOutputResult, _modal) => {
        this.reportOutputResult = reportOutputResult;
        return RxOf(reportOutputResult);
      },
      /** 印刷開始位置非表示 */
      hidePrintPosition: this.hidePrintPosition,
      /** ハンドリングしたい印刷エラーステータス配列 */
      respondablePrintErrorStatuses: [HttpStatus.NotFound],
      /** 汎用印刷条件配列 */
      genericPrintConditionList: this.makeGenericPrintConditionList(),
    };
  }

  /**
   * 条件をクリアします。
   */
  protected clear() {
    _defer(() => {
      this.getContainer().initCondition();
      this.initCondition();
    });
  }

  /**
   * ガイドを表示します。
   */
  protected showGuide() {
    if (!_isNil(this.currentGuideButton)) {
      this.currentGuideButton.click();
    }
  }

  /**
   * 出力内容を検証します。
   * 検証OKの場合はnullを返却します。
   * @returns 検証結果メッセージ
   */
  protected validate(): Observable<any> {
    return RxOf(null);
  }

  /**
   * 帳票出力を実行します。
   */
  protected export() {
    // 入力検証
    this.validate().subscribe((result) => {
      if (result && !_isEmpty(result.message)) {
        this.dialogService.info(result.message).subscribe((dialogRef) => {
          dialogRef.hide();

          if (!_isNil(result.childElement)) {
            result.childElement.focus();
          }
        });
        return;
      }

      const data: IGenericPrintModalDataEx = this.makeGenericPrintModalData();

      this.modalService.show(ExportReportPrintModalComponent, { data }).subscribe((modalRef) => {
        if (modalRef.reason === ModalReason.Done) {
          if (this.reportOutputResult) {
            this.getContainer().activatePreviewTab();
          }
        } else if (modalRef.reason === ModalReason.Error) {
          const error: BlApiErrorInfo = modalRef.getResults();
          this.dialogService.warn(StringUtils.concatWith('\n', ...error.messages)).subscribe((dialogRef) => dialogRef.hide());
        }
        modalRef.hide();
      });
    });
  }

  /**
   * 操作履歴ログを登録します。
   */
  protected postOperationHistoryLog() {
    // TODO
    // const entity: IOperationHistoryLog = {
    //   productCode: ProductCode.Common,
    //   pageId: PageId.DataExport,
    //   opeHistoryFunctionName: '帳票出力',
    //   opeHistoryKindDiv: OpeHistoryKindDiv.Record,
    //   operationContentDiv: OperationContentDiv.DataOutput,
    //   opeHistoryMessageList: [`『${this.exportInfoName}』を帳票出力しました。`],
    // };
    // this.operationHistoryLogResource.post<IOperationHistoryLog>(entity).pipe(
    //   catchError(() => {
    //     return RxOf(null);
    //   })
    // ).subscribe();
  }

  /**
   * ガイド条件フォーカス時イベントハンドラ
   * @param button ガイドボタン
   */
  onFocusGuideCondition(button: HTMLButtonElement) {
    this.currentGuideButton = button;
    this.screenService.enableFnKey(FunctionRole.Guide);
  }

  /**
   * ガイド条件フォーカスアウト時イベントハンドラ
   * @param button ガイドボタン
   */
  onBlurGuideCondition(button: HTMLButtonElement) {
    if (this.currentGuideButton === button) {
      this.currentGuideButton = null;
      this.screenService.disableFnKey(FunctionRole.Guide);
    }
  }

  /**
   * コンテナを取得します。
   * @returns コンテナ
   */
  private getContainer(): ExportReportPanelContainerComponent {
    return <ExportReportPanelContainerComponent>this.containers.first;
  }

  /**
   * ファンクション初期化処理
   */
  protected initFunction() {
    this.screenService
      .setFunctions([
        [FnKey.Toggle1Fn3.setLabel('条件クリア'), FnKey.Guide.setLabel('ガイド').disable()],
      ])
      .subscribe((functionRef) => {
        switch (functionRef.role) {
          case FunctionRole.Toggle1Fn3:
            this.clear();
            break;
          case FunctionRole.Guide:
            this.showGuide();
            break;
          case FunctionRole.Next:
            this.export();
            break;
        }
        functionRef.end(true);
      });

    this.screenService.setLabelFnKey(FunctionRole.Next, '出力する');
  }

  /**
   * Subscription初期化処理
   */
  private initSubscription() {
    const container = this.getContainer();

    // ユーザー情報取得完了イベント購読
    this.subscription.add(container.readyLoginUserInfoEvent.subscribe((loginUser) => (this.loginUser = loginUser)));

    // 組織リスト取得完了イベント購読
    this.subscription.add(container.readyOrganizationListEvent.subscribe((organizationList) => (this.organizationList = organizationList)));

    // 組織変更イベント購読
    this.subscription.add(
      container.changeOrganizationListEvent.subscribe((organizationCodeList) => (this.organizationCodeList = organizationCodeList))
    );

    // クエリパラメータの処理
    this.route.queryParamMap.subscribe((maps) => {
      // クエリの処理
      this.parseQuery(maps);
    });
  }

  /**
   * クエリのパース
   */
  protected parseQuery(maps: ParamMap) {
    // UUIDを取得
    const uuid = maps.get(BlUrlQueryKey.Uuid);
    if (_isNil(uuid)) {
      return;
    }
    // ローカルストレージにデータがあればそれをパースしてオブジェクトにする
    const key = uuid;
    const condition = LocalStorageUtils.get(key);
    if (_isNil(condition)) {
      return;
    }
    // 読み込んだデータは削除
    LocalStorageUtils.remove(key);
    // クエリデータの処理
    _defer(() => {
      this.handleParsedQuery(condition);
    });
  }

  /**
   * パースしたクエリの処理
   */
  protected handleParsedQuery(_condition: any) {}
}
