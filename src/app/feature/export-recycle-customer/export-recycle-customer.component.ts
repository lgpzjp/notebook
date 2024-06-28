import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  QueryList,
  ViewChildren,
  Input,
} from '@angular/core';
import {
  AbstractContainer, BlDialogService, BlLoadingService, BlModalService,
} from '@blcloud/bl-ng-ui-component';
import {
  defer as _defer,
  forEach as _forEach,
  filter as _filter,
  map as _map,
} from 'lodash';
import { LoginResourceService, WithAllCompanyDiv } from '@blcloud/bl-ng-share-module';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { IExportPatternInfo, IOrganizationInformation } from '@blcloud/bl-datamodel';
import { RoleConst } from '@blcloud/bl-datamodel/const/role';
import { CustomerExportContent } from '@blcloud/bl-datamodel/enum/customer/customer-export-content';
import { ProductCode } from '@blcloud/bl-datamodel/enum/common/product-code';
import { BlAppContext } from '@blcloud/bl-ng-common';
import {
  ExportPatternSelectorComponent
} from '../../page/export-page/components/export-pattern-selector/export-pattern-selector.component';
import { AbstractConditionsComponent } from '../../page/export-page/components/abstract-conditions.component';
import { ExportPageService } from '../../page/export-page/export-page.service';
import { IDownloadContent } from '../../page/export-page/export-page.define';
import { DownloadModalComponent } from '../../shared/modal/download-modal/download-modal.component';
import { ExportRecycleCustomerService } from './export-recycle-customer.service';
import { IExportRecycleCustomerConditionInput } from './export-recycle-customer.define';
import { ExportRecycleCustomerConditionManager } from './export-recycle-customer.condition';

/**
 * リサイクル取引先出力コンポーネント
 */
@Component({
  selector: 'app-export-recycle-customer',
  templateUrl: './export-recycle-customer.component.html',
  styleUrls: ['./export-recycle-customer.component.scss'],
  providers: [
    ExportRecycleCustomerService,
    ExportRecycleCustomerConditionManager
  ]
})
export class ExportRecycleCustomerComponent extends AbstractContainer implements OnInit {

  /** 初期選択プロダクトコード */
  @Input() productCode: string;
  /** 業務選択肢 */
  @Input() systemItems: {value: string, text: string}[];
  /** データ出力パターン */
  @Input() dataExportPatterns: IExportPatternInfo[];

  /** タブフォーカスキーボードイベント */
  @Output() tabFocusKeyboardEvent = new EventEmitter();
  /** データ出力パターン変更イベント */
  @Output() changeExportPatternEvent: EventEmitter<IExportPatternInfo[]> = new EventEmitter();

  /** 出力条件 */
  public exportCondition: IExportRecycleCustomerConditionInput;
  /** 出力内容 */
  public readonly CustomerExportContentArray = [{ value: CustomerExportContent.Customer, text: '取引先' }];
  /** 全社設定取得区分 */
  public readonly WithAllCompanyDiv = WithAllCompanyDiv;
  /** テキスト出力情報タブ区分 */
  public readonly ExportInfoTabDiv = ExportInfoTabDiv;

  /** 詳細条件表示有無 */
  private isShowDetail = false;
  /** WebSocket接続済み */
  private webSocketConnected = false;
  /** 初期選択組織コード */
  private defaultSelectedOrganizationCode = '';

  /** 検索条件コンポーネント一覧 */
  @ViewChildren('detailCondition') detailConditionList: QueryList<AbstractConditionsComponent>;
  /** データ出力パターン選択コンポーネント */
  @ViewChild(ExportPatternSelectorComponent) exportPatternSelectorComponent: ExportPatternSelectorComponent;

  constructor(
    private exportCustomerService: ExportRecycleCustomerService,
    private dialogService: BlDialogService,
    private loadingService: BlLoadingService,
    private appContext: BlAppContext,
    private exportService: ExportPageService,
    private modalService: BlModalService,
    private loginResourceService: LoginResourceService,
  ) {
    super();
    this.exportService.invokeEventTabRecycleCustomer.subscribe(dataDownload => {
      this.showModalDownload(this.dataExportPatterns, dataDownload.infoDataDownload);
    });
  }

