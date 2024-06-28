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
  AbstractContainer, BlDialogService, BlLoadingService, BlModalService, Era, ModalReason
} from '@blcloud/bl-ng-ui-component';
import { RoleConst } from '@blcloud/bl-datamodel/const/role';
import { DateTimeUtils } from '@blcloud/bl-common';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';
import { ExportGlassDepositConditionManager } from './export-glass-deposit.condition';
import { LoginResourceService } from '@blcloud/bl-ng-share-module';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { IExportPatternInfo } from '@blcloud/bl-datamodel';
import { BlAppContext } from '@blcloud/bl-ng-common';
import { CompanyConst } from '@blcloud/bl-datamodel/const/company';
import {
  ExportPatternSelectorComponent
} from '../../page/export-page/components/export-pattern-selector/export-pattern-selector.component';
import { DatePickerConditionComponent } from '../../page/export-page/components/date-picker-condition/date-picker-condition.component';
import { AbstractConditionsComponent } from '../../page/export-page/components/abstract-conditions.component';
import { ExportPageService } from '../../page/export-page/export-page.service';
import {
  CSVNotFoundMessage,
  IDownloadContent, MaxCSVCountSize
} from '../../page/export-page/export-page.define';
import { DownloadModalComponent } from '../../shared/modal/download-modal/download-modal.component';
import { IExportGlassDepositConditionInput, ExportDepositDivArray } from './export-glass-deposit.define';
import { ExportGlassDepositService } from './export-glass-deposit.service';
import { RangeOrganizationComponent } from '../../feature/range-organization/range-organization.component';
import { IselectObject, SelectTypeEnum } from './../range-organization/range-organization.define';
import {
  first as _first,
  forEach as _forEach,
  defer as _defer,
} from 'lodash';

/**
 * 硝子入金情報コンポーネント
 */
@Component({
  selector: 'app-export-glass-deposit',
  templateUrl: './export-glass-deposit.component.html',
  styleUrls: ['./export-glass-deposit.component.scss'],
  providers: [ExportGlassDepositService, ExportGlassDepositConditionManager]
})
export class ExportGlassDepositComponent extends AbstractContainer implements OnInit {
  /** 詳細条件表示有無 */
  private isShowDetail = false;
  /** 売上伝票出力条件 */
  public exportCondition: IExportGlassDepositConditionInput;
  /** 開始日付 */
  public startDate: string;
  /** 終了日付 */
  public endDate: string;
  /** 出力タイプ */
  public ExportDepositDivArray = ExportDepositDivArray;
  /** 初期選択組織コード */
  private defaultSelectedOrganizationCode: string;
  /** テキスト出力情報タブ区分 */
  public readonly exportInfoTabDiv = ExportInfoTabDiv;
  /** 西暦 */
  readonly ad = Era.Ad;
  /** 組織情報(範囲指定/個別指定) */
  public organizationObject: IselectObject = {
    selectType: SelectTypeEnum.RANGE,
    focus: null,
    organizationCodeFrom: null,
    organizationCodeTo: null,
    organizationList: [null, null, null, null, null, null, null, null, null, null],
    allOrganizationCode: [CompanyConst.ORGANIZATION_CODE_ALL_COMPANY]
  };

