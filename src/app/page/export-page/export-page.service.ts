import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of as ObservableOf } from 'rxjs/observable/of';
import {
  catchError,
  map,
} from 'rxjs/operators';
import { BlLoadingService, BlDialogService } from '@blcloud/bl-ng-ui-component';
import {
  ExportPatternInfoResource,
  OperationHistoryLogResource,
  StockMgtSettingResource,
} from '@blcloud/bl-ng-resource';
import {
  IExportPatternInfo,
  ILoginUserEmployeeBindModel,
  IOperationHistoryLog,
  IStockMgtSetting,
} from '@blcloud/bl-datamodel';
import {
  NotificationPushService, BlApiLocator, BlApiSearchCondition, BlApiConditionHelper
} from '@blcloud/bl-ng-common';
import {
  Const,
  StringUtils,
} from '@blcloud/bl-common';
import * as Cookies from 'js-cookie';
import { Subject } from 'rxjs/Subject';
import {
  LoginResourceService,
  PageId,
} from '@blcloud/bl-ng-share-module';
import { ProductCode, ProductCodeArray } from '@blcloud/bl-datamodel/enum/common/product-code';
import { LogicalDeleteDiv } from '@blcloud/bl-datamodel/enum/common/logical-delete-div';
import { OpeHistoryKindDiv } from '@blcloud/bl-datamodel/enum/bizcmn/ope-history-kind-div';
import { OperationContentDiv } from '@blcloud/bl-datamodel/enum/bizcmn/operation-content-div';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { ContractConst } from '@blcloud/bl-datamodel/const/contract';
import { IDownloadContent } from './export-page.define';
import { forEach as _forEach, find as _find } from 'lodash';
import { NotificationPushMessage } from '@blcloud/bl-ng-common/notification/notification-push-message';

/**
 * 検索サービス
 */
@Injectable()
export class ExportPageService {
  invokeEventTabCustomerVehicle: Subject<{ infoDataDownload: IDownloadContent[] }> = new Subject();
  invokeEventTabSlip: Subject<{ infoDataDownload: IDownloadContent[] }> = new Subject();
  invokeEventTabWorkHistory: Subject<{ infoDataDownload: IDownloadContent[] }> = new Subject();
  invokeEventTabSalesSlip: Subject<{ infoDataDownload: IDownloadContent[] }> = new Subject();
  invokeEventTabCredit: Subject<{ infoDataDownload: IDownloadContent[] }> = new Subject();
  invokeEventTabPurchaseSlip: Subject<{ infoDataDownload: IDownloadContent[] }> = new Subject();
  invokeEventTabDebt: Subject<{ infoDataDownload: IDownloadContent[] }> = new Subject();
  invokeEventTabStock: Subject<{ infoDataDownload: IDownloadContent[] }> = new Subject();
  invokeEventTabStockMoveSlip: Subject<{ infoDataDownload: IDownloadContent[] }> = new Subject();
  invokeEventTabCustomerSlip: Subject<{ infoDataDownload: IDownloadContent[] }> = new Subject();
  invokeEventTabVehicleMgt: Subject<{ infoDataDownload: IDownloadContent[] }> = new Subject();
  invokeEventTabRecycleCustomer: Subject<{ infoDataDownload: IDownloadContent[] }> = new Subject();
  invokeEventTabGlassSalesSlipSlip: Subject<{ infoDataDownload: IDownloadContent[] }> = new Subject();
  invokeEventTabGlassDepositSlip: Subject<{ infoDataDownload: IDownloadContent[] }> = new Subject();
  invokeEventTabGlassCustomerSlip: Subject<{ infoDataDownload: IDownloadContent[] }> = new Subject();
  invokeEventTabGlassIteminfoSlip: Subject<{ infoDataDownload: IDownloadContent[] }> = new Subject();
  invokeEventTabGlassStockSlip: Subject<{ infoDataDownload: IDownloadContent[] }> = new Subject();
  invokeEventTabGlassSettingInfoSlip: Subject<{ infoDataDownload: IDownloadContent[] }> = new Subject();
  requestTimeout: NodeJS.Timer;
  requestSenderIntervalSec = 15;
  requestSenderTimeoutSec = 30;

