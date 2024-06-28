import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ViewChild,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  AbstractContainer,
  BlLoadingService,
  BlModalService,
  BlDialogService
} from '@blcloud/bl-ng-ui-component';
import {
  forEach as _forEach,
  defer as _defer,
  filter as _filter,
  map as _map
} from 'lodash';
import { ExportCustomerVehicleService } from './export-customer-vehicle.service';
import { ExportCustomerVehicleConditionManager } from './export-customer-vehicle.condition';
import { ExportCustomerVehicleConditionSearch } from './export-customer-vehicle.define';
import {
  IDownloadContent
} from '../../page/export-page/export-page.define';
import { ExportPageService } from '../../page/export-page/export-page.service';
import { DownloadModalComponent } from '../../shared/modal/download-modal/download-modal.component';
import { AbstractConditionsComponent } from '../../page/export-page/components/abstract-conditions.component';
import {
  DetailCustomerConditionComponent, IDetailCustomerCondition
} from '../../page/export-page/components/detail-customer-condition/detail-customer-condition.component';
import { DatePickerConditionComponent } from '../../page/export-page/components/date-picker-condition/date-picker-condition.component';
import {
  ExportPatternSelectorComponent
} from '../../page/export-page/components/export-pattern-selector/export-pattern-selector.component';
import { BlAppContext } from '@blcloud/bl-ng-common';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { ExportInfoDiv, ExportInfoDivMap } from '@blcloud/bl-datamodel/enum/output/export-info-div';
import {
  FunctionRole,
  PageId,
  ScreenService,
  WithAllCompanyDiv,
  LoginResourceService,
} from '@blcloud/bl-ng-share-module';
import { IExportPatternInfo } from '@blcloud/bl-datamodel';
import { RoleConst } from '@blcloud/bl-datamodel/const/role';

@Component({
  selector: 'app-export-customer-vehicle',
  templateUrl: './export-customer-vehicle.component.html',
  styleUrls: ['./export-customer-vehicle.component.scss'],
  providers: [ExportCustomerVehicleService, ExportCustomerVehicleConditionManager],
})
export class ExportCustomerVehicleComponent extends AbstractContainer implements OnInit {

  /** 顧客情報 */
  private customerInfoMode = true;

  private webSocketConnected = false;

  /** 開始日 */
  private startDate: string = null;

  /** 終了日 */
  private endDate: string = null;

  /** 出力内容の表示ステータス */
  private isShowDetailCondition = true;

  public selectedOrganizationCode: string;

  private defaultSelectedOrganizationCode: string;

  public exportCustomerVehicleConditionSearch: ExportCustomerVehicleConditionSearch;

  /** 出力内容の項目（出力内容の選択肢） */
  public outputInfo = [
    { code: ExportInfoDiv.Customer, name: '顧客情報' },
    { code: ExportInfoDiv.Vehicle, name: '車両情報' }
  ];

  public detailCustomerConditionValue: IDetailCustomerCondition = {
    customerCodeS: '',
    customerCodeE: '',
    customerNameKana1: ''
  };

  public isShowCustomerInfo = false;

  public readonly exportInfoTabDiv = ExportInfoTabDiv;

  public withAllCompanyDiv = WithAllCompanyDiv;

  readonly ExportInfoDivMap = ExportInfoDivMap;

  /** 組織情報表示区分 */
  @ViewChildren('conditions') conditionsList: QueryList<AbstractConditionsComponent>;
  @ViewChild(DetailCustomerConditionComponent) detailCustomerCondition: DetailCustomerConditionComponent;
  @ViewChild(DatePickerConditionComponent) datePickerCondition: DatePickerConditionComponent;
  @ViewChild(ExportPatternSelectorComponent) exportPatternSelector: ExportPatternSelectorComponent;

  @Output() changeExportPatternEvent: EventEmitter<IExportPatternInfo[]> = new EventEmitter();
  @Input() dataExportPatterns: IExportPatternInfo[];

  /** 業務選択肢 */
  @Input() systemItems: {value: string, text: string}[];

