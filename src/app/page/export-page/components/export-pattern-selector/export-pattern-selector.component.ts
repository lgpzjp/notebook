import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  ModalReason, BlModalService
} from '@blcloud/bl-ng-ui-component';
import { ExportPatternModalComponent, IExportPatternModalParams, ExportPatternInfoConstant } from '@blcloud/bl-ng-share-module';
import { ExportPageService } from '../../export-page.service';
import { SessionStorageUtils } from '@blcloud/bl-common';
import {
  isNil as _isNil,
  forEach as _forEach,
  delay as _delay
} from 'lodash';
import { IExportPatternInfo } from '@blcloud/bl-datamodel';
import { ExportWorkTypeDiv } from '@blcloud/bl-datamodel/enum/output/export-work-type-div';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { ExportInfoDiv } from '@blcloud/bl-datamodel/enum/output/export-info-div';
import { IRowInTablePatternInfo, ExportPatternSelected, ExportPatternSelectorOnSave } from './export-pattern-selector.define';
import { IExportSlipConditionInput } from '../../../../feature/export-slip/export-slip.define';
import { ExportHistoryConditionSearch } from '../../../../feature/export-history/export-history.define';
import { ExportCustomerVehicleConditionSearch } from '../../../../feature/export-customer-vehicle/export-customer-vehicle.define';
import { IExportSalesSlipConditionInput } from '../../../../feature/export-sales-slip/export-sales-slip.define';
import { ExportCreditConditionSearch } from '../../../../feature/export-credit/export-credit.define';
import { ExportDebtConditionSearch } from '../../../../feature/export-debt/export-debt.define';
import { ExportStockConditionSearch } from '../../../../feature/export-stock/export-stock.define';

import { ExportSlipTypeDiv } from '@blcloud/bl-datamodel/enum/output/export-slip-type-div';
import { CreditExportContent } from '@blcloud/bl-datamodel/enum/credit/credit-export-content';
import { DebtExportContent } from '@blcloud/bl-datamodel/enum/debt/debt-export-content';
import { StockExportContent } from '@blcloud/bl-datamodel/enum/stock/stock-export-content';
import { IExportStockMoveSlipConditionInput } from '../../../../feature/export-stock-move-slip/export-stock-move-slip.define';
import { IExportCustomerSlipConditionInput } from '../../../../feature/export-customer-slip/export-customer-slip.define';
import { IExportVehicleMgtConditionInput } from '../../../../feature/export-vehicle-mgt/export-vehicle-mgt.define';
import { CustomerExportContent } from '@blcloud/bl-datamodel/enum/customer/customer-export-content';
import { ShipmentPartsTypeDiv } from '@blcloud/bl-datamodel/enum/output/shipment-parts-type-div';
import { IExportRecycleCustomerConditionInput } from '../../../../feature/export-recycle-customer/export-recycle-customer.define';
import { IExportGlassSalesSlipConditionInput } from '../../../../feature/export-glass-sales-slip/export-glass-sales-slip.define';
import { IExportGlassCustomerConditionInput } from '../../../../feature/export-glass-customer/export-glass-customer.define';
import { IExportGlassDepositConditionInput } from '../../../../feature/export-glass-deposit/export-glass-deposit.define';

@Component({
  selector: 'app-export-pattern-selector',
  templateUrl: './export-pattern-selector.component.html',
  styleUrls: ['./export-pattern-selector.component.scss'],
})
export class ExportPatternSelectorComponent implements OnInit {
  constructor(
    private exportService: ExportPageService,
    private modalService: BlModalService,
  ) { }

  @Input() public tabID = '1';
  @Input() public exportCondition:
    ExportCustomerVehicleConditionSearch | ExportHistoryConditionSearch | IExportSlipConditionInput
    | IExportSalesSlipConditionInput | ExportCreditConditionSearch | ExportDebtConditionSearch | ExportStockConditionSearch
    | IExportStockMoveSlipConditionInput | IExportCustomerSlipConditionInput | IExportVehicleMgtConditionInput
    | IExportGlassSalesSlipConditionInput | IExportGlassCustomerConditionInput
    | IExportGlassDepositConditionInput | IExportRecycleCustomerConditionInput;
  @Input() dataExportPatterns: IExportPatternInfo[];
  @Output() changeExportPatternEvent: EventEmitter<IExportPatternInfo[]> = new EventEmitter();