  constructor(
    private exportPatternInfoResource: ExportPatternInfoResource,
    private notificationPushService: NotificationPushService,
    private blApiLocator: BlApiLocator,
    private loadingService: BlLoadingService,
    private dialogService: BlDialogService,
    private loginResourceService: LoginResourceService,
    private stockMgtSettingResource: StockMgtSettingResource,
    private operationHistoryLogResource: OperationHistoryLogResource,
  ) {
  }

  /**
   * get list data 出力パターンとソート順
   */
  getListAllOuputPatternInfo(): Observable<IExportPatternInfo[]> {
    const sortFields = [
      {
        field: 'exportPatternCode',
        desc: false,
      }
    ];
    return this.exportPatternInfoResource.getAll<IExportPatternInfo>({ conditions: this.makeCondition(), sortFields }).pipe(
      map(res => res && res.searchResultList ? res.searchResultList : [])
    );
  }

  /**
   * 入力項目と出力項目を同時に取得するため、取得条件を編集する
   * @return 検索条件
   */
  private makeCondition(): BlApiSearchCondition {
    const condition = new BlApiSearchCondition();
    condition.addCondition(
      BlApiConditionHelper.makeCondStrEqual('logicalDeleteDiv', LogicalDeleteDiv.Valid),
    );
    return condition;
  }

  /**
   * PUSH通知監視
   * @param exportInfoTabDiv テキスト出力情報タブ区分
   * @param clientSessionId クライアントセッションID
   * @param isGlass 硝子モード
   */
  connectWebSocket(exportInfoTabDiv: string, clientSessionId: string, isGlass = false) {
    // 通知サービスへ WebSocket 接続
    this.blApiLocator.getBaseUrl('notification', false).pipe(
      map((baseUrl) => {
        let httpsUrl;
        if (baseUrl.startsWith(location.protocol)) {
          // ドメインを含む場合
          httpsUrl = baseUrl;
        } else {
          // ドメインを含まない場合
          const originUrl = location.origin;
          httpsUrl = originUrl + baseUrl;
        }
        const wssUrl = httpsUrl.replace(location.protocol, 'wss:');
        const notificationUrl = wssUrl + '/notificationoutsideappmessage/ws' +
          '?token=' + Cookies.get(Const.Cookie.Key.ID_TOKEN) + '&unique-id=' + clientSessionId;
        return notificationUrl;
      })
    ).subscribe((notificationUrl) => {
      this.notificationPushService.connect(notificationUrl).subscribe((res) => {
        this.stopRequestSender();
        this.loadingService.hide();
        const resObj = res.message.split('"');
        // エラーとなっている応答が返された場合
        if (resObj[0].indexOf('errFlg') !== -1) {
          const errMsg = (resObj[0].split(',')[1]).replace('errMsg:', '');
          this.dialogService.error(errMsg, '確認').subscribe(modalRef => {
            modalRef.hide();
          });
        } else {
          const listFile = this.convertDownloadUrlList(res, isGlass);
          // イベントをそれぞれタブのダウンロード関数へ呼び出す
          if (exportInfoTabDiv === ExportInfoTabDiv.CustomerVehicle) {
            this.invokeEventTabCustomerVehicle.next({ infoDataDownload: listFile });
          } else if (exportInfoTabDiv === ExportInfoTabDiv.Slip) {
            this.invokeEventTabSlip.next({ infoDataDownload: listFile });
          } else if (exportInfoTabDiv === ExportInfoTabDiv.WorkHistory) {
            this.invokeEventTabWorkHistory.next({ infoDataDownload: listFile });
          } else if (exportInfoTabDiv === ExportInfoTabDiv.SalesSlip || exportInfoTabDiv === ExportInfoTabDiv.RecycleSalesSlip) {
            this.invokeEventTabSalesSlip.next({ infoDataDownload: listFile });
          } else if (exportInfoTabDiv === ExportInfoTabDiv.Credit || exportInfoTabDiv === ExportInfoTabDiv.RecycleCredit) {
            this.invokeEventTabCredit.next({ infoDataDownload: listFile });
          } else if (exportInfoTabDiv === ExportInfoTabDiv.PurchaseSlip || exportInfoTabDiv === ExportInfoTabDiv.RecyclePurchaseSlip) {
            this.invokeEventTabPurchaseSlip.next({ infoDataDownload: listFile });
          } else if (exportInfoTabDiv === ExportInfoTabDiv.Debt || exportInfoTabDiv === ExportInfoTabDiv.RecycleDebt) {
            this.invokeEventTabDebt.next({ infoDataDownload: listFile });
          } else if (exportInfoTabDiv === ExportInfoTabDiv.StockMoveSlip) {
            this.invokeEventTabStockMoveSlip.next({ infoDataDownload: listFile });
          } else if (exportInfoTabDiv === ExportInfoTabDiv.Customer) {
            this.invokeEventTabCustomerSlip.next({ infoDataDownload: listFile });
          } else if (exportInfoTabDiv === ExportInfoTabDiv.VehicleMgt) {
            this.invokeEventTabVehicleMgt.next({ infoDataDownload: listFile });
          } else if (exportInfoTabDiv === ExportInfoTabDiv.RecycleCustomer) {
            this.invokeEventTabRecycleCustomer.next({ infoDataDownload: listFile });
          } else if (exportInfoTabDiv === ExportInfoTabDiv.GlassSalesSlip) {
            this.invokeEventTabGlassSalesSlipSlip.next({ infoDataDownload: listFile });
          } else if (exportInfoTabDiv === ExportInfoTabDiv.GlassDeposit) {
            this.invokeEventTabGlassDepositSlip.next({ infoDataDownload: listFile });
          } else if (exportInfoTabDiv === ExportInfoTabDiv.GlassCustomer) {
            this.invokeEventTabGlassCustomerSlip.next({ infoDataDownload: listFile });
          } else if (exportInfoTabDiv === ExportInfoTabDiv.GlassItem) {
            this.invokeEventTabGlassIteminfoSlip.next({ infoDataDownload: listFile });
          } else if (exportInfoTabDiv === ExportInfoTabDiv.GlassStock) {
            this.invokeEventTabGlassStockSlip.next({ infoDataDownload: listFile });
          } else if (exportInfoTabDiv === ExportInfoTabDiv.GlassSettingInfo) {
            this.invokeEventTabGlassSettingInfoSlip.next({ infoDataDownload: listFile });
          } else {
            this.invokeEventTabStock.next({ infoDataDownload: listFile });
          }
        }
      });
    });
  }

