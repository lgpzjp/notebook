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
import { ExportCreditService } from './export-credit.service';
import { ExportCreditConditionManager } from './export-credit.condition';
import { ExportCreditConditionSearch } from './export-credit.define';
import {
  IDownloadContent
} from '../../page/export-page/export-page.define';
import { ExportPageService } from '../../page/export-page/export-page.service';
import { DownloadModalComponent } from '../../shared/modal/download-modal/download-modal.component';
import { AbstractConditionsComponent } from '../../page/export-page/components/abstract-conditions.component';
import {
  DetailCreditConditionComponent
} from '../../page/export-page/components/detail-credit-condition/detail-credit-condition.component';
import { IDetailCreditCondition } from '../../page/export-page/components/detail-credit-condition/detail-credit-condition.define';
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
import { CreditExportContent, CreditExportContentArray } from '@blcloud/bl-datamodel/enum/credit/credit-export-content';
import { DateSeparator, DateTimeOutput, DateTimePadding, DateTimeUtils } from '@blcloud/bl-common';
import { DateMode } from '@blcloud/bl-ng-ui-component';

/**
 * 入金請求出力コンポーネント
 */
@Component({
  selector: 'app-export-credit',
  templateUrl: './export-credit.component.html',
  styleUrls: ['./export-credit.component.scss'],
  providers: [ExportCreditService, ExportCreditConditionManager],
})
export class ExportCreditComponent extends AbstractContainer implements OnInit {

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
  public exportCreditConditionSearch: ExportCreditConditionSearch;
  /** 債権情報出力内容 */
  readonly CreditExportContentArray = CreditExportContentArray;
  /** 日付入力モード */
  public dateMode = DateMode.Month;

  /** 締日 */
  public CutoffDay = [
    { code: 31, name: '末日' },
    { code: 1, name: '1' },
    { code: 2, name: '2' },
    { code: 3, name: '3' },
    { code: 4, name: '4' },
    { code: 5, name: '5' },
    { code: 6, name: '6' },
    { code: 7, name: '7' },
    { code: 8, name: '8' },
    { code: 9, name: '9' },
    { code: 10, name: '10' },
    { code: 11, name: '11' },
    { code: 12, name: '12' },
    { code: 13, name: '13' },
    { code: 14, name: '14' },
    { code: 15, name: '15' },
    { code: 16, name: '16' },
    { code: 17, name: '17' },
    { code: 18, name: '18' },
    { code: 19, name: '19' },
    { code: 20, name: '20' },
    { code: 21, name: '21' },
    { code: 22, name: '22' },
    { code: 23, name: '23' },
    { code: 24, name: '24' },
    { code: 25, name: '25' },
    { code: 26, name: '26' },
    { code: 27, name: '27' }
  ];

  /** 詳細条件 */
  public detailCreditConditionValue: IDetailCreditCondition = {
    billingCodeS: '',
    billingCodeE: '',
    billingNameKanaS: '',
    billingNameKanaE: ''
  };

  /** 請求履歴表示フラグ */
  public isShowBillingHistory = true;
  /** テキスト出力情報タブ区分 */
  public readonly exportInfoTabDiv = ExportInfoTabDiv;
  /** 全社設定取得区分 */
  public withAllCompanyDiv = WithAllCompanyDiv;
  /** 終了日表示フラグ */
  public displayEndDate = true;
  /** プロダクトコード */
  public readonly ProductCode = ProductCode;

  /** データ出力パターン */
  @Input() dataExportPatterns: IExportPatternInfo[];
  /** 業務選択肢 */
  @Input() systemItems: {value: string, text: string}[];
  /** プロダクトコード */
  @Input() productCode: string;

  /** データ出力パターン変更イベント */
  @Output() changeExportPatternEvent: EventEmitter<IExportPatternInfo[]> = new EventEmitter();

  /** 検索条件コンポーネント一覧 */
  @ViewChildren('conditions') conditionsList: QueryList<AbstractConditionsComponent>;
  /** 詳細条件コンポーネント */
  @ViewChild(DetailCreditConditionComponent) detailCreditCondition: DetailCreditConditionComponent;
  /** 日付入力コンポーネント */
  @ViewChild(DatePickerConditionComponent) datePickerCondition: DatePickerConditionComponent;
  /** 出力パターン選択コンポーネント */
  @ViewChild(ExportPatternSelectorComponent) exportPatternSelector: ExportPatternSelectorComponent;