  public readonly TABLE_CONTENT_DEFAULT_CUSTOMER_KEY = 'tableContentDefaultTab1';
  public readonly TABLE_CONTENT_DEFAULT_SLIP_KEY = 'tableContentDefaultTab2';
  public readonly TABLE_CONTENT_DEFAULT_VEHICLE_KEY = 'tableContentDefaultTab3';
  public readonly TABLE_CONTENT_DEFAULT_SALES_SLIP_KEY = 'tableContentDefaultTab4';
  public readonly TABLE_CONTENT_DEFAULT_CREDIT_KEY = 'tableContentDefaultTab5';
  public readonly TABLE_CONTENT_DEFAULT_PURCHASESLIP_KEY = 'tableContentDefaultTab6';
  public readonly TABLE_CONTENT_DEFAULT_DEBT_KEY = 'tableContentDefaultTab7';
  public readonly TABLE_CONTENT_DEFAULT_STOCKMOVESLIP_KEY = 'tableContentDefaultTab8';
  public readonly TABLE_CONTENT_DEFAULT_CUSTOMERSLIP_KEY = 'tableContentDefaultTab9';
  public readonly TABLE_CONTENT_DEFAULT_VEHICLEMGT_KEY = 'tableContentDefaultTab10';
  public readonly TABLE_CONTENT_DEFAULT_STOCK_KEY = 'tableContentDefaultTab11';
  public readonly TABLE_CONTENT_DEFAULT_GLASS_DEPOSIT_KEY = 'tableContentDefaultTab12';
  public readonly TABLE_CONTENT_DEFAULT_GLASS_ITEM_KEY = 'tableContentDefaultTab13';
  public readonly TABLE_CONTENT_DEFAULT_RECYCLECUSTOMER_KEY = 'tableContentDefaultTab14';
  public readonly TABLE_CONTENT_DEFAULT_GLASS_SALES_SLIP_KEY = 'tableContentDefaultTab15';
  public readonly TABLE_CONTENT_DEFAULT_GLASS_CUSTOMER_KEY = 'tableContentDefaultTab16';
  public readonly TABLE_CONTENT_DEFAULT_GLASS_STOCK_KEY = 'tableContentDefaultTab17';

  // 出力パターン情報レイアウト
  public exportPatternList: IRowInTablePatternInfo[] = [];

  // 出力パターン情報
  public exportPatternInfo: IExportPatternInfo[][] = [];
  public exportPatternSelecteds: ExportPatternSelected[];
  private userPrefixKey = '';

  ngOnInit(): void {
    this.setPrefixKeyByUserInfo();
    this.genTableExportPatternData(!_isNil(this.getExportPatternSelectedOnLocal()));
  }

  /**
   * 出力パターンコード取得
   */
  getExportPatternCodeList(): string[] {
    const exportPatternCodeList = [];
    for (const key in this.exportPatternList) {
      if (this.exportPatternList.hasOwnProperty(key)) {
        const element = this.exportPatternSelecteds[key];
        exportPatternCodeList.push(element.exportPatternValue);
      }
    }
    return exportPatternCodeList;
  }