  /** @implements */
  ngOnInit() {
    // ログイン組織コードを取得
    this.exportService.getLoginUserInfo().subscribe(
      (loginUser) => {
        this.defaultSelectedOrganizationCode = loginUser.organizationCode;
        this.initConditions();
      }
    );
  }

  /**
   * テキスト出力パターンを更新
   */
  updateExportPattern(isLoadOld: boolean = false): void {
    this.exportPatternSelectorComponent.genTableExportPatternData(isLoadOld);
  }

  /**
   * 管理組織の変更イベント
   * @param org
   */
  onChangeOrgCode(org: IOrganizationInformation): void {
    this.exportCondition.organizationCode = org.organizationCode;
  }

  /**
   * 入力条件を初期化
   */
  private initConditions(): void {
    this.exportCondition = this.exportCustomerService.initCondition();
    this.exportCondition.organizationCode = this.defaultSelectedOrganizationCode;
  }

  /**
   * 条件を初期化する
   */
  onClearCondition(): void {
    this.updateExportPattern(true);
    this.initConditions();
  }

  /**
   * 出力ボタンを押下する時のイベント
   */
  onClickExport(): void {
    // ロール確認
    this.loadingService.show();
    this.loginResourceService.isAvailableFunction(RoleConst.ROLEID_FUNC_ALL_CUSTOMER_TEXT_OUTPUT).subscribe(
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

  /** 出力処理 */
  private export(): void {
    if (!this.exportCondition.outputInfo || this.exportCondition.outputInfo === '') {
      this.dialogService.warn('出力内容が指定されていません。', '確認').subscribe(dialogRef => {
        const el = document.activeElement;
        dialogRef.hide(el);
        this.loadingService.hide();
      });
      return;
    }

    // 出力内容
    this.exportCustomerService.setCustomerExportContent(this.exportCondition.outputInfo);
    // 更新対象期間
    this.exportCustomerService.setUpdateDateTime(this.exportCondition.startDate, this.exportCondition.endDate);
    // 管理組織
    this.exportCustomerService.setOrganizationCode(this.exportCondition.organizationCode);
    // 得意先コード
    this.exportCustomerService.setCustomerCode(this.exportCondition.customerCodeStart, this.exportCondition.customerCodeEnd);
    // 出力パターン
    this.exportCustomerService.setExportPatternCode(this.exportPatternSelectorComponent.getExportPatternCodeList());

    // プロダクトコード
    const productCodes = _map(
      _filter(this.systemItems, item => item.value !== ProductCode.Common), product => product.value
    );
    this.exportCustomerService.setProductCodes(productCodes);

    // クライアントセッションID
    const clientSessionId = this.appContext.getUuid() + ExportInfoTabDiv.RecycleCustomer;
    this.exportCustomerService.setClientSessionId(clientSessionId);

    // WebSocket接続
    if (!this.webSocketConnected) {
      this.exportService.connectWebSocket(ExportInfoTabDiv.RecycleCustomer, clientSessionId);
      this.webSocketConnected = true;
    }

    this.loadingService.show({ message: '出力処理中です。<br />しばらくお待ちください。' });
    this.exportCustomerService.export().subscribe(_response => { }, _error => { });
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
    this.detailConditionList.forEach(conditions => {
      conditions.open();
    });
  }

  /**
   * すべての詳細出力条件を非表示
   */
  private closeConditions(): void {
    this.detailConditionList.forEach(conditions => {
      conditions.close();
    });
  }

  /**
   * ファイルダウンロードのモーダル画面を表示
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
  onStartDateChange(startDate: string): void {
    this.exportCondition.startDate = startDate;
  }

  /** 終了日変更イベント */
  onEndDateChange(endDate: string): void {
    this.exportCondition.endDate = endDate;
  }

  /** データ出力パターン変更イベント */
  onChangeDataExportPattern(data: IExportPatternInfo[]) {
    this.dataExportPatterns = data;
    this.changeExportPatternEvent.emit(data);
  }
}
