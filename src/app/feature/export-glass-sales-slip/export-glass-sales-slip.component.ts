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
  AbstractContainer, BlDialogService, BlLoadingService, BlModalService, Era, ModalReason,
} from '@blcloud/bl-ng-ui-component';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';
import { DateTimeUtils } from '@blcloud/bl-common';
import { SalesSlipSupplierSelectArray } from '@blcloud/bl-datamodel/enum/sales/sales-slip-supplier-select';
import { LoginResourceService } from '@blcloud/bl-ng-share-module';
import { GlassSalesSlipDivScreen } from '@blcloud/bl-datamodel/enum/sales/glass-sales-slip-div-screen';
import { GlassSalesSlipDivScreenMap } from '@blcloud/bl-datamodel/enum/sales/glass-sales-slip-div-screen';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { BlAppContext } from '@blcloud/bl-ng-common';
import { IExportPatternInfo } from '@blcloud/bl-datamodel';
import { RoleConst } from '@blcloud/bl-datamodel/const/role';
import { CompanyConst } from '@blcloud/bl-datamodel/const/company';

import {
  ExportPatternSelectorComponent
} from '../../page/export-page/components/export-pattern-selector/export-pattern-selector.component';
import { DatePickerConditionComponent } from '../../page/export-page/components/date-picker-condition/date-picker-condition.component';
import { AbstractConditionsComponent } from '../../page/export-page/components/abstract-conditions.component';
import { ExportPageService } from '../../page/export-page/export-page.service';
import { CSVNotFoundMessage, IDownloadContent, MaxCSVCountSize } from '../../page/export-page/export-page.define';
import { DownloadModalComponent } from '../../shared/modal/download-modal/download-modal.component';
import {
  IExportGlassSalesSlipConditionInput,
  ExportSlipTypeDivArray,
  ExportSlipTypeDiv,
  ExportPartsWorkDiv,
  StatisticalAnalysisMaxCSVCountSize,
} from './export-glass-sales-slip.define';
import { ExportGlassSalesSlipService } from './export-glass-sales-slip.service';
import { ExportGlassSalesSlipConditionManager } from './export-glass-sales-slip.condition';
import { RangeOrganizationComponent } from '../../feature/range-organization/range-organization.component';
import { IselectObject, SelectTypeEnum } from './../range-organization/range-organization.define';
import {
  first as _first,
  forEach as _forEach,
  defer as _defer,
} from 'lodash';

/**
 * 硝子売上伝票出力コンポーネント
 */
@Component({
  selector: 'app-export-glass-sales-slip',
  templateUrl: './export-glass-sales-slip.component.html',
  styleUrls: ['./export-glass-sales-slip.component.scss'],
  providers: [ExportGlassSalesSlipService, ExportGlassSalesSlipConditionManager]
})
export class ExportGlassSalesSlipComponent extends AbstractContainer implements OnInit {
  /** 詳細条件表示有無 */
  private isShowDetail = false;
  /** 終了日表示フラグ */
  public displayEndDate = true;
  /** 売上伝票出力条件 */
  public exportCondition: IExportGlassSalesSlipConditionInput;
  /** 開始日付 */
  public startDate: string;
  /** 終了日付 */
  public endDate: string;
  /** 対象期間 */
  readonly SalesSlipSupplierSelectArray = SalesSlipSupplierSelectArray;
  /** 出力タイプ */
  public ExportSlipTypeDivArray = ExportSlipTypeDivArray;
  /** 初期選択組織コード */
  private defaultSelectedOrganizationCode: string;
  /** 組織情報(範囲指定/個別指定) */
  public organizationObject: IselectObject = {
    selectType: SelectTypeEnum.RANGE,
    focus: null,
    organizationCodeFrom: null,
    organizationCodeTo: null,
    organizationList: [null, null, null, null, null, null, null, null, null, null],
    allOrganizationCode: [CompanyConst.ORGANIZATION_CODE_ALL_COMPANY]
  };
  /** 『硝子商売上伝票区分』を表します。 */
  public readonly glassSalesSlipDivScreen = GlassSalesSlipDivScreen;
  /** 『硝子商売上伝票区分』の連想配列情報 */
  public readonly glassSalesSlipDivScreenMap = GlassSalesSlipDivScreenMap;
  /** テキスト出力情報タブ区分 */
  public readonly exportInfoTabDiv = ExportInfoTabDiv;
  /** 西暦 */
  readonly ad = Era.Ad;