  /** 画面初期化完了フラグ */
  constructor(
    private exportCustomerVehicleService: ExportCustomerVehicleService,
    private exportService: ExportPageService,
    private loadingService: BlLoadingService,
    private appContext: BlAppContext,
    private screenService: ScreenService,
    private modalService: BlModalService,
    private dialogService: BlDialogService,
    private loginResourceService: LoginResourceService
  ) {
    super();
    /** ダウンロード関数の呼び出すデータを返却するsocketをsubscribe */
    this.exportService.invokeEventTabCustomerVehicle.subscribe(dataDownload => {
      this.showModalDownload(<IExportPatternInfo[]>this.dataExportPatterns,
        dataDownload.infoDataDownload);
    });
  }

  /**
   * 初期化
   */
  ngOnInit() {
    this.initSearchCondition();

    // ログイン組織コードを取得
    this.exportService.getLoginUserInfo().subscribe(
      loginUser => {
        this.selectedOrganizationCode = loginUser.organizationCode;
        this.defaultSelectedOrganizationCode = loginUser.organizationCode;
      }
    );
  }

  /**
   * 検索条件を初期化
   */
  private initSearchCondition() {
    this.exportCustomerVehicleConditionSearch = this.exportCustomerVehicleService.initExportCustomerVehicleConditionSearch();
    this.isShowCustomerInfo = true;
  }

  /**
   * 出力内容変更
   * @param $event
   */
  public onChangeOutputInfo($event) {
    /** 顧客情報が選択された場合 */
    if ($event === ExportInfoDiv.Customer) {
      this.isShowCustomerInfo = true;
      this.customerInfoMode = true;
      this.isShowDetailCondition = true;
      this.screenService.enableFnKey(FunctionRole.Detail);
    } else {
      /** 車両情報が選択された場合 */
      this.isShowCustomerInfo = false;
      this.customerInfoMode = false;
      this.isShowDetailCondition = false;
      this.onPanelHide();
      this.screenService.disableFnKey(FunctionRole.Detail);
    }
    /** モードを設定し、初期値を作成 */
    this.exportCustomerVehicleService.setCustomerInfoMode(this.customerInfoMode);
    this.exportCustomerVehicleConditionSearch.outputInfo = $event;
    this.exportPatternSelector.genTableExportPatternData(true);
  }

  /**
   * 出力ボタンを押下する時のイベント
   */
  public async onClickExport() {
    // ロール確認
    const roleId = this.isShowCustomerInfo ? RoleConst.ROLEID_FUNC_ALL_CUSTOMER_TEXT_OUTPUT : RoleConst.ROLEID_FUNC_ALL_VEHICLE_TEXT_OUTPUT;
    this.loadingService.show();
    this.loginResourceService.isAvailableFunction(roleId).subscribe(
      isAvailable => {
        if (isAvailable) {
          this.export();
        } else {
          this.loadingService.hide();
          this.dialogService.error('権限が無い為、テキスト出力は行えません').subscribe(
            dialogRef => dialogRef.hide()
          );
        }
      }
    );
  }

  /**
   * テキスト出力処理
   */
  private export() {
    this.loadingService.show({ message: '出力処理中です。<br />しばらくお待ちください。' });
    /** クエリ検索条件のパラメータ作成を開始 */
    const productCodes = _map(
      _filter(this.systemItems, item => item.value !== ProductCode.Common), product => product.value
    );
    this.exportCustomerVehicleService.setProductCodes(productCodes);
    this.exportCustomerVehicleService.setUpdateDateTime(this.startDate, this.endDate);
    this.exportCustomerVehicleService.setOrganizationCode(this.selectedOrganizationCode,
      this.customerInfoMode);
    this.exportCustomerVehicleService.setCustomerCode(this.detailCustomerConditionValue.customerCodeS,
      this.detailCustomerConditionValue.customerCodeE);
    this.exportCustomerVehicleService.setCustomerNamekana1(this.detailCustomerConditionValue.customerNameKana1);
    this.exportCustomerVehicleService.setExportPatternCodeList(this.exportPatternSelector.getExportPatternCodeList());
    const clientSessionId = this.appContext.getUuid() + 'customervehicle';
    this.exportCustomerVehicleService.setClientSessionId(clientSessionId);
    /** クエリ検索条件のパラメータ作成を終了 */
    /** WebSocketへの接続 */
    if (!this.webSocketConnected) {
      this.exportService.connectWebSocket(ExportInfoTabDiv.CustomerVehicle, clientSessionId);
      this.webSocketConnected = true;
    }
    /** CSVファイルへテキスト出力API */
    this.exportCustomerVehicleService.export().subscribe(
      _response => {
        const exportPatternList = this.exportPatternSelector.exportPatternList;
        const exportInfoDivEnumName = exportPatternList[exportPatternList.length - 1].exportInfoDivEnumName;
        // 操作履歴ログの登録
        this.exportService.postOperationHistoryLog(PageId.ExportCustomerVehicle, exportInfoDivEnumName);
      },
      _error => { }
    );
  }