  /** 詳細条件コンポーネント配列 */
  @ViewChildren('detailConditionDeposit') conditionsList: QueryList<AbstractConditionsComponent>;
  /** データ出力パターン選択コンポーネント */
  @ViewChild(ExportPatternSelectorComponent) exportPatternSelectorComponent: ExportPatternSelectorComponent;
  /** 日付入力コンポーネント */
  @ViewChild(DatePickerConditionComponent) datePickerCondition: DatePickerConditionComponent;
  /** 組織 個別/範囲指定切り替えコンポーネント */
  @ViewChild(RangeOrganizationComponent) private RangeOrganization: RangeOrganizationComponent;
  /** データ出力パターン */
  @Input() dataExportPatterns: IExportPatternInfo[];
  /** 業務選択肢 */
  @Input() systemItems: { value: string, text: string }[];
  /** タブフォーカスキーボードイベント */
  @Output() tabFocusKeyboardEvent = new EventEmitter();
  /** データ出力パターン変更イベント */
  @Output() changeExportPatternEvent: EventEmitter<IExportPatternInfo[]> = new EventEmitter();
  /* ガイド非活性イベント */
  @Output() guideDisabledEvent: EventEmitter<object> = new EventEmitter();
  /** WebSocket接続済み */
  @Input() webSocketConnected: boolean;
  /** WebSocket変更イベント */
  @Output() changeWebSocketConnected: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private exportGlassDepositService: ExportGlassDepositService,
    private dialogService: BlDialogService,
    private loadingService: BlLoadingService,
    private appContext: BlAppContext,
    private exportService: ExportPageService,
    private modalService: BlModalService,
    private loginResourceService: LoginResourceService
  ) {
    super();
    this.exportService.invokeEventTabGlassDepositSlip.subscribe(dataDownload => {
      this.showModalDownload(this.dataExportPatterns, dataDownload.infoDataDownload);
    });
  }

  /**
   * 初期化
   */
  ngOnInit() {
    this.initConditions();
    this.exportCondition.organization = CompanyConst.ORGANIZATION_CODE_ALL_COMPANY;
    this.defaultSelectedOrganizationCode = CompanyConst.ORGANIZATION_CODE_ALL_COMPANY;
    this.exportGlassDepositService.defaultSelectedOrganizationCode = CompanyConst.ORGANIZATION_CODE_ALL_COMPANY;
    // 対象期間_日付初期化
    this.onInitDatePicker();
  }

  /**
   * テキスト出力を更新
   * @param isLoadOld load pattern selected on old session
   */
  updateExportPattern(isLoadOld: boolean = false): void {
    this.exportPatternSelectorComponent.genTableExportPatternData(isLoadOld);
  }

  /**
   * 入力条件を初期化
   */
  private initConditions(): void {
    this.exportCondition = this.exportGlassDepositService.initCondition();
  }

  /**
   * 初期値にする
   */
  onClearCondition(): void {
    this.datePickerCondition.startDate = this.startDate;
    this.datePickerCondition.endDate = this.endDate;
    this.exportCondition = this.exportGlassDepositService.initCondition();
    this.organizationObject.selectType = SelectTypeEnum.RANGE;
    this.organizationObject.organizationCodeFrom = '';
    this.organizationObject.organizationCodeTo = '';
  }

  /**
   * 出力ボタンを押下する時のイベント
   */
  onClickExport(): void {
    // ロール確認
    this.loadingService.show();
    this.loginResourceService.isAvailableFunction(RoleConst.ROLEID_FUNC_ALL_SALESSLIP_TEXT_OUTPUT).subscribe(
      isAvailable => {
        if (isAvailable) {
          this.executeBeforeExport();
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
   * 出力前処理
   */
  private executeBeforeExport() {
    // 出力条件チェック
    if (!this.exportPatternSelectorComponent.getExportPatternCodeList
      || this.exportPatternSelectorComponent.getExportPatternCodeList().length === 0) {
      this.dialogService.warn('出力パターン情報項目は必須項目です。選択してください。', '確認').subscribe(dialogRef => {
        const el = document.activeElement;
        dialogRef.hide(el);
        this.loadingService.hide();
      });
      return;
    }
    // 出力条件設定
    this.setExportConditions();
    // 出力件数を取得
    this.exportGlassDepositService.getCount().subscribe(res => {
      // 0件の場合は条件確認ダイアログを表示
      if (res && res.totalCount === 0) {
        this.loadingService.hide();
        this.dialogService.info(CSVNotFoundMessage).subscribe(ref => {
          ref.hide();
        });
      } else if (res && res.totalCount > MaxCSVCountSize) {
        // 規定数を超える場合は分割確認ダイアログを表示
        this.loadingService.hide();
        this.dialogService.confirm(`出力件数が${MaxCSVCountSize}件を超えています。\n分割出力を行いますか？`).subscribe(ref => {
          ref.hide();
          // 分割出力
          if (ref.reason === ModalReason.Done) {
            this.export(true);
          }
        });
      } else {
        // 規定数以下の場合は一括出力
        this.export(false);
      }
    }, error => {
      this.loadingService.hide();
      this.dialogService.error(_first(error.messages)).subscribe(ref => {
        ref.hide();
      });
    });
  }

  /**
   * 出力条件設定
   */
  private setExportConditions() {
    this.exportGlassDepositService.setExportPatternCodeList(this.exportPatternSelectorComponent.getExportPatternCodeList());
    this.exportGlassDepositService.setDate(this.exportCondition.startDate, this.exportCondition.endDate);
    this.exportGlassDepositService.setCutoffDay(this.exportCondition.cutoffDay);
    this.exportGlassDepositService.setOrganizationObject(this.organizationObject);
    this.exportGlassDepositService.setOutPutHeaderDiv(this.exportCondition.outPutHeaderDiv);
    this.exportGlassDepositService.setOutPutOrderDiv(this.exportCondition.outPutOrderDiv);
    const productCodes = ProductCode.Glass;
    this.exportGlassDepositService.setProductCodes(productCodes);
    const clientSessionId = this.appContext.getUuid() + 'salesSlip';
    this.exportGlassDepositService.setClientSessionId(clientSessionId);
    if (!this.webSocketConnected) {
      this.exportService.connectWebSocket(ExportInfoTabDiv.GlassDeposit, clientSessionId, true);
      this.webSocketConnected = true;
      this.changeWebSocketConnected.emit(this.webSocketConnected);
    }
  }

  /**
   * テキスト出力処理
   */
  private export(isSplit: boolean) {
    // クエリ検索条件のパラメータ作成を開始
    this.loadingService.show({ message: '出力処理中です。<br />しばらくお待ちください。' });
    this.setExportConditions();
    this.exportGlassDepositService.export(isSplit).subscribe(() => {
    }, e => {
      // kongによる60秒エラー対策のため500エラーのハンドリングは行わない
      if (e.status !== 500) {
        this.loadingService.hide();
        this.dialogService.error(e.messages).subscribe(ref => {
          ref.hide();
        });
      }
    });
  }

  /**
   * 詳細パネル表示イベント
   */
  onClickDetailButton(): void {
    this.toggleDetailCondition();
  }

  /**
   * 詳細条件表示切替
   */
  private toggleDetailCondition(): void {
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
   * 出力タイプの変更イベント
   * @param exportInfoType
   */
  onChangeExportInfoType(exportInfoType: string): void {
    this.exportCondition.exportInfoType = exportInfoType;
  }

  /**
   * ファイルダウンロードのモーダル画面を表示
   * exportInfoDivEnumNameを取り出す
   * @param dataDivSortExportTab1
   * @param listFile APIより返却されたcsvファイルの一覧
   */
  private showModalDownload(dataDivSortExportTab1: IExportPatternInfo[], listFile: IDownloadContent[]): void {
    const tmpFile = [];
    _forEach(listFile, (file, fileIndex) => {
      let keepGoing = true;
      _forEach(dataDivSortExportTab1, items => {
        if (keepGoing) {
          if (items.exportInfoDiv === file.exportInfoDiv) {
            tmpFile.push({
              exportInfoDiv: items.exportInfoDiv,
              urlDownload: file.urlDownload.toString(),
              exportInfoDivEnumName: `${items.exportInfoDivEnumName}_(${fileIndex + 1}/${listFile.length})`
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

  /** 開始日付変更イベント */
  onStartDateChange($event: string): void {
    this.exportCondition.startDate = $event;
  }

  /** 終了日付変更イベント */
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
    this.startDate = DateTimeUtils.formatIso(DateTimeUtils.addMonths(today, -1));
    // 当年月日
    this.endDate = DateTimeUtils.formatIso(today);
  }

  /** 管理組織コードリセット */
  resetOrgCode(): void {
    this.exportCondition.organization = this.defaultSelectedOrganizationCode;
  }

  /**
   * フォーカス処理
   * @param event 変更値
   */
  onGuideDisabledEvent(event: object): void {
    this.guideDisabledEvent.emit(event);
  }

  /**
   * 組織情報設定
   * @param event 組織情報
   */
  onSelectInfoEvent(event: IselectObject): void {
    this.organizationObject = event;
  }

  /**
   * 組織ガイドボタンクリックイベント
   * @param element
   */
  onClickOrganizationGuide(element) {
    this.RangeOrganization.onClickOrganizationGuide(element);
  }
}
