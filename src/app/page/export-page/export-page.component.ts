import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AbstractContainer,
  BlTabStyle,
  BlTabOption,
  BlLoadingService,

} from '@blcloud/bl-ng-ui-component';
import { ScreenService, FunctionRole, FnKey, PageId, LoginResourceService, } from '@blcloud/bl-ng-share-module';
import { ExportCustomerVehicleComponent } from './../../feature/export-customer-vehicle/export-customer-vehicle.component';
import { ExportHistoryComponent } from './../../feature/export-history/export-history.component';
import { ExportSlipComponent } from './../../feature/export-slip/export-slip.component';
import { ExportSalesSlipComponent } from './../../feature/export-sales-slip/export-sales-slip.component';
import { ExportGlassSalesSlipComponent } from './../../feature/export-glass-sales-slip/export-glass-sales-slip.component';
import { ExportGlassDepositComponent } from './../../feature/export-glass-deposit/export-glass-deposit.component';
import { ExportGlassCustomerComponent } from './../../feature/export-glass-customer/export-glass-customer.component';
import { ExportCreditComponent } from './../../feature/export-credit/export-credit.component';
import { ExportPurchaseSlipComponent } from '../../feature/export-purchase-slip/export-purchase-slip.component';
import { ExportDebtComponent } from './../../feature/export-debt/export-debt.component';
import { ExportStockMoveSlipComponent } from '../../feature/export-stock-move-slip/export-stock-move-slip.component';
import { ExportCustomerSlipComponent } from '../../feature/export-customer-slip/export-customer-slip.component';
import { ExportVehicleMgtComponent } from '../../feature/export-vehicle-mgt/export-vehicle-mgt.component';
import { ExportStockComponent } from './../../feature/export-stock/export-stock.component';
import { ExportPageService } from './export-page.service';
import { Subscription } from 'rxjs/Subscription';
import { IExportPatternInfo } from '@blcloud/bl-datamodel';
import { BlUrlQueryKey } from '@blcloud/bl-ng-common';
import { find as _find, first as _first, forEach as _forEach } from 'lodash';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';
import { ExportInfoTabDiv, ExportInfoTabDivMap } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { ContractConst } from '@blcloud/bl-datamodel/const/contract';
import { ExportRecycleCustomerComponent } from '../../feature/export-recycle-customer/export-recycle-customer.component';
import { ExportGlassSettingInfoComponent } from '../../feature/export-glass-setting-info/export-glass-setting-info.component';

/**
 * タブID
 */
export enum TabId {
  TabCustomerVehicleInfo = 0,
  TabSlip,
  TabHistoryInfo,
  TabSalesSlip,
  TabCredit,
  TabPurchaseSlip,
  TabDebt,
  TabStockMoveSlip,
  TabCustomer,
  TabVehicleMgt,
  TabStock,
  TabItem,
  TabDeposit,
  TabSettingInfo,
}