  /**
   * 出力パターン編集モーダル画面表示
   * @param exportPatternCode テキスト出力パターンコード
   * @param exportInfoDiv テキスト出力情報区分
  */
  showExportPatternModal(exportPatternCode: string | number, exportInfoDiv: string | number): void {

    const data: IExportPatternModalParams = {
      exportPatternCode,
      exportInfoDiv,
      dataModalExportPatterns: this.dataExportPatterns,
      exportInfoTabDiv: this.tabID
    };
    // 出力パターン編集モーダル画面で情報変更通知
    let isUpdateOrCreatenNewPattern = false;

    const subscription = this.modalService.show(ExportPatternModalComponent, { data }).subscribe(_modalRef => {
      switch (_modalRef.reason) {
        case ModalReason.Cancel:
        case ModalReason.Esc:
        case ModalReason.BackdropClick:
          // 出力パターン編集モーダル画面で変更有無処理
          if (isUpdateOrCreatenNewPattern) {
            // 出力パターン編集モーダル画面で情報を変更した場合
            // セッション情報消却
            this.dataExportPatterns = [];
            _delay(() => {
              // 最新出力パターン情報をDBから取得
              this.exportService.getListAllOuputPatternInfo().subscribe(response => {
                if (response) {
                  // セッションに最新出力パターン情報を保存
                  this.dataExportPatterns = response;
                  this.changeExportPatternEvent.emit(this.dataExportPatterns);
                  if (SessionStorageUtils.get(ExportPatternInfoConstant.ACTION_CREATE_SESSION_KEY)) {
                    this.selectLastCodeAfterCreate(response);
                  }
                  this.genTableExportPatternData(true);
                  SessionStorageUtils.remove(ExportPatternInfoConstant.ACTION_CREATE_SESSION_KEY);
                  _modalRef.hide();
                  subscription.unsubscribe();
                }
              });
            }, 1000);
          } else {
            // 出力パターン編集モーダル画面で情報を変更しない場合、モーダル画面を閉じる
            _modalRef.hide();
            subscription.unsubscribe();
          }
          break;
        case ModalReason.Done:
        case ModalReason.Any:
          isUpdateOrCreatenNewPattern = true;
          break;
        default:
          break;
      }
    });
  }

  /**
   * 新規作成の出力パターンを指定させるメソッド
   * @param data
   */
  private selectLastCodeAfterCreate(data: IExportPatternInfo[]): void {
    data = data.sort(this.sortWithPatternCode);
    const exportInfoDiv = SessionStorageUtils.get(ExportPatternInfoConstant.ACTION_CREATE_SESSION_KEY);
    const dataWithExportInfoDiv = data.filter(i => i.exportInfoDiv === exportInfoDiv);
    const lastCode = dataWithExportInfoDiv[(dataWithExportInfoDiv.length - 1)];
    if (lastCode) {
      const localCode = <ExportPatternSelected[]>this.getExportPatternSelectedOnLocal();
      if (localCode) {
        for (const key in localCode) {
          if (localCode.hasOwnProperty(key)) {
            if (key === exportInfoDiv) {
              localCode[key].exportPatternValue = lastCode.exportPatternCode;
            }
          }
        }
        this.saveTableContentDefaultValueToLocal(localCode);
      }
    }
  }

  /**
   * テキスト出力コードの属性でソート
   * @param a present data
   * @param b next data
   */
  private sortWithPatternCode(a: IExportPatternInfo, b: IExportPatternInfo) {
    if (a.exportPatternCode < b.exportPatternCode) {
      return -1;
    }
    if (a.exportPatternCode > b.exportPatternCode) {
      return 1;
    }
    return 0;
  }