  /**
   * 返却されたメッセージをダウンロードリストに変換する
   * @param res Push通知メッセージ
   * @param isGlass 硝子モード
   */
  private convertDownloadUrlList(res: NotificationPushMessage, isGlass = false) {
    // 硝子用メッセージは形式が異なるため独自変換
    if (isGlass) {
      let objInfoFile = res['message'].replace(/\[/g, '');
      objInfoFile = objInfoFile.replace(/]/g, '');
      const arrListFile = objInfoFile.split(',');
      const listFile = [];
      const div = arrListFile[0];
      // ファイルリストの配列を作成
      for (let i = 1; i < arrListFile.length; i++) {
        listFile.push({
          exportInfoDiv: div.trim(),
          urlDownload: arrListFile[i].trim(),
        });
      }
      return listFile;
    } else {
      // 返却されたメッセージを変換し、ダウンロードリストにする
      let objInfoFile = res['message'].replace('[', '');
      objInfoFile = objInfoFile.replace(']', '');
      const arrListFile = objInfoFile.split(',');
      const listFile = [];
      // ファイルリストの配列を作成
      for (let i = 0; i < arrListFile.length; i++) {
        if (i % 2 === 0) {
          listFile.push({
            exportInfoDiv: arrListFile[i].trim(),
            urlDownload: arrListFile[i + 1].trim(),
          });
        }
      }
      return listFile;
    }
  }

  /**
   * 停止要求API
   */
  stopRequestSender() {
    if (this.requestTimeout) {
      clearTimeout(this.requestTimeout);
    }
  }

  /**
   * ログインユーザー情報取得
   * @returns ログインユーザ情報
   */
  getLoginUserInfo(): Observable<ILoginUserEmployeeBindModel> {
    return this.loginResourceService.getLoginUserEmployeeBindModel();
  }

