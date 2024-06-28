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
import { ExportVehicleMgtService } from './export-vehicle-mgt.service';
import {
  defer as _defer,
  forEach as _forEach,
  filter as _filter,
  map as _map,
} from 'lodash';
import { IExportVehicleMgtConditionInput } from './export-vehicle-mgt.define';
import { ExportVehicleMgtConditionManager } from './export-vehicle-mgt.condition';
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
  DetailVehicleMgtConditionComponent
} from '../../page/export-page/components/detail-vehicle-mgt-condition/detail-vehicle-mgt-condition.component';
import { DownloadModalComponent } from '../../shared/modal/download-modal/download-modal.component';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { IExportPatternInfo } from '@blcloud/bl-datamodel';
import { RoleConst } from '@blcloud/bl-datamodel/const/role';
import { DateTimeUtils } from '@blcloud/bl-common';
import { VehicleExportContentArray, VehicleExportContent } from '@blcloud/bl-datamodel/enum/vehicle/vehicle-export-content';
import { VehicleTargetPeriodDiv, VehicleTargetPeriodDivMap } from '@blcloud/bl-datamodel/enum/vehicle/vehicle-target-period-div';
import { ShipmentPartsTypeDiv, ShipmentPartsTypeDivMap } from '@blcloud/bl-datamodel/enum/output/shipment-parts-type-div';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';
import { VehicleStockBackorderDiv } from '@blcloud/bl-datamodel/enum/stock/vehicle-stock-backorder-div';

/**
 * 車両管理出力コンポーネント
 */
@Component({
  selector: 'app-export-vehicle-mgt',
  templateUrl: './export-vehicle-mgt.component.html',
  styleUrls: ['./export-vehicle-mgt.component.scss'],
  providers: [ExportVehicleMgtService, ExportVehicleMgtConditionManager]
})
export class ExportVehicleMgtComponent extends AbstractContainer implements OnInit {
  /** 詳細条件表示有無 */
  private isShowDetail = false;
  /** WebSocket接続済み */
  private webSocketConnected = false;
  /** 全社設定取得区分 */
  public readonly withAllCompanyDiv = WithAllCompanyDiv;
  /** 検索条件 */
  public exportCondition: IExportVehicleMgtConditionInput;
  /** 対象期間選択項目 */
  public targetPeriodItems: IDropDownInput[];
  /** 出力タイプ項目 */
  public exportInfoTypeItems: IDropDownInput[];

  /** テキスト出力情報タブ区分 */
  public readonly exportInfoTabDiv = ExportInfoTabDiv;
  /** 開始日 */
  public startDate: string;
  /** 終了日 */
  public endDate: string;
  /** 出力タイプ活性フラグ */
  public isShowType: boolean;
  /** 組織活性フラグ */
  public isShowOrganization: boolean;
  /** 対象期間活性フラグ */
  public isShowDate = false;
  /** 車両情報出力内容配列 */
  public readonly VehicleExportContentArray = VehicleExportContentArray;