  /**
 * 出力パターン情報ごと表示のグルーピング処理
 * @param isLoadOld
 */
  genTableExportPatternData(isLoadOld: boolean) {

    //  出力パターン情報取得（セッションデータ）
    const sessionExportPatternInfo = this.getSessionExportPatternInfo();
    //  出力パターン情報　画面ごと表示
    const displayExportPatternInfo: IExportPatternInfo[] = [];
    const contentWithCondition = [];
    this.exportPatternInfo = [];
    this.exportPatternList = [];
    let oldExportPatternSelected = this.getExportPatternSelectedOnLocal();

    _forEach(sessionExportPatternInfo, items => {
      switch (this.tabID) {
        // 顧客車両情報タブ
        case ExportInfoTabDiv.CustomerVehicle:
          if (items.exportInfoTabDiv === ExportInfoTabDiv.CustomerVehicle) {
            displayExportPatternInfo.push(items);
          }
          break;
        // 伝票情報タブ
        case ExportInfoTabDiv.Slip:
          if ((items.exportInfoTabDiv === ExportInfoTabDiv.CustomerVehicle ||
            items.exportInfoTabDiv === ExportInfoTabDiv.Slip)) {
            displayExportPatternInfo.push(items);
          }
          break;
        // 履歴情報タブ
        case ExportInfoTabDiv.WorkHistory:
          if (items.exportInfoTabDiv === ExportInfoTabDiv.WorkHistory) {
            displayExportPatternInfo.push(items);
          }
          break;
        // 売上伝票情報タブ
        case ExportInfoTabDiv.SalesSlip:
          if (items.exportInfoTabDiv === ExportInfoTabDiv.SalesSlip) {
            displayExportPatternInfo.push(items);
          }
          break;
        // 債権情報タブ
        case ExportInfoTabDiv.Credit:
          if (items.exportInfoTabDiv === ExportInfoTabDiv.Credit) {
            displayExportPatternInfo.push(items);
          }
          break;
        // 仕入伝票情報タブ
        case ExportInfoTabDiv.PurchaseSlip:
          if (items.exportInfoTabDiv === ExportInfoTabDiv.PurchaseSlip) {
            displayExportPatternInfo.push(items);
          }
          break;
        // 債務情報タブ
        case ExportInfoTabDiv.Debt:
          if (items.exportInfoTabDiv === ExportInfoTabDiv.Debt) {
            displayExportPatternInfo.push(items);
          }
          break;
        // 在庫移動伝票情報タブ
        case ExportInfoTabDiv.StockMoveSlip:
          if (items.exportInfoTabDiv === ExportInfoTabDiv.StockMoveSlip) {
            displayExportPatternInfo.push(items);
          }
          break;
        // 取引先情報タブ
        case ExportInfoTabDiv.Customer:
          if (items.exportInfoTabDiv === ExportInfoTabDiv.Customer) {
            displayExportPatternInfo.push(items);
          }
          break;
        // 車両管理情報タブ
        case ExportInfoTabDiv.VehicleMgt:
          if (items.exportInfoTabDiv === ExportInfoTabDiv.VehicleMgt) {
            displayExportPatternInfo.push(items);
          }
          break;
        // 在庫情報タブ
        case ExportInfoTabDiv.Stock:
          if (items.exportInfoTabDiv === ExportInfoTabDiv.Stock) {
            displayExportPatternInfo.push(items);
          }
          break;
        // MEMO: 上の処理が冗長。分岐する必要がない
        // 念のため、他に影響がないようにしておく
        case ExportInfoTabDiv.GlassSalesSlip: // 硝子売上情報タブ
        case ExportInfoTabDiv.GlassDeposit: // 硝子入金情報タブ
        case ExportInfoTabDiv.GlassCustomer: // 硝子取引先情報タブ
        case ExportInfoTabDiv.GlassItem: // 硝子商品情報タブ
        case ExportInfoTabDiv.GlassStock: // 硝子在庫情報タブ
        case ExportInfoTabDiv.RecycleCustomer:
        case ExportInfoTabDiv.RecycleCredit:
        case ExportInfoTabDiv.RecycleDebt:
        case ExportInfoTabDiv.RecycleSalesSlip:
        case ExportInfoTabDiv.RecyclePurchaseSlip:
          if (items.exportInfoTabDiv === this.tabID) {
            displayExportPatternInfo.push(items);
          }
          break;
        default:
          break;
      }
    });

    // テキスト出力情報区分でグルーピング
    displayExportPatternInfo.forEach(item => {
      if (_isNil(this.exportPatternInfo[item.exportInfoDiv])) {
        this.exportPatternInfo[item.exportInfoDiv] = [];
        this.exportPatternInfo[item.exportInfoDiv].push(item);
      } else {
        this.exportPatternInfo[item.exportInfoDiv].push(item);
      }
    });

    // 　データが選択されたテキスト出力パターンを生成
    this.exportPatternInfo.forEach(exportFOP => {
      // 　これはローカルストレージにまだ保存されていない新規出力パターンである
      let isNewData = false;
      let isDeleted = true;
      isNewData = oldExportPatternSelected ? _isNil(oldExportPatternSelected[exportFOP[0].exportInfoDiv]) : true;
      this.exportPatternList[exportFOP[0].exportInfoDiv] = this.genRowInTablePatternInfo(exportFOP);
      if (oldExportPatternSelected) {
        exportFOP.forEach(deleteChecking => {
          if (oldExportPatternSelected[exportFOP[0].exportInfoDiv] &&
            deleteChecking.exportPatternCode === oldExportPatternSelected[exportFOP[0].exportInfoDiv].exportPatternValue) {
            isDeleted = false;
          }
        });
      }
      if (!isLoadOld || isNewData || isDeleted) {
        if (!oldExportPatternSelected) {
          oldExportPatternSelected = [];
        }
        oldExportPatternSelected[exportFOP[0].exportInfoDiv] = { exportPatternValue: exportFOP[0].exportPatternCode };
      }
    });
    // 　タブIDと条件でテキスト出力パターンを絞り込み
    for (const key in this.exportPatternList) {
      if (this.exportPatternList.hasOwnProperty(key)) {
        const itemCond = this.exportPatternList[key];
        switch (this.tabID) {
          case ExportInfoTabDiv.CustomerVehicle:
            if (this.convertCondition<ExportCustomerVehicleConditionSearch>
              (<ExportCustomerVehicleConditionSearch>this.exportCondition).outputInfo === ExportInfoDiv.Customer) {
              if (itemCond.exportInfoDiv === ExportInfoDiv.Customer) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            } else {
              if (itemCond.exportInfoDiv === ExportInfoDiv.Vehicle) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            }
            break;
          case ExportInfoTabDiv.Slip:
            if (this.convertCondition<IExportSlipConditionInput>
              (<IExportSlipConditionInput>this.exportCondition).exportInfoType === ExportWorkTypeDiv.DetailWorkType) {
              if (itemCond.exportInfoDiv === ExportInfoDiv.SlipDetail) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            } else {
              if (itemCond.exportInfoDiv === ExportInfoDiv.Slip) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            }
            if (this.convertCondition<IExportSlipConditionInput>
              (<IExportSlipConditionInput>this.exportCondition).exportCustomerVehicle === true) {
              if (itemCond.exportInfoDiv === ExportInfoDiv.Customer ||
                itemCond.exportInfoDiv === ExportInfoDiv.Vehicle) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            }
            break;
          case ExportInfoTabDiv.WorkHistory:
            if (this.convertCondition<ExportHistoryConditionSearch>
              (<ExportHistoryConditionSearch>this.exportCondition).outputInfo === ExportInfoDiv.CustomerHistory) {
              if (itemCond.exportInfoDiv === ExportInfoDiv.CustomerHistory
                && this.convertCondition<ExportHistoryConditionSearch>
                  (<ExportHistoryConditionSearch>this.exportCondition).workType === ExportWorkTypeDiv.MainWorkType) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              } else if (itemCond.exportInfoDiv === ExportInfoDiv.CustomerDetailHistory
                && this.convertCondition<ExportHistoryConditionSearch>
                  (<ExportHistoryConditionSearch>this.exportCondition).workType === ExportWorkTypeDiv.DetailWorkType) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            } else {
              if (itemCond.exportInfoDiv === ExportInfoDiv.VehicleHistory
                && this.convertCondition<ExportHistoryConditionSearch>
                  (<ExportHistoryConditionSearch>this.exportCondition).workType === ExportWorkTypeDiv.MainWorkType) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              } else if (itemCond.exportInfoDiv === ExportInfoDiv.VehicleDetailHistory
                && this.convertCondition<ExportHistoryConditionSearch>
                  (<ExportHistoryConditionSearch>this.exportCondition).workType === ExportWorkTypeDiv.DetailWorkType) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            }
            break;
          case ExportInfoTabDiv.SalesSlip:
          case ExportInfoTabDiv.RecycleSalesSlip:
            if (this.convertCondition<IExportSalesSlipConditionInput>
              (<IExportSalesSlipConditionInput>this.exportCondition).exportInfoType === ExportSlipTypeDiv.SlipDetail) {
              if (itemCond.exportInfoDiv === ExportInfoDiv.SalesSlipDetail) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            } else {
              if (itemCond.exportInfoDiv === ExportInfoDiv.SalesSlip) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            }
            break;
          case ExportInfoTabDiv.Credit:
          case ExportInfoTabDiv.RecycleCredit:
            if (this.convertCondition<ExportCreditConditionSearch>
              (<ExportCreditConditionSearch>this.exportCondition).outputInfo === CreditExportContent.BillingHistory) {
              if (itemCond.exportInfoDiv === ExportInfoDiv.BillingHistory) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            } else {
              if (itemCond.exportInfoDiv === ExportInfoDiv.AccRecHistory) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            }
            break;
          case ExportInfoTabDiv.PurchaseSlip:
          case ExportInfoTabDiv.RecyclePurchaseSlip:
            if (this.convertCondition<IExportSlipConditionInput>
              (<IExportSlipConditionInput>this.exportCondition).exportInfoType === ExportWorkTypeDiv.DetailWorkType) {
              if (itemCond.exportInfoDiv === ExportInfoDiv.PurchaseSlipDetail) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            } else {
              if (itemCond.exportInfoDiv === ExportInfoDiv.PurchaseSlip) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            }
            break;
          case ExportInfoTabDiv.Debt:
          case ExportInfoTabDiv.RecycleDebt:
            if (this.convertCondition<ExportDebtConditionSearch>
              (<ExportDebtConditionSearch>this.exportCondition).outputInfo === DebtExportContent.PayHistory) {
              if (itemCond.exportInfoDiv === ExportInfoDiv.PayHistory) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            } else {
              if (itemCond.exportInfoDiv === ExportInfoDiv.AccPayHistory) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            }
            break;
          case ExportInfoTabDiv.StockMoveSlip:
            if (itemCond.exportInfoDiv === ExportInfoDiv.StockMoveSlip) {
              contentWithCondition[itemCond.exportInfoDiv] = itemCond;
            }
            break;
          case ExportInfoTabDiv.Customer:
            if (this.convertCondition<IExportCustomerSlipConditionInput>
              (<IExportCustomerSlipConditionInput>this.exportCondition).outputInfo === CustomerExportContent.Customer) {
              if (itemCond.exportInfoDiv === ExportInfoDiv.Customer) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            } else if (this.convertCondition<IExportCustomerSlipConditionInput>
              (<IExportCustomerSlipConditionInput>this.exportCondition).outputInfo === CustomerExportContent.Supplier) {
              if (itemCond.exportInfoDiv === ExportInfoDiv.Supplier) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            } else {
              if (itemCond.exportInfoDiv === ExportInfoDiv.Organization) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            }
            break;
          case ExportInfoTabDiv.VehicleMgt:
            if (this.convertCondition<IExportVehicleMgtConditionInput>
              (<IExportVehicleMgtConditionInput>this.exportCondition).exportInfoType === ShipmentPartsTypeDiv.Vehicle) {
              if (itemCond.exportInfoDiv === ExportInfoDiv.VehicleMgt) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            } else if (this.convertCondition<IExportVehicleMgtConditionInput>
              (<IExportVehicleMgtConditionInput>this.exportCondition).exportInfoType === ShipmentPartsTypeDiv.SlipDetail) {
              if (itemCond.exportInfoDiv === ExportInfoDiv.ShipmentPartsSlipDetail) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            } else {
              if (itemCond.exportInfoDiv === ExportInfoDiv.ShipmentPartsTotal) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            }
            break;
          case ExportInfoTabDiv.Stock:
            if (this.convertCondition<ExportStockConditionSearch>
              (<ExportStockConditionSearch>this.exportCondition).outputInfo === StockExportContent.Stock) {
              if (itemCond.exportInfoDiv === ExportInfoDiv.Stock) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            }
            break;
          case ExportInfoTabDiv.Deposit:
            if (this.convertCondition<IExportGlassDepositConditionInput>
              (<IExportGlassDepositConditionInput>this.exportCondition).exportInfoType === '0') {
              if (itemCond.exportInfoDiv === ExportInfoDiv.Deposit) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            }
            break;
          case ExportInfoTabDiv.RecycleCustomer:
            const outputInfo = this.convertCondition(<IExportRecycleCustomerConditionInput>this.exportCondition).outputInfo;
            if (outputInfo === CustomerExportContent.Customer) {
              if (itemCond.exportInfoDiv === ExportInfoDiv.Customer) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            }
            break;
          case ExportInfoTabDiv.GlassSalesSlip:
            if (this.convertCondition<IExportGlassSalesSlipConditionInput>
              (<IExportGlassSalesSlipConditionInput>this.exportCondition).exportInfoType === '0') {
              if (itemCond.exportInfoDiv === ExportInfoDiv.SalesSlip) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            } else if (this.convertCondition<IExportGlassSalesSlipConditionInput>
              (<IExportGlassSalesSlipConditionInput>this.exportCondition).exportInfoType === '1') {
              if (itemCond.exportInfoDiv === ExportInfoDiv.SalesSlipDetail) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            } else if (this.convertCondition<IExportGlassSalesSlipConditionInput>
              (<IExportGlassSalesSlipConditionInput>this.exportCondition).exportInfoType === '2') {
              if (itemCond.exportInfoDiv === ExportInfoDiv.StatisticalAnalysis) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            }
            break;
          case ExportInfoTabDiv.GlassDeposit:
            if (this.convertCondition<IExportGlassDepositConditionInput>
              (<IExportGlassDepositConditionInput>this.exportCondition).exportInfoType === '0') {
              if (itemCond.exportInfoDiv === ExportInfoDiv.Deposit) {
                contentWithCondition[itemCond.exportInfoDiv] = itemCond;
              }
            }
            break;
          case ExportInfoTabDiv.GlassCustomer:
            if (itemCond.exportInfoDiv === ExportInfoDiv.Customer) {
              contentWithCondition[itemCond.exportInfoDiv] = itemCond;
            }
            break;
          default:
            break;
        }
      }
    }

    this.exportPatternList = contentWithCondition;
    this.exportPatternSelecteds = oldExportPatternSelected;
    this.saveTableContentDefaultValueToLocal(oldExportPatternSelected);
  }

  /**
   * 出力パターン情報取得（セッションデータ）
   * @param value
   * @returns 表示/非表示
   */
  getSessionExportPatternInfo(): IExportPatternInfo[] {
    const result = this.dataExportPatterns;
    return result;
  }

  /**
  * テキスト出力情報のすべての該当項目を取得
  * @param data
  */
  genRowInTablePatternInfo(data: IExportPatternInfo[]): IRowInTablePatternInfo {
    const exportPattern = [];
    let exportInfoDivEnumName = '';
    let exportInfoDiv = '';
    let exportPatternCode = '';
    let exportWorkTypeDiv = '';
    data.forEach(item => {
      exportPattern.push({ name: item.exportPatternName, code: item.exportPatternCode });
      exportInfoDivEnumName = item.exportInfoDivEnumName;
      exportInfoDiv = this.returnNullOrEmpty(item.exportInfoDiv);
      exportPatternCode = this.returnNullOrEmpty(item.exportPatternCode);
      exportWorkTypeDiv = this.returnNullOrEmpty(item.exportWorkTypeDiv);
    });
    return { exportInfoDivEnumName, exportPatternCode, exportInfoDiv, exportPattern, exportWorkTypeDiv };
  }

  returnNullOrEmpty(_input: string | number): string {
    if (_isNil(_input)) { return ''; }
    return _input.toString();
  }

  /**
  *　選択された出力パターンを保存
  * @param data
  */
  saveTableContentDefaultValueToLocal(data: ExportPatternSelected[]): void {
    const sData: Array<ExportPatternSelectorOnSave> = [];
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        sData.push({ key: key, value: data[key] });
      }
    }
    const content = JSON.stringify({ data: sData });
    localStorage.setItem(this.userPrefixKey + this.getLocalStorageKeyWithTabId(), content);
  }

  /**
  * 選択された出力パターンを取得
  */
  getExportPatternSelectedOnLocal(): ExportPatternSelected[] {
    const raw = JSON.parse(localStorage.getItem(this.userPrefixKey + this.getLocalStorageKeyWithTabId()));
    if (_isNil(raw)) {
      return null;
    }
    let result: ExportPatternSelected[];
    result = [];
    raw.data.forEach(item => {
      result[item.key] = item.value;
    });
    return result;
  }

  /**
  *　出力パターンの変更イベント
  */
  onChangeExportPattern(): void {
    this.saveTableContentDefaultValueToLocal(this.exportPatternSelecteds);
  }

  /**
   * タブIdによるロカールストレージキーを取得
   */
  private getLocalStorageKeyWithTabId(): string {
    switch (this.tabID) {
      case ExportInfoTabDiv.CustomerVehicle:
        return this.TABLE_CONTENT_DEFAULT_CUSTOMER_KEY;
      case ExportInfoTabDiv.Slip:
        return this.TABLE_CONTENT_DEFAULT_SLIP_KEY;
      case ExportInfoTabDiv.WorkHistory:
        return this.TABLE_CONTENT_DEFAULT_VEHICLE_KEY;
      case ExportInfoTabDiv.SalesSlip:
      case ExportInfoTabDiv.RecycleSalesSlip:
        return this.TABLE_CONTENT_DEFAULT_SALES_SLIP_KEY;
      case ExportInfoTabDiv.Credit:
      case ExportInfoTabDiv.RecycleCredit:
        return this.TABLE_CONTENT_DEFAULT_CREDIT_KEY;
      case ExportInfoTabDiv.PurchaseSlip:
      case ExportInfoTabDiv.RecyclePurchaseSlip:
        return this.TABLE_CONTENT_DEFAULT_PURCHASESLIP_KEY;
      case ExportInfoTabDiv.Debt:
      case ExportInfoTabDiv.RecycleDebt:
        return this.TABLE_CONTENT_DEFAULT_DEBT_KEY;
      case ExportInfoTabDiv.StockMoveSlip:
        return this.TABLE_CONTENT_DEFAULT_STOCKMOVESLIP_KEY;
      case ExportInfoTabDiv.Customer:
        return this.TABLE_CONTENT_DEFAULT_CUSTOMERSLIP_KEY;
      case ExportInfoTabDiv.VehicleMgt:
        return this.TABLE_CONTENT_DEFAULT_VEHICLEMGT_KEY;
      case ExportInfoTabDiv.Stock:
        return this.TABLE_CONTENT_DEFAULT_STOCK_KEY;
      case ExportInfoTabDiv.GlassSalesSlip:
        return this.TABLE_CONTENT_DEFAULT_GLASS_SALES_SLIP_KEY
      case ExportInfoTabDiv.GlassDeposit:
        return this.TABLE_CONTENT_DEFAULT_GLASS_DEPOSIT_KEY
      case ExportInfoTabDiv.GlassCustomer:
        return this.TABLE_CONTENT_DEFAULT_GLASS_CUSTOMER_KEY
      case ExportInfoTabDiv.GlassItem:
        return this.TABLE_CONTENT_DEFAULT_GLASS_ITEM_KEY
      case ExportInfoTabDiv.GlassStock:
        return this.TABLE_CONTENT_DEFAULT_GLASS_STOCK_KEY
      case ExportInfoTabDiv.RecycleCustomer:
        return this.TABLE_CONTENT_DEFAULT_RECYCLECUSTOMER_KEY;
      default:
        return this.TABLE_CONTENT_DEFAULT_CUSTOMER_KEY;
    }
  }

  /**
   * ユーザー情報による接頭辞を取得
   */
  setPrefixKeyByUserInfo(): void {
    this.exportService.getLoginUserInfo().subscribe(res => {
      this.userPrefixKey = res ? (res.blTenantId.toUpperCase() + '_' + res.blUserId + '_') : '';
    });
  }

  convertCondition<T>(condition: T): T {
    return condition;
  }
}