  /**
   * 契約中の業務選択肢を取得します。
   * @returns 業務選択肢配列
   */
  getAvailableSystemItems(): Observable<{ value: string, text: string }[]> {
    return this.loginResourceService.getAvailableMainServiceIds().pipe(
      map(
        availableServiceIds => {
          // サービスIDを元にプロダクトコード配列を生成
          const items: { value: string, text: string }[] = [];
          _forEach(ProductCodeArray, product => {
            const serviceId = this.productToServieId(product.value);
            if (_find(availableServiceIds, availableServiceId => availableServiceId === serviceId) !== undefined) {
              items.push(product);
            }
          });

          if (items.length > 1) {
            // 対象が複数あるなら「全業務」を追加
            items.unshift({ value: ProductCode.Common, text: '全業務' });
          }
          return items;
        }
      )
    );
  }

  /**
   * プロダクトコードからサービスIDを取得します。
   * @param productCode プロダクトコード
   * @returns サービスID
   */
  private productToServieId(productCode: string): string {

    let servieId: string;

    switch (productCode) {
      // 整備 ⇒ サービスID Maintenance.c システム
      case ProductCode.SuperFrontman:
        servieId = ContractConst.SERVICEID_PRODUCT_MAINTENANCE;
        break;
      // 鈑金 ⇒ サービスID Repair.c システム
      case ProductCode.Repair:
        servieId = ContractConst.SERVICEID_PRODUCT_REPAIR;
        break;
      // 部品商 ⇒ サービスID Partsman.c システム
      case ProductCode.Partsman:
        servieId = ContractConst.SERVICEID_PRODUCT_PARTSMAN;
        break;
      // リサイクル ⇒ サービスID Recycle+ システム
      case ProductCode.Recycle:
        servieId = ContractConst.SERVICEID_PRODUCT_RECYCLE;
        break;
      // 硝子 ⇒ サービスID 硝子 システム
      case ProductCode.Glass:
        servieId = ContractConst.SERVICEID_PRODUCT_GLASS;
        break;
    }

    return servieId;
  }

  /**
   * 在庫移動伝票情報
   */
  getListSearchStockMgtSettingInfo(organizationCodes): Observable<IStockMgtSetting[]> {
    return this.stockMgtSettingResource.search<IStockMgtSetting>({ conditions: this.makeStockMgtCondition(organizationCodes) }).pipe(
      map(res => res && res.searchResultList ? res.searchResultList : [])
    );
  }

  /**
   * 在庫移動伝票情報取得条件を編集する
   * @return 検索条件
   */
  private makeStockMgtCondition(organizationCodes): BlApiSearchCondition {
    const condition = new BlApiSearchCondition();
    condition.addCondition(
      BlApiConditionHelper.makeCondAnd(
        BlApiConditionHelper.makeCondStrEqual('logicalDeleteDiv', LogicalDeleteDiv.Valid),
        BlApiConditionHelper.makeCondStrIn('organizationCode', organizationCodes),
      )
    );
    return condition;
  }

  /**
   * 操作履歴ログの登録
   */
  postOperationHistoryLog(pageid: PageId, exportInfoDivEnumName: string) {
    let opeHistoryFunctionName = '';

    switch (pageid) {
      case PageId.ExportCustomerVehicle:
        opeHistoryFunctionName = '顧客車両情報テキスト出力';
        break;
      case PageId.ExportSlip:
        opeHistoryFunctionName = '伝票情報テキスト出力';
        break;
      case PageId.ExportHistory:
        opeHistoryFunctionName = '履歴情報テキスト出力';
        break;
    }

    const opeHistoryMessage =
      StringUtils.concat(
        '『',
        exportInfoDivEnumName,
        '』のテキスト出力を行いました。',
      );

    const entity = {
      productCode: ProductCode.Common,
      opeHistoryKindDiv: OpeHistoryKindDiv.Record,
      pageId: pageid,
      opeHistoryFunctionName: opeHistoryFunctionName,
      operationContentDiv: OperationContentDiv.OutputText,
      opeHistoryMessageList: [opeHistoryMessage],
    };

    this.operationHistoryLogResource.post<IOperationHistoryLog>(entity).pipe(
      catchError(() => {
        return ObservableOf(null);
      })
    ).subscribe();
  }
}
