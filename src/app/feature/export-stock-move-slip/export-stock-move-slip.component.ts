import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  QueryList,
  ViewChildren,
  Input
} from '@angular/core';
import {
  AbstractContainer, BlDialogService, BlLoadingService, BlModalService,
} from '@blcloud/bl-ng-ui-component';
import { ExportStockMoveSlipService } from './export-stock-move-slip.service';
import {
  defer as _defer,
  forEach as _forEach,
  filter as _filter,
  map as _map,
} from 'lodash';
import { IExportStockMoveSlipConditionInput } from './export-stock-move-slip.define';
import { ExportStockMoveSlipConditionManager } from './export-stock-move-slip.condition';
import { LoginResourceService, WithAllCompanyDiv } from '@blcloud/bl-ng-share-module';
import {
  ExportPatternSelectorComponent
} from '../../page/export-page/components/export-pattern-selector/export-pattern-selector.component';
import { DatePickerConditionComponent } from '../../page/export-page/components/date-picker-condition/date-picker-condition.component';
import { AbstractConditionsComponent } from '../../page/export-page/components/abstract-conditions.component';
import { BlAppContext } from '@blcloud/bl-ng-common';
import { ExportPageService } from '../../page/export-page/export-page.service';
import {
  IDownloadContent, IDropDownInput
} from '../../page/export-page/export-page.define';
import {
  DetailStockMoveSlipConditionComponent,
} from '../../page/export-page/components/detail-stock-move-slip-condition/detail-stock-move-slip-condition.component';
import {
  IDetailStockMoveCondition
} from '../../page/export-page/components/detail-stock-move-slip-condition/detail-stock-move-slip-condition.define';
import { DownloadModalComponent } from '../../shared/modal/download-modal/download-modal.component';
import { StockMoveExportContent, StockMoveExportContentMap  } from '@blcloud/bl-datamodel/enum/stock/stock-move-export-content';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { IExportPatternInfo, IStockMgtSetting, IOrganizationInformation } from '@blcloud/bl-datamodel';
import { RoleConst } from '@blcloud/bl-datamodel/const/role';
import { DateTimeUtils } from '@blcloud/bl-common';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';

/**
 * 在庫移動伝票出力コンポ―ネント
 */
@Component({
  selector: 'app-export-stock-move-slip',
  templateUrl: './export-stock-move-slip.component.html',
  styleUrls: ['./export-stock-move-slip.component.scss'],
  providers: [ExportStockMoveSlipService, ExportStockMoveSlipConditionManager]
})
export class ExportStockMoveSlipComponent extends AbstractContainer implements OnInit {
  /** 詳細条件表示有無 */
  private isShowDetail = false;
  /** WebSocket接続済み */
  private webSocketConnected = false;
  /** 全社設定取得区分 */
  public readonly withAllCompanyDiv = WithAllCompanyDiv;
  /** 在庫移動伝票出力条件 */
  public exportCondition: IExportStockMoveSlipConditionInput;
  /** 対象期間選択項目 */
  public targetPeriodItems: IDropDownInput[];
  /** テキスト出力情報タブ区分 */
  public readonly exportInfoTabDiv = ExportInfoTabDiv;
  /** 開始日 */
  public startDate: string;
  /** 終了日 */
  public endDate: string;
  /** 在庫管理設定 */
  public stockMgtSetting: IStockMgtSetting[] = [];

  /** 出荷日表示フラグ */
  public showFlgs: boolean;
  /** 入荷日表示フラグ */
  public showFlge: boolean;

  /** 検索条件 */
  public detailStockMoveConditionValue: IDetailStockMoveCondition = {
    shippingWhCodeStart: '',
    shippingWhCodeEnd: '',
    enteringWhCodeStart: '',
    enteringWhCodeEnd: '',
    picEmployeeCodeStart: '',
    picEmployeeCodeEnd: '',
    itemMakerCdStart: '',
    itemMakerCdEnd: '',
    partsNumber: '',
    partsName: ''
  };

  /** 在庫移動伝票情報出力内容 */
  public readonly stockMoveExportContent = StockMoveExportContent;
  /** 在庫移動伝票情報出力内容マップ */
  public readonly StockMoveExportContentMap = StockMoveExportContentMap;

  /** 画面初期化完了フラグ */
  defaultSelectedOrganizationCode = '0';