  /** 対象期間(出荷部品情報) */
  public targetPeriodShipmentParts: IDropDownInput[] = [
    { code: VehicleTargetPeriodDiv.SlipDate, name: VehicleTargetPeriodDivMap[VehicleTargetPeriodDiv.SlipDate] },
    { code: VehicleTargetPeriodDiv.UpdateDate, name: VehicleTargetPeriodDivMap[VehicleTargetPeriodDiv.UpdateDate] }
  ];
  /** 対象期間(車両情報) */
  public targetPeriodVehicle: IDropDownInput[] = [
    { code: VehicleTargetPeriodDiv.UpdateDate, name: VehicleTargetPeriodDivMap[VehicleTargetPeriodDiv.UpdateDate] }
  ];
  /** 出力タイプ(出荷部品情報) */
  public exportInfoTypeShipmentParts: IDropDownInput[] = [
    { code: ShipmentPartsTypeDiv.SlipDetail, name: ShipmentPartsTypeDivMap[ShipmentPartsTypeDiv.SlipDetail] },
    { code: ShipmentPartsTypeDiv.PartsTotal, name: ShipmentPartsTypeDivMap[ShipmentPartsTypeDiv.PartsTotal] }
  ];
  /** 出力タイプ(車両情報) */
  public exportInfoTypeVehicle: IDropDownInput[] = [
    { code: ShipmentPartsTypeDiv.Vehicle, name: ShipmentPartsTypeDivMap[ShipmentPartsTypeDiv.Vehicle] }
  ];

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
  @ViewChildren('detailConditionVehicleMgt') conditionsList: QueryList<AbstractConditionsComponent>;
  /** データ出力パターン選択コンポーネント */
  @ViewChild(ExportPatternSelectorComponent) exportPatternSelectorComponent: ExportPatternSelectorComponent;
  /** 日付入力コンポーネント */
  @ViewChild(DatePickerConditionComponent) datePickerCondition: DatePickerConditionComponent;
  /** 詳細条件コンポーネント */
  @ViewChild(DetailVehicleMgtConditionComponent) detailCondition: DetailVehicleMgtConditionComponent;