  /**
   * 検索条件を削除
   */
  public clearSearch(): void {
    this.exportCustomerVehicleService.clear();
    this.detailCustomerCondition.clear();
    this.resetOrgCode();
    this.datePickerCondition.clear();
  }

  /**
   * ファイルダウンロードのモダール画面を表示
   * @param dataDivSortExportTab1 APIより返却されたcsファイルの一覧
   * @param listFile APIより返却されたcsファイルの一覧
   */
  private showModalDownload(dataDivSortExportTab1: IExportPatternInfo[], listFile: IDownloadContent[]): void {
    /** ダウンロード用のファイル一覧 */
    const tmpFile = [];
    /** exportInfoDivEnumNameを取り出す */
    _forEach(listFile, file => {
      let breakPoint = true; // foreachのループから抜け出すためのflag
      _forEach(dataDivSortExportTab1, items => {
        if (breakPoint) {
          /** tmpFileにexportInfoDivEnumNameを追加 */
          if (items.exportInfoDiv === file.exportInfoDiv) {
            tmpFile.push({
              exportInfoDiv: items.exportInfoDiv,
              urlDownload: file.urlDownload.toString(),
              exportInfoDivEnumName: items.exportInfoDivEnumName
            });
            breakPoint = false;
          }
        }
      });
    });
    if (listFile.length === 1) {
      location.href = tmpFile[0].urlDownload;
    } else {
      /** データの変換 */
      const data = {
        listFile: tmpFile
      };
      /** ファイルダウンロードのモダール画面を表示 */
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

  /**
   * 詳細パネル表示イベント
   */
  onPanelShown() {
    if (this.isShowCustomerInfo) {
      if (this.isShowDetailCondition) {
        _defer(() => {
          this.openConditions();
        });
      } else {
        _defer(() => {
          this.closeConditions();
        });
      }
      this.isShowDetailCondition = !this.isShowDetailCondition;
    }
  }

  /**
   * 詳細パネル非表示イベント
   */
  private onPanelHide() {
    _defer(() => {
      this.closeConditions();
    });
  }

  /**
   * すべての詳細出力条件を表示
   */
  private openConditions() {
    this.conditionsList.forEach(conditions => {
      conditions.open();
    });
  }

  /**
   * すべての詳細出力条件を非表示
   */
  private closeConditions() {
    this.conditionsList.forEach(conditions => {
      conditions.close();
    });
  }

  /**
   * 出力パターン指定領域のデータを更新
   */
  updateExportPattern(isLoadOld: boolean = false): void {
    this.exportPatternSelector.genTableExportPatternData(isLoadOld);
  }

  onStartDateChange($event: string): void {
    this.startDate = $event;
  }

  onEndDateChange($event: string): void {
    this.endDate = $event;
  }

  onChangeDetailCustomerCondition($event): void {
    this.detailCustomerConditionValue = $event;
  }

  onChangeDataExportPattern(data: IExportPatternInfo[]) {
    this.dataExportPatterns = data;
    this.changeExportPatternEvent.emit(data);
  }

  /**
 * 組織・拠点変更コールバック
 * @param $event 組織情報
 */
  onChangeOrgCode($event): void {
    this.selectedOrganizationCode = $event.organizationCode;
  }

  resetOrgCode(): void {
    this.selectedOrganizationCode = this.defaultSelectedOrganizationCode;
  }
}