  /** データ出力パターン */
  @Input() dataExportPatterns: IExportPatternInfo[];
  /** 業務選択肢 */
  @Input() systemItems: {value: string, text: string}[];

  /** タブフォーカスキーボードイベント */
  @Output() tabFocusKeyboardEvent = new EventEmitter();
  /** データ出力パターン変更イベント */
  @Output() changeExportPatternEvent: EventEmitter<IExportPatternInfo[]> = new EventEmitter();

  /** 検索条件コンポーネント一覧 */
  @ViewChildren('detailConditionStockMoveSlip') conditionsList: QueryList<AbstractConditionsComponent>;
  /** データ出力パターン選択コンポーネント */
  @ViewChild(ExportPatternSelectorComponent) exportPatternSelectorComponent: ExportPatternSelectorComponent;
  /** 日付入力コンポーネント */
  @ViewChild(DatePickerConditionComponent) datePickerCondition: DatePickerConditionComponent;
  /** 詳細条件コンポーネント */
  @ViewChild(DetailStockMoveSlipConditionComponent) detailCustomerCondition: DetailStockMoveSlipConditionComponent;

  /** ログイン組織コード */
  loginUserOrganizationCode: string;

  /** 組織コード */
  organizationCode = '000000';
  /** 組織コード配列 */
  organizationCodes: string[] = [this.organizationCode];


  constructor(
    private exportStockMoveSlipService: ExportStockMoveSlipService,
    private dialogService: BlDialogService,
    private loadingShow: BlLoadingService,
    private appContext: BlAppContext,
    private exportService: ExportPageService,
    private modalService: BlModalService,
    private loginResourceService: LoginResourceService,
  ) {
    super();
    this.exportService.invokeEventTabStockMoveSlip.subscribe(dataDownload => {
      this.showModalDownload(<IExportPatternInfo[]>this.dataExportPatterns,
        dataDownload.infoDataDownload);
    });
  }

  /**
   * 初期化
   */
  ngOnInit() {
    this.initConditions();
    this.onInitDatePicker();
    this.targetPeriodItems = this.exportStockMoveSlipService.initTargetPeriodItems();
    this.initDataStockMgtSettingService();
}

  /**
   * テキスト出力を更新
   * @param isLoadOld load pattern selected on old session
   */
  updateExportPattern(isLoadOld: boolean = false): void {
    this.exportPatternSelectorComponent.genTableExportPatternData(isLoadOld);
  }