  constructor(
    private exportVehicleMgtService: ExportVehicleMgtService,
    private dialogService: BlDialogService,
    private loadingShow: BlLoadingService,
    private appContext: BlAppContext,
    private exportService: ExportPageService,
    private modalService: BlModalService,
    private loginResourceService: LoginResourceService,
  ) {
    super();
    this.exportService.invokeEventTabVehicleMgt.subscribe(dataDownload => {
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
    this.onInitOutputInfo();
}

  /**
   * テキスト出力を更新
   * @param isLoadOld load pattern selected on old session
   */
  updateExportPattern(isLoadOld: boolean = false): void {
    this.exportPatternSelectorComponent.genTableExportPatternData(isLoadOld);
  }

  /**
   * 出力内容イベント
   * @param event
   */
  onChangeOutputInfo(event: string): void {
    this.exportCondition.outputInfo = event;
    this.onInitOutputInfo();
    this.onChangeExportInfoType(event);
  }

  /**
   * 出力タイプの変更イベント
   * @param v bl-select return value
   */
  onChangeExportInfoType(v: string): void {
    this.exportCondition.exportInfoType = v;
    this.updateExportPattern(true);
  }

  /**
   * 組織の変更イベント
   * @param o
   */
  onChangeOrganizationCode($event): void {
    this.exportCondition.organizationCode = $event.organizationCode;
  }

  /**
   * 入力条件を初期化
   */
  private initConditions(): void {
    this.exportCondition = this.exportVehicleMgtService.initCondition();
  }

  /**
   * 検索条件初期化イベント
   */
  onClearCondition(): void {
    this.datePickerCondition.startDate = this.startDate;
    this.datePickerCondition.endDate = this.endDate;
    this.exportCondition.exportInfoType = ShipmentPartsTypeDiv.Vehicle;
    this.updateExportPattern(true);
    this.exportCondition = this.exportVehicleMgtService.initCondition();
    this.detailCondition.onChangeCustomerDealsDiv(this.exportCondition.vehicleStockBackorderDiv);
    this.onChangeOutputInfo(this.exportCondition.outputInfo);
    this.onClickDetailButton();
  }

  /**
   * 出力ボタンを押下する時のイベント
   */
  onClickExport(): void {
    // ロール確認
    this.loadingShow.show();
    this.loginResourceService.isAvailableFunction(RoleConst.ROLEID_FUNC_ALL_VEHICLE_TEXT_OUTPUT).subscribe(
      isAvailable => {
        if (isAvailable) {
          if (this.exportCondition.outputInfo === VehicleExportContent.Vehicle) {
            this.export();
          } else {
            this.loginResourceService.isAvailableFunction(RoleConst.ROLEID_FUNC_ALL_SALESSLIP_TEXT_OUTPUT).subscribe(
              isAvailableShipmentParts => {
                if (isAvailableShipmentParts) {
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
    if (!this.exportCondition.outputInfo || this.exportCondition.outputInfo === '') {
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
    this.exportVehicleMgtService.setProductCodes(productCodes);
    this.exportVehicleMgtService.setExportPatternCode(this.exportPatternSelectorComponent.getExportPatternCodeList());
    this.exportVehicleMgtService.setVehicleExportContent(this.exportCondition.outputInfo);
    this.exportVehicleMgtService.setDate(this.exportCondition.startDate, this.exportCondition.endDate,
    this.exportCondition.targetPeriod);
    this.exportVehicleMgtService.setOrganizationCode(this.exportCondition.organizationCode);
    this.exportVehicleMgtService.setCustomerCode(this.exportCondition.customerCodeStart, this.exportCondition.customerCodeEnd);
    this.exportVehicleMgtService.setCustVcleManageGroupCode(this.exportCondition.custVcleManageGroupCode);
    this.exportVehicleMgtService.setFullModel(this.exportCondition.fullModel);
    this.exportVehicleMgtService.setVcleRemarksName(this.exportCondition.vcleRemarksName);
    if (this.exportCondition.outputInfo === VehicleExportContent.ShipmentParts) {
      this.exportVehicleMgtService.setBlCdGroupCode(this.exportCondition.blCdGroupCodeStart, this.exportCondition.blCdGroupCodeEnd);
      this.exportVehicleMgtService.setBlPrtsCd(this.exportCondition.blPrtsCdStart, this.exportCondition.blPrtsCdEnd);
      this.exportVehicleMgtService.setPartsNumber(this.exportCondition.partsNumber);
      this.exportVehicleMgtService.setPartsName(this.exportCondition.partsName);
      this.exportVehicleMgtService.setVehicleStockBackorderDiv(this.exportCondition.vehicleStockBackorderDiv);
      if (this.exportCondition.vehicleStockBackorderDiv === VehicleStockBackorderDiv.All ||
          this.exportCondition.vehicleStockBackorderDiv === VehicleStockBackorderDiv.Stock) {
        this.exportVehicleMgtService.setWhCode(this.exportCondition.whCodeStart, this.exportCondition.whCodeEnd);
      }
    }
    const clientSessionId = this.appContext.getUuid() + 'vehicleMgt';
    this.exportVehicleMgtService.setClientSessionId(clientSessionId);
    if (!this.webSocketConnected) {
      this.exportService.connectWebSocket(ExportInfoTabDiv.VehicleMgt, clientSessionId);
      this.webSocketConnected = true;
    }

    this.loadingShow.show({ message: '出力処理中です。<br />しばらくお待ちください。' });
    this.exportVehicleMgtService.export().subscribe(_response => { },
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
   * 対象期間と出力タイプを設定
   */
  onInitOutputInfo(): void {
    if (this.exportCondition.outputInfo === VehicleExportContent.Vehicle) {
      this.targetPeriodItems = this.targetPeriodVehicle;
      this.exportCondition.targetPeriod = VehicleTargetPeriodDiv.UpdateDate;
      this.exportInfoTypeItems = this.exportInfoTypeVehicle;
      this.exportCondition.exportInfoType = ShipmentPartsTypeDiv.Vehicle;
      this.exportCondition.organizationCode = '000000';
      this.isShowType = false;
      this.isShowOrganization = false;
      this.detailCondition.showDetailFlg  = false;
      this.isShowDate  = false;
    } else {
      this.targetPeriodItems = this.targetPeriodShipmentParts;
      this.exportCondition.targetPeriod = VehicleTargetPeriodDiv.SlipDate;
      this.exportInfoTypeItems = this.exportInfoTypeShipmentParts;
      this.exportCondition.exportInfoType = ShipmentPartsTypeDiv.SlipDetail;
      this.isShowType = true;
      this.isShowOrganization = true;
      this.detailCondition.showDetailFlg  = true;
      this.isShowDate  = true;
    }
  }
}