  /** 詳細条件コンポーネント配列 */
  @ViewChildren('detailConditionSalesSlip') conditionsList: QueryList<AbstractConditionsComponent>;
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
    private exportGlassSalesSlipService: ExportGlassSalesSlipService,
    private dialogService: BlDialogService,
    private loadingService: BlLoadingService,
    private appContext: BlAppContext,
    private exportService: ExportPageService,
    private modalService: BlModalService,
    private loginResourceService: LoginResourceService
  ) {
    super();
    this.exportService.invokeEventTabGlassSalesSlipSlip.subscribe(dataDownload => {
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
    this.exportGlassSalesSlipService.defaultSelectedOrganizationCode = CompanyConst.ORGANIZATION_CODE_ALL_COMPANY;
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
   * 掛売上の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentCreditSales(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.creditSales = true;
    } else {
      this.exportCondition.creditSales = false;
    }
  }

  /**
   * 掛返品の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentCreditReturned(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.creditReturned = true;
    } else {
      this.exportCondition.creditReturned = false;
    }
  }

  /**
   * 現金売上の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentCashSales(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.cashSales = true;
    } else {
      this.exportCondition.cashSales = false;
    }
  }

  /**
   * 現金返品の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentCashReturned(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.cashReturned = true;
    } else {
      this.exportCondition.cashReturned = false;
    }
  }

  /**
   * クレームの変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentClaim(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.claim = true;
    } else {
      this.exportCondition.claim = false;
    }
  }

  /**
   * 指示書の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentDirection(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.direction = true;
    } else {
      this.exportCondition.direction = false;
    }
  }

  /**
   * 一時保存の変更イベント | 出力内容
   * @param event
   */
  onChangeSlipExportContentTemporarySave(event: Event): void {
    if ((<HTMLInputElement>event.target).checked) {
      this.exportCondition.temporarySave = true;
    } else {
      this.exportCondition.temporarySave = false;
    }
  }

  /**
   * 対象期間の変更イベント
   * @param event
   */
  onChangeTargetPeriod(event: string): void {
    this.exportCondition.targetPeriod = event;
    this.exportCondition.creditSales = true;
    this.exportCondition.creditReturned = true;
    this.exportCondition.cashSales = true;
    this.exportCondition.cashReturned = true;
    this.exportCondition.claim = false;
    this.exportCondition.direction = false;
    this.exportCondition.temporarySave = false;
    this.exportGlassSalesSlipService.setTargetPeriod(this.exportCondition.targetPeriod);
  }

  /**
   * 出力タイプの変更イベント
   * @param exportInfoType bl-select return value
   */
  onChangeExportInfoType(exportInfoType: string): void {
    this.exportCondition.exportInfoType = exportInfoType;
    if (exportInfoType !== ExportSlipTypeDiv.StatisticalAnalysis) {
      this.exportCondition.dispBusinessCodeS = null;
      this.exportCondition.dispBusinessCodeE = null;
      this.exportCondition.areaCdS = null;
      this.exportCondition.areaCdE = null;
    }
    this.exportPatternSelectorComponent.exportCondition = this.exportCondition;
    this.updateExportPattern(true);
  }

  /**
   * 入力条件を初期化
   */
  private initConditions(): void {
    this.exportCondition = this.exportGlassSalesSlipService.initCondition();
  }

  /**
   * 初期値にする
   */
  onClearCondition(): void {
    this.datePickerCondition.startDate = this.startDate;
    this.datePickerCondition.endDate = this.endDate;
    this.exportCondition = this.exportGlassSalesSlipService.initCondition();
    this.organizationObject.selectType = SelectTypeEnum.RANGE;
    this.organizationObject.organizationCodeFrom = '';
    this.organizationObject.organizationCodeTo = '';
    this.displayEndDate = true;
    this.exportGlassSalesSlipService.setTargetPeriod(this.exportCondition.targetPeriod);
    this.onChangeExportInfoType(ExportSlipTypeDiv.Slip);
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
    const salesSlipDivList: string[] = [];
    if (this.exportCondition.creditSales) {
      salesSlipDivList.push(this.glassSalesSlipDivScreen.CreditSales);
    }
    if (this.exportCondition.creditReturned) {
      salesSlipDivList.push(this.glassSalesSlipDivScreen.CreditReturned);
    }
    if (this.exportCondition.cashSales) {
      salesSlipDivList.push(this.glassSalesSlipDivScreen.CashSales);
    }
    if (this.exportCondition.cashReturned) {
      salesSlipDivList.push(this.glassSalesSlipDivScreen.CashReturned);
    }
    if (this.exportCondition.claim) {
      salesSlipDivList.push(this.glassSalesSlipDivScreen.Claim);
    }
    if (this.exportCondition.direction) {
      salesSlipDivList.push(this.glassSalesSlipDivScreen.Direction);
    }
    if (this.exportCondition.temporarySave) {
      salesSlipDivList.push(this.glassSalesSlipDivScreen.TemporarySave);
    }
    if (!salesSlipDivList || salesSlipDivList.length === 0) {
      this.dialogService.warn('出力内容が指定されていません。', '確認').subscribe(dialogRef => {
        const el = document.activeElement;
        dialogRef.hide(el);
        this.loadingService.hide();
      });
      return;
    }
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
    this.setExportConditions(salesSlipDivList);
    // 統計分析タイプの場合は出力件数の最大値を変更
    let maxCSVCountSize = MaxCSVCountSize;
    if (this.exportCondition.exportInfoType === ExportSlipTypeDiv.StatisticalAnalysis) {
      maxCSVCountSize = StatisticalAnalysisMaxCSVCountSize;
    }
    // 出力件数を取得
    this.exportGlassSalesSlipService.getCount().subscribe(res => {
      // 0件の場合は条件確認ダイアログを表示
      if (res && res.totalCount === 0) {
        this.loadingService.hide();
        this.dialogService.info(CSVNotFoundMessage).subscribe(ref => {
          ref.hide();
        });
      } else if (res && res.totalCount > maxCSVCountSize) {
        // 規定数を超える場合は分割確認ダイアログを表示
        this.loadingService.hide();
        this.dialogService.confirm(`出力件数が${maxCSVCountSize}件を超えています。\n分割出力を行いますか？`).subscribe(ref => {
          ref.hide();
          // 分割出力
          if (ref.reason === ModalReason.Done) {
            this.export(salesSlipDivList, true);
          }
        });
      } else {
        // 規定数以下の場合は一括出力
        this.export(salesSlipDivList, false);
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
   * @param salesSlipDivList 硝子商売上伝票区分配列
   */
  private setExportConditions(salesSlipDivList: string[]) {
    // クエリ検索条件のパラメータ作成を開始
    this.exportGlassSalesSlipService.setExportPatternCodeList(this.exportPatternSelectorComponent.getExportPatternCodeList());
    this.exportGlassSalesSlipService.setSalesSlipDivList(salesSlipDivList);
    this.exportGlassSalesSlipService.setDate(this.exportCondition.startDate,
      this.exportCondition.endDate, this.exportCondition.targetPeriod);
    this.exportGlassSalesSlipService.setOrganizationObject(this.organizationObject);
    this.exportGlassSalesSlipService.setCustomerCode(this.exportCondition.customerCodeS, this.exportCondition.customerCodeE);
    this.exportGlassSalesSlipService.setPicEmployeeCode(this.exportCondition.picEmployeeCodeS, this.exportCondition.picEmployeeCodeE);
    this.exportGlassSalesSlipService.setOutPutHeaderDiv(this.exportCondition.outPutHeaderDiv);
    if (this.exportCondition.cutoffDay !== 0) {
      this.exportGlassSalesSlipService.setCutoffDay(String(this.exportCondition.cutoffDay));
    }
    this.exportGlassSalesSlipService.setOutPutOrderDiv(this.exportCondition.outPutOrderDiv);
    // テキスト出力伝票タイプ区分が「伝票タイプ」以外 かつ 部品作業区分が「全て」以外の場合
    if (this.exportCondition.exportInfoType !== ExportSlipTypeDiv.Slip && this.exportCondition.glassClassDiv !== ExportPartsWorkDiv.All) {
      this.exportGlassSalesSlipService.setGlassClassDiv(this.exportCondition.glassClassDiv);
    }
    // テキスト出力伝票タイプ区分が統計分析タイプの場合
    if (this.exportCondition.exportInfoType === ExportSlipTypeDiv.StatisticalAnalysis) {
      this.exportGlassSalesSlipService.setDispBusinessCode(this.exportCondition.dispBusinessCodeS,
        this.exportCondition.dispBusinessCodeE);
      this.exportGlassSalesSlipService.setAreaCd(this.exportCondition.areaCdS, this.exportCondition.areaCdE);
    }
    const productCodes = ProductCode.Glass;
    this.exportGlassSalesSlipService.setProductCodes(productCodes);
    const clientSessionId = this.appContext.getUuid() + 'salesSlip';
    this.exportGlassSalesSlipService.setClientSessionId(clientSessionId);
    if (!this.webSocketConnected) {
      this.exportService.connectWebSocket(ExportInfoTabDiv.GlassSalesSlip, clientSessionId, true);
      this.webSocketConnected = true;
      this.changeWebSocketConnected.emit(this.webSocketConnected);
    }
  }

  /**
   * テキスト出力処理
   * @param salesSlipDivList 硝子商売上伝票区分配列
   * @param isSplit 分割フラグ
   */
  private export(salesSlipDivList: string[], isSplit: boolean) {
    this.setExportConditions(salesSlipDivList);
    this.loadingService.show({ message: '出力処理中です。<br />しばらくお待ちください。' });
    this.exportGlassSalesSlipService.export(
      isSplit,
      this.exportCondition.exportInfoType === ExportSlipTypeDiv.StatisticalAnalysis
    ).subscribe(() => {
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