  /**
   * 出荷の変更イベント | 出力内容
   * @param event
   */
  onChangeShipping(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.shipping = true;
    } else {
      this.exportCondition.shipping = false;
    }
  }

  /**
   * 未入荷の変更イベント | 出力内容
   * @param event
   */
  onChangeNonArrival(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.nonArrival = true;
    } else {
      this.exportCondition.nonArrival = false;
    }
  }

  /**
   * 入荷済の変更イベント | 出力内容
   * @param event
   */
  onChangeArrived(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.arrived = true;
    } else {
      this.exportCondition.arrived = false;
    }
  }

  /**
   * 出庫の変更イベント | 出力内容
   * @param event
   */
  onChangeShipment(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.shipment = true;
    } else {
      this.exportCondition.shipment = false;
    }
  }

  /**
   * 入庫の変更イベント | 出力内容
   * @param event
   */
  onChangeEntering(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.entering = true;
    } else {
      this.exportCondition.entering = false;
    }
  }

  /**
   * 対象期間の変更イベント
   * @param event
   */
  onChangeTargetPeriod(event: string): void {
    this.exportCondition.targetPeriod = event;
    this.exportStockMoveSlipService.setTargetPeriod(event);
  }

  /**
   * 出庫組織の変更イベント
   * @param $event
   */
  onChangeSlipShippingOrganizationCode($event: IOrganizationInformation): void {
    this.exportCondition.shippingOrganizationCode = $event.organizationCode;
  }

  /**
   * 入庫組織の変更イベント
   * @param $event
   */
  onChangeSlipEnteringOrganizationCode($event: IOrganizationInformation): void {
    this.exportCondition.enteringOrganizationCode = $event.organizationCode;
  }

  /**
   * 入力条件を初期化
   */
  private initConditions(): void {
    this.exportCondition = this.exportStockMoveSlipService.initCondition();
  }

  /**
   * 初期値にする
   */
  onClearCondition(): void {
    this.datePickerCondition.startDate = this.startDate;
    this.datePickerCondition.endDate = this.endDate;
    this.exportCondition = this.exportStockMoveSlipService.initCondition();
    this.onClickDetailButton();
    this.updateExportPattern(true);
  }

  /**
   * 出力ボタンを押下する時のイベント
   */
  onClickExport(): void {
    // ロール確認
    this.loadingShow.show();
    this.loginResourceService.isAvailableFunction(RoleConst.ROLEID_FUNC_PMC_STOCKMOVESLIP_TEXT_OUTPUT).subscribe(
      isAvailable => {
        if (isAvailable) {
          this.export();
        } else {
          this.loadingShow.hide();
          this.dialogService.error('権限が無い為、テキスト出力は行えません').subscribe(
            dialogRef => dialogRef.hide()
          );
        }
      }
    );
  }

  /**
   * 出力ボタンを押下する時のイベント
   */
  export(): void {
    const stockMoveExportContentList: string[] = [];
    if (this.showFlgs) {
      if (this.exportCondition.shipping) {
        stockMoveExportContentList.push(this.stockMoveExportContent.Shipping);
      }
      if (this.exportCondition.nonArrival) {
        stockMoveExportContentList.push(this.stockMoveExportContent.NonArrival);
      }
      if (this.exportCondition.arrived) {
        stockMoveExportContentList.push(this.stockMoveExportContent.Arrived);
      }
    }
    if (this.showFlge) {
      if (this.exportCondition.shipment) {
        stockMoveExportContentList.push(this.stockMoveExportContent.Shipment);
      }
      if (this.exportCondition.entering) {
        stockMoveExportContentList.push(this.stockMoveExportContent.Entering);
      }
    }
    if (!stockMoveExportContentList || stockMoveExportContentList.length === 0) {
      this.dialogService.warn('出力内容が指定されていません。', '確認').subscribe(dialogRef => {
        const el = document.activeElement;
        dialogRef.hide(el);
        this.loadingShow.hide();
      });
      return;
    }

    const productCodes = _map(
      _filter(this.systemItems, item => item.value !== ProductCode.Common), product => product.value
    );
    this.exportStockMoveSlipService.setProductCodes(productCodes);
    this.exportStockMoveSlipService.setExportPatternCode(this.exportPatternSelectorComponent.getExportPatternCodeList());
    this.exportStockMoveSlipService.setStockMoveExportContentList(stockMoveExportContentList);
    this.exportStockMoveSlipService.setDate(this.exportCondition.startDate, this.exportCondition.endDate,
    this.exportCondition.targetPeriod);
    this.exportStockMoveSlipService.setShippingOrganizationCode(this.exportCondition.shippingOrganizationCode);
    this.exportStockMoveSlipService.setEnteringOrganizationCode(this.exportCondition.enteringOrganizationCode);
    this.exportStockMoveSlipService.setShippingWhCode(this.detailStockMoveConditionValue.shippingWhCodeStart,
    this.detailStockMoveConditionValue.shippingWhCodeEnd);
    this.exportStockMoveSlipService.setEnteringWhCode(this.detailStockMoveConditionValue.enteringWhCodeStart,
    this.detailStockMoveConditionValue.enteringWhCodeEnd);
    this.exportStockMoveSlipService.setPicEmployeeCode(this.detailStockMoveConditionValue.picEmployeeCodeStart,
    this.detailStockMoveConditionValue.picEmployeeCodeEnd);
    this.exportStockMoveSlipService.setItemMakerCd(this.detailStockMoveConditionValue.itemMakerCdStart,
    this.detailStockMoveConditionValue.itemMakerCdEnd);
    this.exportStockMoveSlipService.setPartsNumber(this.detailStockMoveConditionValue.partsNumber);
    this.exportStockMoveSlipService.setPartsName(this.detailStockMoveConditionValue.partsName);
    const clientSessionId = this.appContext.getUuid() + 'stockMoveSlip';
    this.exportStockMoveSlipService.setClientSessionId(clientSessionId);
    if (!this.webSocketConnected) {
      this.exportService.connectWebSocket(ExportInfoTabDiv.StockMoveSlip, clientSessionId);
      this.webSocketConnected = true;
    }

    this.loadingShow.show({ message: '出力処理中です。<br />しばらくお待ちください。' });
    this.exportStockMoveSlipService.export().subscribe(_response => { },
      _error => { });
  }

  /**
   * 詳細パネル表示イベント
   */
  onClickDetailButton(): void {
    if (!this.isShowDetail) {
      _defer(() => {
        this.openConditions();
      });
    } else {
      _defer(() => {
        this.closeConditions();
      });
    }
    this.isShowDetail = !this.isShowDetail;
  }

  /**
   * すべての詳細出力条件を表示
   */
  private openConditions(): void {
    this.conditionsList.forEach(conditions => {
      conditions.open();
    });
  }

  /**
   * すべての詳細出力条件を非表示
   */
  private closeConditions(): void {
    this.conditionsList.forEach(conditions => {
      conditions.close();
    });
  }

  /**
   * ファイルダウンロードのモダール画面を表示
   * exportInfoDivEnumNameを取り出す
   * @param dataDivSortExportTab1
   * @param listFile APIより返却されたcsvファイルの一覧
   */
  private showModalDownload(dataDivSortExportTab1: IExportPatternInfo[], listFile: IDownloadContent[]): void {
    const tmpFile = [];
    _forEach(listFile, file => {
      let keepGoing = true;
      _forEach(dataDivSortExportTab1, items => {
        if (keepGoing) {
          if (items.exportInfoDiv === file.exportInfoDiv) {
            tmpFile.push({
              exportInfoDiv: items.exportInfoDiv,
              urlDownload: file.urlDownload.toString(),
              exportInfoDivEnumName: items.exportInfoDivEnumName
            });
            keepGoing = false;
          }
        }
      });
    });
    if (listFile.length === 1) {
      location.href = tmpFile[0].urlDownload;
    } else {
      const data = {
        listFile: tmpFile
      };
      const subscription = this.modalService.show(DownloadModalComponent, { data }).subscribe(_modalRef => {
        switch (_modalRef.reason) {
          default:
            _modalRef.hide();
            subscription.unsubscribe();
            break;
        }
      });
    }
  }

  /** 開始日変更イベント */
  onStartDateChange($event: string): void {
    this.exportCondition.startDate = $event;
  }

  /** 終了日変更イベント */
  onEndDateChange($event: string): void {
    this.exportCondition.endDate = $event;
  }

  /** 詳細条件変更イベント */
  onChangeDetailStockMoveCondition($event): void {
    this.detailStockMoveConditionValue = $event;
  }

  /** データ出力パターン変更イベント */
  onChangeDataExportPattern(data: IExportPatternInfo[]) {
    this.dataExportPatterns = data;
    this.changeExportPatternEvent.emit(data);
  }

  /**
   * 対象期間_日付初期化
   */
  onInitDatePicker(): void {
    // システム日付を取得
    const today = DateTimeUtils.today();
    // 当日の前月年月日
    this.startDate = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, - 1));
    // 当年月日
    this.endDate = DateTimeUtils.formatIso(today);
  }

  /**
   * 在庫移動確定区分初期化処理
   */
  public initDataStockMgtSettingService() {
      // ログイン組織コードを取得
      this.exportService.getLoginUserInfo().subscribe(
        loginUser => {
          this.loginUserOrganizationCode = loginUser.organizationCode;
        }
      );
      this.organizationCodes.push(this.loginUserOrganizationCode);
      this.exportService.getListSearchStockMgtSettingInfo(this.organizationCodes).subscribe(response => {
        if (response.length === 1) {
          if (response[0].stockMoveCommitDiv === '0') {
            this.showFlgs = true;
            this.showFlge = false;
          } else {
            this.showFlgs = false;
            this.showFlge = true;
          }
        } else if (response.length === 2) {
          if (response[1].organizationCode === this.loginUserOrganizationCode) {
            if (response[1].stockMoveCommitDiv === '0') {
              this.showFlgs = true;
              this.showFlge = false;
            } else {
              this.showFlgs = false;
              this.showFlge = true;
            }
          } else {
            if (response[0].organizationCode === this.loginUserOrganizationCode) {
              if (response[0].stockMoveCommitDiv === '0') {
                this.showFlgs = true;
                this.showFlge = false;
              } else {
                this.showFlgs = false;
                this.showFlge = true;
              }
            }
          }
        }
      });
  }

}