@Component({
  selector: 'app-export-page',
  templateUrl: './export-page.component.html',
  styleUrls: ['./export-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExportPageComponent extends AbstractContainer implements OnInit, OnDestroy {

  /** プロダクトコード */
  public readonly ProductCode = ProductCode;
  /** テーブル幅調整購読 */
  private subscription: Subscription = new Subscription();
  public dataExportPatterns: IExportPatternInfo[] = [];
  public tabList: BlTabOption[] = [];
  @ViewChild(ExportCustomerVehicleComponent) private exportCustomerVehicle: ExportCustomerVehicleComponent;
  @ViewChild(ExportHistoryComponent) private exportHistory: ExportHistoryComponent;
  @ViewChild(ExportSlipComponent) private exportSlip: ExportSlipComponent;
  @ViewChild(ExportSalesSlipComponent) private exportSalesSlip: ExportSalesSlipComponent;
  @ViewChild(ExportCreditComponent) private exportCredit: ExportCreditComponent;
  @ViewChild(ExportPurchaseSlipComponent) private exportPurchaseSlip: ExportPurchaseSlipComponent;
  @ViewChild(ExportDebtComponent) private exportDebt: ExportDebtComponent;
  @ViewChild(ExportStockMoveSlipComponent) private exportStockMoveSlip: ExportStockMoveSlipComponent;
  @ViewChild(ExportCustomerSlipComponent) private exportCustomer: ExportCustomerSlipComponent;
  @ViewChild(ExportVehicleMgtComponent) private exportVehicleMgt: ExportVehicleMgtComponent;
  @ViewChild(ExportStockComponent) private exportStock: ExportStockComponent;
  @ViewChild(ExportGlassSalesSlipComponent) private exportGlassSalesSlip: ExportGlassSalesSlipComponent;
  @ViewChild(ExportGlassDepositComponent) private exportGlassDeposit: ExportGlassDepositComponent;
  @ViewChild(ExportGlassCustomerComponent) private exportGlassCustomer: ExportGlassCustomerComponent;
  @ViewChild(ExportGlassSettingInfoComponent) private exportGlassSettingInfo: ExportGlassSettingInfoComponent;
  @ViewChild(ExportRecycleCustomerComponent) private exportRecycleCustomer: ExportRecycleCustomerComponent;

  /** ページタイトル */
  title = 'テキストデータ出力';

  /** 画面ID定義 */
  readonly PageId = PageId;

  /** 画面ID */
  targetPageId: PageId;

  /** 画面初期化完了フラグ */
  isLoaded = false;

  /** プロダクトコード */
  productCode: string;

  /** デフォルトタブの表示フラグ MEMO: おそらく整備、鈑金用と思われる */
  showDefaultTab = true;

  /** 業務選択肢 */
  systemItems: { value: string, text: string }[];

  readonly currentTab = 'currentTab';

  /** WebSocket接続状態 */
  webSocketConnected = false;

  /** ガイド用フォーカスエレメント */
  focusElement = null;

  /** ログイン組織コード */
  loginUserOrganizationCode: string;
  organizationCode = '000000';
  organizationCodes: string[] = [this.organizationCode];

  constructor(
    private screenService: ScreenService,
    private exportService: ExportPageService,
    private loadingService: BlLoadingService,
    private activatedRoute: ActivatedRoute,
    private loginResourceService: LoginResourceService,
  ) {
    super();
  }

  /**
   * 初期化
   */
  ngOnInit() {
    this.initProduct();
  }

  /** タブ一覧初期化処理 */
  private initTabList(): void {
    if (this.productCode === ProductCode.Partsman) {
      this.tabList = [
        {
          tabId: TabId.TabSalesSlip,
          elementId: 'exportSalesSlipTab',
          label: ExportInfoTabDivMap[ExportInfoTabDiv.SalesSlip],
          active: true,
          style: BlTabStyle.Greenish,
        },
        {
          tabId: TabId.TabCredit,
          elementId: 'exportCreditTab',
          label: ExportInfoTabDivMap[ExportInfoTabDiv.Credit],
          active: false,
          style: BlTabStyle.Greenish,
        },
        {
          tabId: TabId.TabPurchaseSlip,
          elementId: 'exportTabPurchaseSlip',
          label: ExportInfoTabDivMap[ExportInfoTabDiv.PurchaseSlip],
          active: false,
          style: BlTabStyle.Greenish,
        },
        {
          tabId: TabId.TabDebt,
          elementId: 'exportDebtTab',
          label: ExportInfoTabDivMap[ExportInfoTabDiv.Debt],
          active: false,
          style: BlTabStyle.Greenish,
        },
        {
          tabId: TabId.TabStockMoveSlip,
          elementId: 'exportTabStockMoveSlip',
          label: ExportInfoTabDivMap[ExportInfoTabDiv.StockMoveSlip],
          active: false,
          style: BlTabStyle.Greenish,
        },
        {
          tabId: TabId.TabCustomer,
          elementId: 'exportTabCustomerSlip',
          label: ExportInfoTabDivMap[ExportInfoTabDiv.Customer],
          active: false,
          style: BlTabStyle.Greenish,
        },
        {
          tabId: TabId.TabVehicleMgt,
          elementId: 'exportTabVehicleMgt',
          label: ExportInfoTabDivMap[ExportInfoTabDiv.VehicleMgt],
          active: false,
          style: BlTabStyle.Greenish,
        },
        {
          tabId: TabId.TabStock,
          elementId: 'exportStockTab',
          label: ExportInfoTabDivMap[ExportInfoTabDiv.Stock],
          active: false,
          style: BlTabStyle.Greenish,
        },
      ];

      this.loginResourceService.getAllServiceAvailabilityInfo()
        .subscribe(responses => {
          const isPurchaseServiceAvailable = _find(responses, response => {
            return response.serviceAvailableFlag === true && response.serviceId === ContractConst.SERVICEID_OPT_CMN_PURCHASE;
          }) !== undefined;
          const isStockMgtServiceAvailable = _find(responses, response => {
            return response.serviceAvailableFlag === true && response.serviceId === ContractConst.SERVICEID_OPT_CMN_STOCK_MGT;
          }) !== undefined;

          if (!isPurchaseServiceAvailable) {
            this.tabList.splice(this.tabList.findIndex(e => e.elementId === 'exportTabPurchaseSlip'), 1);
          }
          if (!isStockMgtServiceAvailable) {
            this.tabList.splice(this.tabList.findIndex(e => e.elementId === 'exportTabStockMoveSlip'), 1);
            this.tabList.splice(this.tabList.findIndex(e => e.elementId === 'exportStockTab'), 1);
          }
        });
    } else if (this.productCode === ProductCode.Recycle) {
      // MEMO
      // リサイクルのタブ構成は特殊
      // 売上伝票情報、仕入伝票情報は、他プロダクトと共存させる。
      // 債権情報、債務情報は、他プロダクトと共存させる。ただし出力項目に違いがあるためExportInfoTabDivは独自の値とする。
      // 取引先情報は、独自の項目が多いため、独自にコンポーネントを作る。
      this.tabList = [
        {
          tabId: TabId.TabSalesSlip,
          elementId: 'exportSalesSlipTab',
          label: ExportInfoTabDivMap[ExportInfoTabDiv.SalesSlip],
          active: false,
          style: BlTabStyle.Greenish,
        },
        {
          tabId: TabId.TabCredit,
          elementId: 'exportCreditTab', // 共存させるので共通定義
          label: ExportInfoTabDivMap[ExportInfoTabDiv.Credit], // 表示は共通の定義にする
          active: false,
          style: BlTabStyle.Greenish,
        },
        {
          tabId: TabId.TabPurchaseSlip,
          elementId: 'exportTabPurchaseSlip',
          label: ExportInfoTabDivMap[ExportInfoTabDiv.PurchaseSlip],
          active: false,
          style: BlTabStyle.Greenish,
        },
        {
          tabId: TabId.TabDebt,
          elementId: 'exportDebtTab', // 共存させるので共通定義
          label: ExportInfoTabDivMap[ExportInfoTabDiv.Debt], // 表示は共通の定義にする
          active: false,
          style: BlTabStyle.Greenish,
        },
        {
          tabId: TabId.TabCustomer,
          elementId: 'exportRecycleCustomerTab',
          label: ExportInfoTabDivMap[ExportInfoTabDiv.Customer], // 表示は共通の定義にする
          active: false,
          style: BlTabStyle.Greenish,
        },
      ];
      _first(this.tabList).active = true;
    } else if (this.productCode === ProductCode.Glass) {
      this.tabList = [
        {
          tabId: TabId.TabSalesSlip,
          elementId: 'exportGlassSalesSlipTab',
          label: ExportInfoTabDivMap[ExportInfoTabDiv.SalesSlip],
          active: true,
          style: BlTabStyle.Greenish,
        },
        {
          tabId: TabId.TabDeposit,
          elementId: 'exportGlassDepositTab',
          label: ExportInfoTabDivMap[ExportInfoTabDiv.Deposit],
          active: false,
          style: BlTabStyle.Greenish,
        },
        {
          tabId: TabId.TabCustomer,
          elementId: 'exportGlassCustomerTab',
          label: ExportInfoTabDivMap[ExportInfoTabDiv.Customer],
          active: false,
          style: BlTabStyle.Greenish,
        },
        {
          tabId: TabId.TabSettingInfo,
          elementId: 'exportGlassSettingInfoTab',
          label: ExportInfoTabDivMap[ExportInfoTabDiv.GlassSettingInfo],
          active: false,
          style: BlTabStyle.Greenish,
        },
      ];
    } else {
      this.tabList = [
        {
          tabId: TabId.TabCustomerVehicleInfo,
          elementId: 'exportCustomerVehicleTabInfo',
          label: '顧客車両情報',
          active: true,
          style: BlTabStyle.Greenish,
        },
        {
          tabId: TabId.TabSlip,
          elementId: 'exportSlipTab',
          label: '売上伝票情報',
          active: false,
          style: BlTabStyle.Greenish,
        },
        {
          tabId: TabId.TabHistoryInfo,
          elementId: 'exportTabHistory',
          label: '作業履歴情報',
          active: false,
          style: BlTabStyle.Greenish,
        },
      ];
    }
  }

  /** 初期表示するタブIDを取得する */
  private getInitTabId(): number {
    // ローカルストレージから取得
    const targetTabId = localStorage.getItem(this.currentTab);
    // 現在のタブ構成に存在するか確認
    const targetTab = _find(this.tabList, (tab) => String(tab.tabId) === targetTabId);
    if (targetTab) {
      return Number(targetTabId);
    }

    // なければ、先頭のタブを返す
    return Number(_first(this.tabList).tabId);
  }

  /**
   * ファンクションとタブを初期化する
   */
  private reactiveFnFunction(): void {
    // 初期表示するタブIDを取得して、タブを有効化する
    const targetTabId = this.getInitTabId();

    _forEach(this.tabList, (tab) => {
      tab.active = false;
    });
    const targetTab = _find(this.tabList, (tab) => tab.tabId === targetTabId);
    if (targetTab) {
      targetTab.active = true;
    }

    this.initFunction(targetTabId);
  }

  /**
   * 終了
   */
  ngOnDestroy() {
    if (!this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    this.exportService.stopRequestSender();
  }

  /**
   * get data 出力パターンとソート順を指定し
   */
  private initDataExportPatternSelectorByService() {
    this.exportService.getListAllOuputPatternInfo().subscribe(response => {
      this.dataExportPatterns = response;
      this.isLoaded = true;
      this.loadingService.hide();
    });
  }

  /**
   * initialize Fn key
   * @param tabId
   */
  private initFunction(tabId: number) {
    // 出力パターン指定領域のデータを更新
    this.updateExportPattern();

    // ローカルストレージにタブを保持
    localStorage.setItem(this.currentTab, tabId.toString());

    // ファンクション
    this.targetPageId = this.convertTabIdToPageId(tabId);
    this.initializeFnKeyScreenTab(this.targetPageId);
  }

  /** 出力パターン指定領域のデータを更新 */
  private updateExportPattern() {
    if (this.exportCustomerVehicle) {
      this.exportCustomerVehicle.updateExportPattern(true);
    }
    if (this.exportSlip) {
      this.exportSlip.updateExportPattern(true);
    }
    if (this.exportHistory) {
      this.exportHistory.updateExportPattern(true);
    }
    if (this.exportSalesSlip) {
      this.exportSalesSlip.updateExportPattern(true);
    }
    if (this.exportCredit) {
      this.exportCredit.updateExportPattern(true);
    }
    if (this.exportPurchaseSlip) {
      this.exportPurchaseSlip.updateExportPattern(true);
    }
    if (this.exportDebt) {
      this.exportDebt.updateExportPattern(true);
    }
    if (this.exportStockMoveSlip) {
      this.exportStockMoveSlip.updateExportPattern(true);
    }
    if (this.exportCustomer) {
      this.exportCustomer.updateExportPattern(true);
    }
    if (this.exportVehicleMgt) {
      this.exportVehicleMgt.updateExportPattern(true);
    }
    if (this.exportStock) {
      this.exportStock.updateExportPattern(true);
    }
    if (this.exportGlassSalesSlip) {
      this.exportGlassSalesSlip.updateExportPattern(true);
    }
    if (this.exportGlassDeposit) {
      this.exportGlassDeposit.updateExportPattern(true);
    }
    if (this.exportGlassCustomer) {
      this.exportGlassCustomer.updateExportPattern(true);
    }
    if (this.exportRecycleCustomer) {
      this.exportRecycleCustomer.updateExportPattern(true);
    }
  }

  /** タブIDからページIDに変換 */
  private convertTabIdToPageId(tabId: TabId): PageId {
    if (tabId === TabId.TabCustomerVehicleInfo) {
      return PageId.ExportCustomerVehicle;
    } else if (tabId === TabId.TabSlip) {
      return PageId.ExportSlip;
    } else if (tabId === TabId.TabHistoryInfo) {
      return PageId.ExportHistory;
    } else if (tabId === TabId.TabSalesSlip) {
      if (this.productCode === ProductCode.Glass) {
        return PageId.GlassExportSales;
      } else {
        return PageId.ExportSalesSlip;
      }
    } else if (tabId === TabId.TabCredit) {
      return PageId.ExportCredit;
    } else if (tabId === TabId.TabPurchaseSlip) {
      return PageId.ExportPurchaseSlip;
    } else if (tabId === TabId.TabDebt) {
      return PageId.ExportDebt;
    } else if (tabId === TabId.TabStockMoveSlip) {
      return PageId.ExportStockMoveSlip;
    } else if (tabId === TabId.TabCustomer) {
      if (this.productCode === ProductCode.Glass) {
        return PageId.GlassExportSuppliers;
      } else if (this.productCode === ProductCode.Recycle) {
        return PageId.ExportCustomer;
      } else {
        return PageId.ExportCustomer;
      }
    } else if (tabId === TabId.TabVehicleMgt) {
      return PageId.ExportVehicleMgt;
    } else if (tabId === TabId.TabStock) {
      if (this.productCode === ProductCode.Glass) {
        return PageId.GlassExportStock;
      } else {
        return PageId.ExportStock;
      }
    } else if (tabId === TabId.TabItem) {
      return PageId.GlassExportProduct;
    } else if (tabId === TabId.TabDeposit) {
      return PageId.GlassExportDeposit;
    } else if (tabId === TabId.TabSettingInfo) {
      return PageId.GlassExportSettingInfo;
    }
  }

  /**
   * initialize Fn key tab customer vehicle
   */
  private initializeFnKeyScreenTab(pageId: PageId) {
    this.screenService.setLabelFnKey(FunctionRole.Next, '出力開始');

    this.screenService.initializeScreen(
      pageId,
      [
        [
          FnKey.Guide.disable(),
          FnKey.Detail.setLabel('詳細条件'), // F6
        ],
      ],
      this.title
    ).subscribe(functionRef => {
      switch (functionRef.role) {
        case FunctionRole.Guide:
          this.onShowGuideEvent();
          break;
        case FunctionRole.Detail:
          if (pageId === PageId.ExportCustomerVehicle && this.exportCustomerVehicle) {
            this.exportCustomerVehicle.onPanelShown();
          } else if (pageId === PageId.ExportSlip && this.exportSlip) {
            this.exportSlip.onPanelShown();
          } else if (pageId === PageId.ExportHistory && this.exportHistory) {
            this.exportHistory.onPanelShown();
          } else if (pageId === PageId.ExportSalesSlip && this.exportSalesSlip) {
            this.exportSalesSlip.onClickDetailButton();
          } else if (pageId === PageId.ExportCredit && this.exportCredit) {
            this.exportCredit.onClickDetailButton();
          } else if (pageId === PageId.ExportPurchaseSlip && this.exportPurchaseSlip) {
            this.exportPurchaseSlip.onClickDetailButton();
          } else if (pageId === PageId.ExportDebt && this.exportDebt) {
            this.exportDebt.onClickDetailButton();
          } else if (pageId === PageId.ExportStockMoveSlip && this.exportStockMoveSlip) {
            this.exportStockMoveSlip.onClickDetailButton();
          } else if (pageId === PageId.ExportCustomer && this.exportCustomer) {
            this.exportCustomer.onClickDetailButton();
          } else if (pageId === PageId.ExportVehicleMgt && this.exportVehicleMgt) {
            this.exportVehicleMgt.onClickDetailButton();
          } else if (pageId === PageId.ExportStock && this.exportStock) {
            this.exportStock.onClickDetailButton();
          } else if (pageId === PageId.GlassExportSales && this.exportGlassSalesSlip) {
            this.exportGlassSalesSlip.onClickDetailButton();
          } else if (pageId === PageId.GlassExportDeposit && this.exportGlassDeposit) {
            this.exportGlassDeposit.onClickDetailButton();
          } else if (pageId === PageId.GlassExportSuppliers && this.exportGlassCustomer) {
            this.exportGlassCustomer.onClickDetailButton();
          } else if (pageId === PageId.ExportCustomer && this.exportRecycleCustomer) {
            this.exportRecycleCustomer.onClickDetailButton();
          }
          break;
        case FunctionRole.Next:
          if (pageId === PageId.ExportCustomerVehicle && this.exportCustomerVehicle) {
            this.exportCustomerVehicle.onClickExport();
          } else if (pageId === PageId.ExportSlip && this.exportSlip) {
            this.exportSlip.onClickExport();
          } else if (pageId === PageId.ExportHistory && this.exportHistory) {
            this.exportHistory.onClickExport();
          } else if (pageId === PageId.ExportSalesSlip && this.exportSalesSlip) {
            this.exportSalesSlip.onClickExport();
          } else if (pageId === PageId.ExportCredit && this.exportCredit) {
            this.exportCredit.onClickExport();
          } else if (pageId === PageId.ExportPurchaseSlip && this.exportPurchaseSlip) {
            this.exportPurchaseSlip.onClickExport();
          } else if (pageId === PageId.ExportDebt && this.exportDebt) {
            this.exportDebt.onClickExport();
          } else if (pageId === PageId.ExportStockMoveSlip && this.exportStockMoveSlip) {
            this.exportStockMoveSlip.onClickExport();
          } else if (pageId === PageId.ExportCustomer && this.exportCustomer) {
            this.exportCustomer.onClickExport();
          } else if (pageId === PageId.ExportVehicleMgt && this.exportVehicleMgt) {
            this.exportVehicleMgt.onClickExport();
          } else if (pageId === PageId.ExportStock && this.exportStock) {
            this.exportStock.onClickExport();
          } else if (pageId === PageId.GlassExportSales && this.exportGlassSalesSlip) {
            this.exportGlassSalesSlip.onClickExport();
          } else if (pageId === PageId.GlassExportDeposit && this.exportGlassDeposit) {
            this.exportGlassDeposit.onClickExport();
          } else if (pageId === PageId.GlassExportSuppliers && this.exportGlassCustomer) {
            this.exportGlassCustomer.onClickExport();
          } else if (pageId === PageId.ExportCustomer && this.exportRecycleCustomer) {
            this.exportRecycleCustomer.onClickExport();
          } else if (pageId === PageId.GlassExportSettingInfo && this.exportGlassSettingInfo) {
            this.exportGlassSettingInfo.onClickExport();
          }
          break;
        default:
          break;
      }
      functionRef.end(true);
    });

    // 設定情報画面には詳細条件が存在しないため、詳細条件ファクションキーを非表示とする
    if (pageId === PageId.GlassExportSettingInfo) {
      this.screenService.hideFnKey(FunctionRole.Detail);
    }
  }

  /**
   * プロダクト初期化処理
   */
  private initProduct() {
    // 有効な業務を選択肢として取得
    this.loadingService.show();
    this.exportService.getAvailableSystemItems().subscribe(
      items => {
        this.systemItems = items;

        // クエリパラメータから初期選択するプロダクトコードを取得
        this.activatedRoute.queryParams.subscribe(
          params => {
            this.productCode = params[BlUrlQueryKey.ProductCode];
            if (_find(this.systemItems, item => item.value === this.productCode) === undefined) {
              // クエリパラメータ値が不正な場合は先頭を選択
              this.productCode = _first(this.systemItems).value;
            }
            // デフォルトタブを表示しないプロダクト
            if (this.productCode === ProductCode.Partsman ||
              this.productCode === ProductCode.Recycle ||
              this.productCode === ProductCode.Glass) {
              this.showDefaultTab = false;
            }
            this.initTabList();
            this.reactiveFnFunction();
            this.initDataExportPatternSelectorByService();
          }
        );
      }
    );
  }

  onChangeDataExportPattern($eventData: IExportPatternInfo[]): void {
    this.dataExportPatterns = $eventData;
  }

  /**
   * ガイドが無効な項目にフォーカスが当たった際の処理を行います。
   * @param event TRUE:ガイドが無効の項目、FALSE:ガイドが有効の項目
   */
  onGuideDisabledEvent(event: any): void {
    this.focusElement = event.focusElement;
    if (!event.focus) {
      this.screenService.disableFnKey(FunctionRole.Guide);
    } else {
      this.screenService.enableFnKey(FunctionRole.Guide);
    }
  }

  /**
   * WebSocket接続状態変更イベント
   */
  onChangeWebSocketConnected(event): void {
    this.webSocketConnected = event;
  }

  /**
   * F5キーガイド
   */
  public onShowGuideEvent() {
    if (this.targetPageId === PageId.GlassExportSales && this.exportGlassSalesSlip) {
    this.exportGlassSalesSlip.onClickOrganizationGuide(this.focusElement);
    } else if (this.targetPageId === PageId.GlassExportDeposit && this.exportGlassDeposit) {
      this.exportGlassDeposit.onClickOrganizationGuide(this.focusElement);
    } else if (this.targetPageId === PageId.GlassExportSuppliers && this.exportGlassCustomer) {
      this.exportGlassCustomer.onClickOrganizationGuide(this.focusElement);
    }
  }
}