  /** 画面初期化完了フラグ */
  constructor(
    private exportCreditService: ExportCreditService,
    private exportService: ExportPageService,
    private loadingService: BlLoadingService,
    private appContext: BlAppContext,
    private modalService: BlModalService,
    private dialogService: BlDialogService,
    private loginResourceService: LoginResourceService
  ) {
    super();
    /** ダウンロード関数の呼び出すデータを返却するsocketをsubscribe */
    this.exportService.invokeEventTabCredit.subscribe(dataDownload => {
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
    this.exportCreditConditionSearch = this.exportCreditService.initExportCreditConditionSearch();
    this.isShowBillingHistory = true;
  }

  /**
   * 出力内容変更
   * @param $event
   */
  public onChangeOutputInfo($event) {
    /** 請求履歴が選択された場合 */
    if ($event === CreditExportContent.BillingHistory) {
      this.isShowBillingHistory = true;
    } else {
      /** 売掛履歴が選択された場合 */
      this.isShowBillingHistory = false;
    }
    /** モードを設定し、初期値を作成 */
    this.exportCreditService.setBillingHistoryMode(this.isShowBillingHistory);
    this.exportCreditConditionSearch.outputInfo = $event;
    this.exportPatternSelector.genTableExportPatternData(true);
  }

  /**
   * 出力ボタンを押下する時のイベント
   */
  public async onClickExport() {
    // ロール確認
    this.loadingService.show();
    this.loginResourceService.isAvailableFunction(RoleConst.ROLEID_FUNC_PMC_CREDIT_TEXT_OUTPUT).subscribe(
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
    // 対象期間の開始月或いは終了月が未入力の場合
    // this.startDate === ''1900/01'' || this.endDate === '1900/01'
    if (this.startDate === DateTimeUtils.format(DateTimeUtils.initial.iso8601.date, DateTimeOutput.YM
        , DateTimePadding.ZERO, DateSeparator.SLASH)
        || this.endDate === DateTimeUtils.format(DateTimeUtils.initial.iso8601.date, DateTimeOutput.YM
        , DateTimePadding.ZERO, DateSeparator.SLASH)) {
      this.dialogService.warn('対象期間を入力してください。', '確認').subscribe(dialogRef => {
        const el = document.activeElement;
        dialogRef.hide(el);
        this.loadingService.hide();
      });
      return;
    }
    this.loadingService.show({ message: '出力処理中です。<br />しばらくお待ちください。' });
    // クエリ検索条件のパラメータ作成を開始
    // QueryStrings ID = 1
    this.exportCreditService.setExportPatternCodeList(this.exportPatternSelector.getExportPatternCodeList());
    // QueryStrings ID = 2
    const creditExportContent: string[] = [];
    creditExportContent.push(this.exportCreditConditionSearch.outputInfo);
    this.exportCreditService.setCreditExportContent(creditExportContent);
    const startDate = this.startDate.replace('/', '');
    const endDate = this.endDate.replace('/', '');
    /** 請求履歴が選択された場合 */
    if (this.isShowBillingHistory === true) {
      // QueryStrings ID = 3～4
      this.exportCreditService.setBillingYearMonth(startDate, endDate);
    /** 売掛履歴が選択された場合 */
    } else {
      // QueryStrings ID = 5～6
      this.exportCreditService.setRecordingYearMonth(startDate, endDate);
    }
    // QueryStrings ID = 7
    this.exportCreditService.setOrganizationCode(this.selectedOrganizationCode);
    // QueryStrings ID = 8～9
    this.exportCreditService.setBillingCode(this.detailCreditConditionValue.billingCodeS,
      this.detailCreditConditionValue.billingCodeE);
      // QueryStrings ID = 10～11
    this.exportCreditService.setBillingNameKana(this.detailCreditConditionValue.billingNameKanaS,
      this.detailCreditConditionValue.billingNameKanaE);
    // QueryStrings ID = 12
    this.exportCreditService.setCutoffDay(this.exportCreditConditionSearch.cutoffDay);
    // QueryStrings ID = 13
    const productCodes = _map(
      _filter(this.systemItems, item => item.value !== ProductCode.Common), product => product.value
    );
    this.exportCreditService.setProductCodes(productCodes);
    // QueryStrings ID = 14
    const clientSessionId = this.appContext.getUuid() + 'credit';
    this.exportCreditService.setClientSessionId(clientSessionId);
    /** クエリ検索条件のパラメータ作成を終了 */
    /** WebSocketへの接続 */
    if (!this.webSocketConnected) {
      this.exportService.connectWebSocket(ExportInfoTabDiv.Credit, clientSessionId);
      this.webSocketConnected = true;
    }
    /** CSVファイルへテキスト出力API */
    this.exportCreditService.export().subscribe(_response => { },
      _error => { });
  }

  /**
   * 検索条件を削除
   */
  public onClearCondition(): void {
    this.exportCreditService.clear();
    this.detailCreditCondition.clear();
    this.resetOrgCode();
    this.datePickerCondition.startDate = this.defaultStartDate;
    this.datePickerCondition.endDate = this.defaultEndDate;
    this.exportCreditConditionSearch.outputInfo = CreditExportContent.BillingHistory;
    this.onChangeOutputInfo(CreditExportContent.BillingHistory);
    this.exportCreditConditionSearch.cutoffDay = 31;
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
    if (!String($event).includes('/')) {
      this.startDate = DateTimeUtils.format($event, DateTimeOutput.YM, DateTimePadding.ZERO, DateSeparator.SLASH);
    } else {
      this.startDate = $event;
    }
  }

  /** 終了日変更イベント */
  onEndDateChange($event: string): void {
    if (!String($event).includes('/')) {
      this.endDate = DateTimeUtils.format($event, DateTimeOutput.YM, DateTimePadding.ZERO, DateSeparator.SLASH);
    } else {
      this.endDate = $event;
    }
  }

  /** 詳細条件変更イベント */
  onChangeDetailCreditCondition($event): void {
    this.detailCreditConditionValue = $event;
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
    this.startDate = DateTimeUtils.format(DateTimeUtils.addMonths(today, - 1), DateTimeOutput.YM);
    // 当年月
    this.endDate = DateTimeUtils.format(today, DateTimeOutput.YM);
    // 当日の前月年月日
    this.defaultStartDate = this.startDate;
    // 当年月
    this.defaultEndDate = this.endDate;
  }

  /**
   * 締日の変更イベント
   */
  onChangeCutoffDay(cutoffDay: number): void {
    this.exportCreditConditionSearch.cutoffDay = cutoffDay;
    this.exportCreditService.setCutoffDay(this.exportCreditConditionSearch.cutoffDay);
  }

}
