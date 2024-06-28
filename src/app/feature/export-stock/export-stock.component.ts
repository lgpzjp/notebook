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
import { ExportStockService } from './export-stock.service';
import { ExportStockConditionManager } from './export-stock.condition';
import { ExportStockConditionSearch } from './export-stock.define';
import {
  IDownloadContent
} from '../../page/export-page/export-page.define';
import { ExportPageService } from '../../page/export-page/export-page.service';
import { DownloadModalComponent } from '../../shared/modal/download-modal/download-modal.component';
import { AbstractConditionsComponent } from '../../page/export-page/components/abstract-conditions.component';
import {
  DetailStockConditionComponent,
} from '../../page/export-page/components/detail-stock-condition/detail-stock-condition.component';
import { IDetailStockCondition } from '../../page/export-page/components/detail-stock-condition/detail-stock-condition.define';
import { DatePickerConditionComponent } from '../../page/export-page/components/date-picker-condition/date-picker-condition.component';
import {
  ExportPatternSelectorComponent
} from '../../page/export-page/components/export-pattern-selector/export-pattern-selector.component';
import { BlAppContext } from '@blcloud/bl-ng-common';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { WithAllCompanyDiv, LoginResourceService } from '@blcloud/bl-ng-share-module';
import { IExportPatternInfo, IOrganizationInformation } from '@blcloud/bl-datamodel';
import { RoleConst } from '@blcloud/bl-datamodel/const/role';
import { StockExportContent, StockExportContentArray } from '@blcloud/bl-datamodel/enum/stock/stock-export-content';
import { DateTimeUtils } from '@blcloud/bl-common';

/**
 * 在庫出力コンポーネント
 */
@Component({
  selector: 'app-export-stock',
  templateUrl: './export-stock.component.html',
  styleUrls: ['./export-stock.component.scss'],
  providers: [ExportStockService, ExportStockConditionManager],
})
export class ExportStockComponent extends AbstractContainer implements OnInit {

  /** WebSocket接続済み */
  private webSocketConnected = false;
  /** 開始日 */
  public startDate: string = null;
  /** 終了日 */
  public endDate: string = null;
  /** デフォルト開始日 */
  private defaultStartDate: string = null;
  /** デフォルト終了日 */
  private defaultEndDate: string = null;
  /** 出力内容の表示ステータス */
  private isShowDetailCondition = false;
  /** 選択組織コード */
  public selectedOrganizationCode: string;
  /** デフォルト選択組織コード */
  private defaultSelectedOrganizationCode: string;
  /** 検索条件 */
  public exportStockConditionSearch: ExportStockConditionSearch;
  /** 在庫情報出力内容 */
  readonly StockExportContentArray = StockExportContentArray;

  /** 詳細条件 */
  public detailStockConditionValue: IDetailStockCondition = {
    whCodeS: '',
    whCodeE: '',
    shelfNumS: '',
    shelfNumE: '',
    supplierCdS: '',
    supplierCdE: '',
    itemMakerCdS: '',
    itemMakerCdE: '',
    itemLClassCdS: '',
    itemLClassCdE: '',
    itemMClassCdS: '',
    itemMClassCdE: '',
    blCdGroupCodeS: '',
    blCdGroupCodeE: '',
    blPrtsCdS: '',
    blPrtsCdE: '',
    searchItemPartsNumber: '',
    searchItemPartsName: ''
  };

  /** テキスト出力情報タブ区分 */
  public readonly exportInfoTabDiv = ExportInfoTabDiv;
  /** 全社設定取得区分 */
  public withAllCompanyDiv = WithAllCompanyDiv;
  /** 終了日表示フラグ */
  public displayEndDate = true;

  /** データ出力パターン */
  @Input() dataExportPatterns: IExportPatternInfo[];
  /** 業務選択肢 */
  @Input() systemItems: {value: string, text: string}[];

  /** データ出力パターン変更イベント */
  @Output() changeExportPatternEvent: EventEmitter<IExportPatternInfo[]> = new EventEmitter();

  /** 検索条件コンポーネント一覧 */
  @ViewChildren('conditions') conditionsList: QueryList<AbstractConditionsComponent>;
  /** 詳細条件コンポーネント */
  @ViewChild(DetailStockConditionComponent) detailStockCondition: DetailStockConditionComponent;
  /** 日付入力コンポーネント */
  @ViewChild(DatePickerConditionComponent) datePickerCondition: DatePickerConditionComponent;
  /** 出力パターン選択コンポーネント */
  @ViewChild(ExportPatternSelectorComponent) exportPatternSelector: ExportPatternSelectorComponent;


