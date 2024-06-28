import { AfterViewInit, Injector, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isEmpty as _isEmpty, isNil as _isNil } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { of as RxOf } from 'rxjs/observable/of';
import { finalize, catchError } from 'rxjs/operators';

import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';
import { OpeHistoryKindDiv } from '@blcloud/bl-datamodel/enum/bizcmn/ope-history-kind-div';
import { OperationContentDiv } from '@blcloud/bl-datamodel/enum/bizcmn/operation-content-div';
import {
  IGenericExportInstruction, IOrganizationInformation, IOperationHistoryLog, ILoginUserEmployeeBindModel
} from '@blcloud/bl-datamodel';
import { BlAppContext, BlApiErrorInfo, HttpStatus } from '@blcloud/bl-ng-common';
import { GenericExportInstructionResource, OperationHistoryLogResource } from '@blcloud/bl-ng-resource';
import { AbstractContainer, BlDialogService, BlLoadingService, BlModalService, ModalReason } from '@blcloud/bl-ng-ui-component';
import { FnKey, FunctionRole, ScreenService, PageId, PageName } from '@blcloud/bl-ng-share-module';

import { ExportPanelContainerComponent } from '../container/export-panel-container.component';
import { ExportRequestConfirmComponent } from '../modal/export-request-confirm/export-request-confirm.component';

/**
 * データ出力パネル基底クラス
 */
export abstract class AbstractExportPanel extends AbstractContainer implements OnInit, AfterViewInit, OnDestroy {
  /** 出力情報タブ区分 */
  abstract exportInfoTabDiv: string;

  /** 出力情報区分 */
  abstract exportInfoDiv: string;

  /** 出力情報名称 */
  abstract exportInfoName: string;

  /** 出力作業タイプ区分 */
  exportWorkTypeDiv = '';

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
  protected organizationCode = '';

  /** 出力パターンコード */
  protected exportPatternCode = 0;

  /** Router */
  protected router: Router

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

  /** テキスト出力情報リソースクラス */
  protected genericExportInstructionResource: GenericExportInstructionResource;

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
    this.genericExportInstructionResource = this.injector.get(GenericExportInstructionResource);
    this.operationHistoryLogResource = this.injector.get(OperationHistoryLogResource);
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
   * 汎用データ出力パラメータを生成します。
   */
  protected abstract makeGenericExportInstruction(): IGenericExportInstruction;

  /**
   * 条件をクリアします。
   */
  protected clear() {
    this.getContainer().initCondition();
    this.initCondition();
  }

  /**
   * ガイドを表示します。
   */
  protected showGuide() {
    if (!_isNil(this.currentGuideButton)) {
      this.currentGuideButton.click();
    }
  };

  /**
   * 出力内容を検証します。
   * 検証OKの場合はnullを返却します。
   * @returns 検証結果メッセージ
   */
  protected validate(): Observable<any> {
    return RxOf(null);
  }

  /**
   * データ出力を実行します。
   */
  protected export() {
    // 入力検証
    this.validate().subscribe(
      result => {
        if (!_isEmpty(result.message)) {
          this.dialogService.info(result.message).subscribe(
            (dialogRef) => {
              dialogRef.hide();

              if (!_isNil(result.childElement)) {
                result.childElement.focus();
              }
            }
          );
          return;
        }

        // データ出力確認
        this.modalService.show(ExportRequestConfirmComponent).subscribe(
          modalRef => {
            modalRef.hide();

            if (modalRef.reason === ModalReason.Done) {
              this.loadingService.show();

              // データ出力前処理
              this.beforeExportRequest();

              // 出力実行
              this.exportRequest().pipe(
                finalize(() => this.loadingService.hide())
              ).subscribe(
                (response) => {
                  // 操作ログ登録
                  this.postOperationHistoryLog();

                  // データ出力後処理
                  this.afterExportRequest(response);
                },
                (error: BlApiErrorInfo) => {
                  // エラーハンドリング
                  this.handleExportRequestError(error);
                }
              );
            }
          }
        );
      }
    );
  }

  /**
   * データ出力をリクエストします。
   * @returns レスポンス
   */
  protected exportRequest(): Observable<any> {
    const genericExportInstruction = this.makeGenericExportInstruction();

    // 汎用データ出力実行
    return this.genericExportInstructionResource.put<IGenericExportInstruction>(
      genericExportInstruction, { observe: 'response', entityOptions: { exPath: 'csv' } }
    );
  }

  /**
   * データ出力リクエスト前処理
   */
  protected beforeExportRequest() {
  }

  /**
   * データ出力リクエスト後処理
   * @param _response レスポンス
   */
  protected afterExportRequest(_response: any) {
    const historyPageName = PageName[PageId.DataExportHistory];
    const message = `${this.exportInfoName}の出力を開始しました。\n${historyPageName}画面で処理状況を確認して下さい。`;

    this.dialogService.info(message).subscribe(
      (dialogRef) => {
        dialogRef.hide();
      }
    );
  }

  protected handleExportRequestError(error: BlApiErrorInfo) {
    if (error.status === HttpStatus.BadRequest) {
      if (error.messages && error.messages.length > 0) {
        this.dialogService.error(error.messages[0]).subscribe(
          (dialogRef) => {
            dialogRef.hide();
          }
        );
      }
    } else {
      throw error;
    }
  }

  /**
   * 操作履歴ログを登録します。
   */
  protected postOperationHistoryLog() {
    const entity: IOperationHistoryLog = {
      productCode: ProductCode.Common,
      pageId: PageId.DataExport,
      opeHistoryFunctionName: 'データ出力',
      opeHistoryKindDiv: OpeHistoryKindDiv.Record,
      operationContentDiv: OperationContentDiv.DataOutput,
      opeHistoryMessageList: [`『${this.exportInfoName}』をデータ出力しました。`],
    };

    this.operationHistoryLogResource.post<IOperationHistoryLog>(entity).pipe(
      catchError(() => {
        return RxOf(null);
      })
    ).subscribe();
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
  private getContainer(): ExportPanelContainerComponent {
    return <ExportPanelContainerComponent>this.containers.first;
  }

  /**
   * ファンクション初期化処理
   */
  private initFunction() {
    this.screenService.setFunctions(
      [
        [
          FnKey.Toggle1Fn3.setLabel('条件クリア'),
          FnKey.Toggle1Fn4.setLabel('出力履歴'),
          FnKey.Guide.setLabel('ガイド').disable(),
        ],
      ]
    ).subscribe(functionRef => {
      switch (functionRef.role) {
        case FunctionRole.Toggle1Fn3:
          this.clear();
          break;
        case FunctionRole.Toggle1Fn4:
          this.router.navigate(['history']);
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
    this.subscription.add(
      container.readyLoginUserInfoEvent.subscribe(loginUser => this.loginUser = loginUser)
    );

    // 組織リスト取得完了イベント購読
    this.subscription.add(
      container.readyOrganizationListEvent.subscribe(organizationList => this.organizationList = organizationList)
    );

    // 組織変更イベント購読
    this.subscription.add(
      container.changeOrganizationEvent.subscribe(organizationCode => this.organizationCode = organizationCode)
    );

    // 出力パターン変更イベント購読
    this.subscription.add(
      container.changeExportPatternEvent.subscribe(exportPatternCode => this.exportPatternCode = exportPatternCode)
    );
  }

}