  constructor(
    private exportStockService: ExportStockService,
    private exportService: ExportPageService,
    private loadingService: BlLoadingService,
    private appContext: BlAppContext,
    private modalService: BlModalService,
    private dialogService: BlDialogService,
    private loginResourceService: LoginResourceService
  ) {
    super();
    /** ダウンロード関数の呼び出すデータを返却するsocketをsubscribe */
    this.exportService.invokeEventTabStock.subscribe(dataDownload => {
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

    // 対象期間_日付初期化
    this.onInitDatePicker();
  }

  /**
   * 検索条件を初期化
   */
  private initSearchCondition() {
    this.datePickerCondition.startDate = this.startDate;
    this.datePickerCondition.endDate = this.endDate;
    this.exportStockConditionSearch = this.exportStockService.initExportStockConditionSearch();
  }

  /**
   * 出力内容変更
   * @param $event
   */
  public onChangeOutputInfo($event) {
    this.exportStockConditionSearch.outputInfo = $event;
    this.exportPatternSelector.genTableExportPatternData(true);
  }

  /**
   * 出力ボタンを押下する時のイベント
   */
  public async onClickExport() {
    // ロール確認
    this.loadingService.show();
    this.loginResourceService.isAvailableFunction(RoleConst.ROLEID_FUNC_PMC_STOCK_TEXT_OUTPUT).subscribe(
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
    if (!this.exportPatternSelector.getExportPatternCodeList
       || this.exportPatternSelector.getExportPatternCodeList().length === 0) {
      this.dialogService.warn('出力パターン情報項目は必須項目です。選択してください。', '確認').subscribe(dialogRef => {
        const el = document.activeElement;
        dialogRef.hide(el);
        this.loadingService.hide();
      });
      return;
    }
    this.loadingService.show({ message: '出力処理中です。<br />しばらくお待ちください。' });
    // クエリ検索条件のパラメータ作成を開始
    // QueryStrings ID = 1
    this.exportStockService.setExportPatternCodeList(this.exportPatternSelector.getExportPatternCodeList());
    // QueryStrings ID = 2～3
    this.exportStockService.setUpdateDateTime(this.startDate, this.endDate);
    // QueryStrings ID = 4
    this.exportStockService.setWhOrganizationCode(this.selectedOrganizationCode);
    // QueryStrings ID = 5～6
    this.exportStockService.setWhCode(this.detailStockConditionValue.whCodeS,
      this.detailStockConditionValue.whCodeE);
    // QueryStrings ID = 7～8
    this.exportStockService.setShelfNum(this.detailStockConditionValue.shelfNumS,
      this.detailStockConditionValue.shelfNumE);
    // QueryStrings ID = 9～10
    this.exportStockService.setSupplierCd(this.detailStockConditionValue.supplierCdS,
      this.detailStockConditionValue.supplierCdE);
    // QueryStrings ID = 11～12
    this.exportStockService.setItemMakerCd(this.detailStockConditionValue.itemMakerCdS,
      this.detailStockConditionValue.itemMakerCdE);
    // QueryStrings ID = 13～14
    this.exportStockService.setItemLClassCd(this.detailStockConditionValue.itemLClassCdS,
      this.detailStockConditionValue.itemLClassCdE);
    // QueryStrings ID = 15～16
    this.exportStockService.setItemMClassCd(this.detailStockConditionValue.itemMClassCdS,
      this.detailStockConditionValue.itemMClassCdE);
    // QueryStrings ID = 17～18
    this.exportStockService.setBlCdGroupCode(this.detailStockConditionValue.blCdGroupCodeS,
      this.detailStockConditionValue.blCdGroupCodeE);
    // QueryStrings ID = 19～20
    this.exportStockService.setBlPrtsCd(this.detailStockConditionValue.blPrtsCdS,
      this.detailStockConditionValue.blPrtsCdE);
    // QueryStrings ID = 21
    this.exportStockService.setSearchItemPartsNumber(this.detailStockConditionValue.searchItemPartsNumber);
    // QueryStrings ID = 22
    this.exportStockService.setSearchItemPartsName(this.detailStockConditionValue.searchItemPartsName);
    // QueryStrings ID = 23
    const productCodes = _map(
      _filter(this.systemItems, item => item.value !== ProductCode.Common), product => product.value
    );
    this.exportStockService.setProductCodes(productCodes);
    // QueryStrings ID = 24
    const clientSessionId = this.appContext.getUuid() + 'stock';
    this.exportStockService.setClientSessionId(clientSessionId);
    /** クエリ検索条件のパラメータ作成を終了 */
    /** WebSocketへの接続 */
    if (!this.webSocketConnected) {
      this.exportService.connectWebSocket(ExportInfoTabDiv.Stock, clientSessionId);
      this.webSocketConnected = true;
    }
    /** CSVファイルへテキスト出力API */
    this.exportStockService.export().subscribe(_response => { },
      _error => { });
  }

  /**
   * 検索条件を削除
   */
  public onClearCondition(): void {
    this.exportStockService.clear();
    this.detailStockCondition.clear();
    this.resetOrgCode();
    this.datePickerCondition.startDate = this.defaultStartDate;
    this.datePickerCondition.endDate = this.defaultEndDate;
    this.exportStockConditionSearch.outputInfo = StockExportContent.Stock;
    this.onChangeOutputInfo(StockExportContent.Stock);
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
  onClickDetailButton() {
    if (!this.isShowDetailCondition) {
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

  /** 開始日変更イベント */
  onStartDateChange($event: string): void {
    this.startDate = $event;
  }

  /** 終了日変更イベント */
  onEndDateChange($event: string): void {
    this.endDate = $event;
  }

  /** 詳細条件変更イベント */
  onChangeDetailStockCondition($event): void {
    this.detailStockConditionValue = $event;
  }

  /** データ出力パターン変更イベント */
  onChangeDataExportPattern(data: IExportPatternInfo[]) {
    this.dataExportPatterns = data;
    this.changeExportPatternEvent.emit(data);
  }

  /**
   * 管理組織の変更イベント
   * @param $event
   */
  onChangeOrgCode($event: IOrganizationInformation): void {
    this.selectedOrganizationCode = $event.organizationCode;
  }

  /** 管理組織コードリセット */
  resetOrgCode(): void {
    this.selectedOrganizationCode = this.defaultSelectedOrganizationCode;
  }

  /**
   * 対象期間_日付初期化
   */
  onInitDatePicker(): void {
    // システム日付を取得
    const today = DateTimeUtils.today();
    // 当日の前月年月日
    this.startDate = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, - 1));
    // 当年月
    this.endDate = DateTimeUtils.formatIso(today);
    // 当日の前月年月日
    this.defaultStartDate = this.startDate;
    // 当年月
    this.defaultEndDate = this.endDate;
  }

}
