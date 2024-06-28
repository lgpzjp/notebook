import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { of as RxOf } from 'rxjs/observable/of';
import { forkJoin as RxForkJoin } from 'rxjs/observable/forkJoin';
import {
  isNil as _isNil, isEmpty as _isEmpty, includes as _includes, find as _find, filter as _filter, forEach as _forEach, map as _map
} from 'lodash';

import { DateTimeUtils, DateTimeOutput, DateTimePadding, DateSeparator, DateEra, StringUtils, NumberUtils } from '@blcloud/bl-common';
import { CommonConst } from '@blcloud/bl-datamodel/const/common';
import { CompanyConst } from '@blcloud/bl-datamodel/const/company';
import { DataExportTaget } from '@blcloud/bl-datamodel/enum/output/data-export-taget';
import { SalesSlipExportSlipDivMap } from '@blcloud/bl-datamodel/enum/sales/sales-slip-export-slip-div';
import { SalesSlipExportRedSlipDivMap } from '@blcloud/bl-datamodel/enum/sales/sales-slip-export-red-slip-div';
import { SalesSlipExportIssueTypeDivMap } from '@blcloud/bl-datamodel/enum/sales/sales-slip-export-issue-type-div';
import { GlassSalesSlipDivScreenMap } from '@blcloud/bl-datamodel/enum/sales/glass-sales-slip-div-screen';
import { DataExportTargetPeriodDivMap } from '@blcloud/bl-datamodel/enum/output/data-export-target-period-div';
import { OutputDivArray } from '@blcloud/bl-datamodel/enum/common/output-div';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { GlassPurchaseSlipDivMap } from '@blcloud/bl-datamodel/enum/purchase/glass-purchase-slip-div';
import { CodeDivGenre } from '@blcloud/bl-datamodel/enum/common/code-div-genre';
import { FeeRankUseDiv } from '@blcloud/bl-datamodel/enum/vehicle/fee-rank-use-div';
import { LogicalDeleteDiv } from '@blcloud/bl-datamodel/enum/common/logical-delete-div';
import { DmExtractTableDiv } from '@blcloud/bl-datamodel/enum/approach/dm-extract-table-div';
import { DmSendDiv } from '@blcloud/bl-datamodel/enum/approach/dm-send-div';
import { SexDivMap } from '@blcloud/bl-datamodel/enum/common/sex-div';
import { DmInvitationInitSelectDivMap } from '@blcloud/bl-datamodel/enum/approach/dm-invitation-init-select-div';
import {
  IGenericDataExportInfo, IDmExtractConditionItem, IEmployee, IVehicleMgtSetting, IVehicleMaintFeeRankRef, IDmExtractMenu, ITicketSetting
} from '@blcloud/bl-datamodel';
import {
  EmployeeResource, VehicleMgtSettingResource, VehicleMaintFeeRankRefResource, DmExtractMenuResource, TicketSettingResource
} from '@blcloud/bl-ng-resource';
import { BlConditionType } from '@blcloud/bl-ng-common';
import { AbstractBlModal, ModalButtonType, ModalButtonSetting, ModalButton } from '@blcloud/bl-ng-ui-component';
import {
  OrganizationInformationResourceService,
  TransportBranchNameSettingResourceService,
  DivisionResourceService,
  FrontDivisionBody,
} from '@blcloud/bl-ng-share-module';

import {
  ExportOrderDivArray,
  ExportPartsWorkDivArray
} from '../../../export-page/components/detail-glass-sales-slip-condition/detail-glass-sales-slip-condition.define';
import {
  ExportOrderDivArray as PurchaseExportOrderDivArray,
} from '../../../export-request-page/panel/glass-purchase-slip/export-glass-purchase-slip.define';
import { SelectTypeEnum, selectTypeArray } from '../../../../feature/range-organization/range-organization.define';
import { ExportCustomerDivArray } from '../../../../feature/export-glass-customer/export-glass-customer.define';
import { ExportSlipTypeDivArray } from '../../../export-request-page/panel/glass-sales-slip/export-glass-sales-slip.define';

/** データ出力抽出条件項目インターフェース定義 */
export interface IExportConditionItem {
  label: string;
  value: string;
}

/**
 * データ出力抽出条件モーダルコンポーネント
 */
@Component({
  templateUrl: 'export-condition-modal.component.html',
  styleUrls: ['./export-condition-modal.component.scss'],
})
export class ExportConditionModalComponent extends AbstractBlModal {
  /** タイトル */
  _title = 'データ出力抽出条件';

  /** フッターボタンタイプ */
  _footerButtonType: ModalButtonType = ModalButtonType.Cancel;

  /** キャンセルボタン設定 */
  _cancelButtonSetting: ModalButtonSetting = { label: '閉じる' };

  /** 抽出条件項目リスト */
  _conditionItems: IExportConditionItem[] = [];

  /**
   * コンストラクタ
   */
  constructor(
    private employeeResource: EmployeeResource,
    private vehicleMgtSettingResource: VehicleMgtSettingResource,
    private vehicleMaintFeeRankRefResource: VehicleMaintFeeRankRefResource,
    private organizationInformationResourceService: OrganizationInformationResourceService,
    private transportBranchNameSettingResourceService: TransportBranchNameSettingResourceService,
    private divisionResourceService: DivisionResourceService,
    private dmExtractMenuResource: DmExtractMenuResource,
    private ticketSettingResource: TicketSettingResource,
  ) {
    super();
  }

  /** @override */
  onShown(): void {
    if (this.data) {
      this.createDispConditinItems(this.data);
    }

    this.focusFooterButton(ModalButton.Cancel);
  }

  /** @override */
  getResults() {
    return null;
  }

  /**
   * 表示する抽出条件項目リストを作成します。
   * @param info 汎用データ出力情報
   */
  private createDispConditinItems(info: IGenericDataExportInfo) {
    this._conditionItems = [];

    try {
      switch (info.dataExportTaget) {
        case DataExportTaget.PmSalesSlip:
          this.createDispConditionItemsPmSalesSlip(info);
          break;
        case DataExportTaget.GLASS:
          this.createDispConditionItemsGlass(info);
          break;
        case DataExportTaget.DM:
          this.createDispConditionItemsDm(info);
          break;
      }
    } catch {}
  }

  /**
   * 表示する抽出条件項目リストを作成します。（Glass）
   * @param info 汎用データ出力情報
   */
  private createDispConditionItemsGlass(info: IGenericDataExportInfo) {
    if (_isNil(info) || _isNil(info.glassExportSearchInfo)) {
      return;
    }

    this._conditionItems = [];

    const condition = info.glassExportSearchInfo;

    // テキスト出力情報タブ区分
    let exportInfoTab = null;
    if (!_isEmpty(condition.exportPatternCodeList)) {
      exportInfoTab = String(condition.exportPatternCodeList[0]);
    }

    if (exportInfoTab === ExportInfoTabDiv.GlassSalesSlip && condition.salesSlipDivList && !_isEmpty(condition.salesSlipDivList)) {
      const listOfSalesSlip: string[] = condition.salesSlipDivList.map(key => {
        const value = GlassSalesSlipDivScreenMap[key];
        return value || '';
      });
      this._conditionItems.push({ label: '出力内容', value: listOfSalesSlip.join(',') });
    }

    if (exportInfoTab === ExportInfoTabDiv.GlassPurchaseSlip && condition.glassPurchaseSlipDivList
          && !_isEmpty(condition.glassPurchaseSlipDivList)) {
      const listOfSalesSlip: string[] = condition.glassPurchaseSlipDivList.map(key => {
        const value = GlassPurchaseSlipDivMap[key];
        return value || '';
      });
      this._conditionItems.push({ label: '出力内容', value: listOfSalesSlip.join(',') });
    }

    if (exportInfoTab === ExportInfoTabDiv.GlassCustomer && condition.customerExportContent && !_isEmpty(condition.customerExportContent)) {
      this._conditionItems.push({ label: '出力内容', value: ExportCustomerDivArray[condition.customerExportContent].text });
    }

    if (condition.dataExportTargetPeriodStDate && condition.dataExportTargetPeriodEdDate) {
      let dataExportTargetPeriodStDate = this.formatJapanEra(condition.dataExportTargetPeriodStDate);
      const dataExportTargetPeriodEdDate = this.formatJapanEra(condition.dataExportTargetPeriodEdDate);
      if (exportInfoTab === ExportInfoTabDiv.GlassSalesSlip && condition.dataExportTargetPeriodDiv) {
        dataExportTargetPeriodStDate =
          DataExportTargetPeriodDivMap[condition.dataExportTargetPeriodDiv] +
          "　" +
          dataExportTargetPeriodStDate;
      }
      if (dataExportTargetPeriodStDate && dataExportTargetPeriodEdDate) {
        this._conditionItems.push({ label: '対象期間', value: `${dataExportTargetPeriodStDate} ～ ${dataExportTargetPeriodEdDate}` });
      }
    }

    // 出力タイプ
    if (condition.glassExportSlipTypeDiv) {
      this._conditionItems.push({ label: '出力タイプ', value: ExportSlipTypeDivArray[condition.glassExportSlipTypeDiv].text });
    }

    // 管理組織
    if (condition.organizationCodeList && !_isEmpty(condition.organizationCodeList)) {
      if (_includes(condition.organizationCodeList, CompanyConst.ORGANIZATION_CODE_ALL_COMPANY)) {
        // 全組織
        this._conditionItems.push({ label: selectTypeArray[SelectTypeEnum.ALL_ORGANAIZATION].name, value: '' });
      } else {
        // 個別指定
        this._conditionItems.push({
          label: "管理組織-" + selectTypeArray[SelectTypeEnum.INDIVIDUAL].name,
          value: condition.organizationCodeList.join(","),
        });
      }
    } else if (condition.organizationCodeStart && condition.organizationCodeEnd) {
      // 範囲指定
      this._conditionItems.push({
        label: "管理組織-" + selectTypeArray[SelectTypeEnum.RANGE].name,
        value: `${condition.organizationCodeStart} ～ ${condition.organizationCodeEnd}`,
      });
    }

    if (exportInfoTab === ExportInfoTabDiv.GlassSalesSlip) {
      if (condition.customerCodeStart && condition.customerCodeEnd) {
        this._conditionItems.push({ label: '得意先コード', value: `${condition.customerCodeStart} ～ ${condition.customerCodeEnd}` });
      }
      if (condition.picEmployeeCodeStart && condition.picEmployeeCodeEnd) {
        this._conditionItems.push({ label: '担当者コード', value: `${condition.picEmployeeCodeStart} ～ ${condition.picEmployeeCodeEnd}` });
      }
    }

    if (exportInfoTab === ExportInfoTabDiv.GlassPurchaseSlip) {
      if (condition.customerCodeStart && condition.customerCodeEnd) {
        this._conditionItems.push({ label: '仕入先コード', value: `${condition.customerCodeStart} ～ ${condition.customerCodeEnd}` });
      }
      if (condition.picEmployeeCodeStart && condition.picEmployeeCodeEnd) {
        this._conditionItems.push({ label: '担当者コード', value: `${condition.picEmployeeCodeStart} ～ ${condition.picEmployeeCodeEnd}` });
      }
    }

    if (exportInfoTab === ExportInfoTabDiv.GlassCustomer) {
      if (condition.customerCodeStart && condition.customerCodeEnd) {
        this._conditionItems.push({ label: '顧客コード', value: `${condition.customerCodeStart} ～ ${condition.customerCodeEnd}` });
      }
    }

    if (condition.businessCodeStart && condition.businessCodeEnd) {
      this._conditionItems.push({ label: '業種コード', value: `${condition.businessCodeStart} ～ ${condition.businessCodeEnd}` });
    }

    if (condition.areaCdStart && condition.areaCdEnd) {
      this._conditionItems.push({ label: '地区コード', value: `${condition.areaCdStart} ～ ${condition.areaCdEnd}` });
    }

    if (condition.cutoffDay) {
      this._conditionItems.push({ label: '締日', value: `${condition.cutoffDay} 日`});
    }

    if (exportInfoTab === ExportInfoTabDiv.GlassSalesSlip && condition.glassClassDivGetDiv && ExportPartsWorkDivArray[condition.glassClassDivGetDiv]) {
      this._conditionItems.push({ label: '部品作業区分', value: ExportPartsWorkDivArray[condition.glassClassDivGetDiv].text });
    }

    if (condition.outPutHeaderDiv && OutputDivArray[condition.outPutHeaderDiv]) {
      this._conditionItems.push({ label: 'ヘッダ行', value: OutputDivArray[condition.outPutHeaderDiv].text });
    }

    if (exportInfoTab === ExportInfoTabDiv.GlassSalesSlip || exportInfoTab === ExportInfoTabDiv.GlassDeposit) {
      if (condition.outPutOrderDiv && ExportOrderDivArray[condition.outPutOrderDiv]) {
        this._conditionItems.push({ label: '順序', value: ExportOrderDivArray[condition.outPutOrderDiv].text });
      }
    }

    if (exportInfoTab === ExportInfoTabDiv.GlassPurchaseSlip || exportInfoTab === ExportInfoTabDiv.GlassPayment) {
      if (condition.glassOutPutPurchaseOrderDiv && PurchaseExportOrderDivArray[condition.glassOutPutPurchaseOrderDiv]) {
        this._conditionItems.push({ label: '順序', value: PurchaseExportOrderDivArray[condition.glassOutPutPurchaseOrderDiv].text });
      }
    }
  }

  /**
   * 表示する抽出条件項目リストを作成します。（PM売上伝票）
   * @param info 汎用データ出力情報
   */
  private createDispConditionItemsPmSalesSlip(info: IGenericDataExportInfo) {
    if (_isNil(info) || _isNil(info.pmSalesSlipDataExportCondition)) {
      return;
    }

    this._conditionItems = [];

    const condition = info.pmSalesSlipDataExportCondition;

    if (condition.organizationCodeList && !_isEmpty(condition.organizationCodeList)) {
      this._conditionItems.push({ label: '組織', value: '' });
      this.getOrganizationName(condition.organizationCodeList[0]).subscribe(
        organizationName => this._conditionItems[0].value = organizationName
      );
    }

    if (info.dataExportTagetEnumName) {
      this._conditionItems.push({ label: '出力内容', value: info.dataExportTagetEnumName });
    }

    if (condition.salesDateStart && condition.salesDateEnd) {
      const salesDateStart = this.formatJapanEra(condition.salesDateStart);
      const salesDateEnd = this.formatJapanEra(condition.salesDateEnd);
      if (salesDateStart && salesDateEnd) {
        this._conditionItems.push({ label: '売上日', value: `${salesDateStart} ～ ${salesDateEnd}` });
      }
    }

    if (condition.inputDateStart && condition.inputDateEnd) {
      const inputDateStart = this.formatJapanEra(condition.inputDateStart);
      const inputDateEnd = this.formatJapanEra(condition.inputDateEnd);
      if (inputDateStart && inputDateEnd) {
        this._conditionItems.push({ label: '入力日', value: `${inputDateStart} ～ ${inputDateEnd}` });
      }
    }

    if (condition.slipNumberStart && condition.slipNumberEnd) {
      this._conditionItems.push({ label: '伝票番号', value: `${condition.slipNumberStart} ～ ${condition.slipNumberEnd}` });
    }

    if (condition.customerCodeStart && condition.customerCodeEnd) {
      this._conditionItems.push({ label: '得意先', value: `${condition.customerCodeStart} ～ ${condition.customerCodeEnd}` });
    }

    if (condition.areaCdStart && condition.areaCdEnd) {
      this._conditionItems.push({ label: '地区', value: `${condition.areaCdStart} ～ ${condition.areaCdEnd}` });
    }

    if (condition.businessCodeStart && condition.businessCodeEnd) {
      this._conditionItems.push({ label: '業種', value: `${condition.businessCodeStart} ～ ${condition.businessCodeEnd}` });
    }

    if (condition.picEmployeeCodeStart && condition.picEmployeeCodeEnd) {
      this._conditionItems.push({ label: '担当者', value: `${condition.picEmployeeCodeStart} ～ ${condition.picEmployeeCodeEnd}` });
    }

    if (condition.orderEmployeeCodeStart && condition.orderEmployeeCodeEnd) {
      this._conditionItems.push({ label: '受注者', value: `${condition.orderEmployeeCodeStart} ～ ${condition.orderEmployeeCodeEnd}` });
    }

    if (condition.issueEmployeeCodeStart && condition.issueEmployeeCodeEnd) {
      this._conditionItems.push({ label: '発行者', value: `${condition.issueEmployeeCodeStart} ～ ${condition.issueEmployeeCodeEnd}` });
    }

    if (condition.salesSlipExportSlipDiv && SalesSlipExportSlipDivMap[condition.salesSlipExportSlipDiv]) {
      this._conditionItems.push({ label: '伝票区分', value: SalesSlipExportSlipDivMap[condition.salesSlipExportSlipDiv] });
    }

    if (condition.salesSlipExportRedSlipDiv && SalesSlipExportRedSlipDivMap[condition.salesSlipExportRedSlipDiv]) {
      this._conditionItems.push({ label: '赤伝区分', value: SalesSlipExportRedSlipDivMap[condition.salesSlipExportRedSlipDiv] });
    }

    if (condition.salesSlipExportIssueTypeDiv && SalesSlipExportIssueTypeDivMap[condition.salesSlipExportIssueTypeDiv]) {
      this._conditionItems.push({ label: '発行タイプ', value: SalesSlipExportIssueTypeDivMap[condition.salesSlipExportIssueTypeDiv] });
    }
  }

  /**
   * 表示する抽出条件項目リストを作成します。（DM）
   * @param info 汎用データ出力情報
   */
  private createDispConditionItemsDm(info: IGenericDataExportInfo) {
    if (_isNil(info) || _isNil(info.dmDataExportCondition)) {
      return;
    }

    this._conditionItems = [];

    if (info.dmDataExportCondition.dmExtractTableDivEnumName) {
      this._conditionItems.push({ label: '抽出対象', value: info.dmDataExportCondition.dmExtractTableDivEnumName });
    }

    const itemList = info.dmDataExportCondition.dmExtractConditionItemList;

    if (!_isEmpty(itemList)) {
      // 出力条件の名称取得
      RxForkJoin(
        this.fetchDmExtractMenu(info.dmDataExportCondition.dmExtractMenuCode),
        this.fetchCodeDivMap(itemList),
        this.fetchVehicleMaintFeeRank(itemList),
        this.fetchDmConditionItemNames(itemList),
        this.fetchTicketSetting(itemList)
      ).subscribe(
        ([menuName, codeDivMap, feeRanks, itemNames, tickets]) => {

          // メニュー
          if (menuName) {
            this._conditionItems.push({ label: 'メニュー', value: menuName });
          }

          // 案内方法
          this.dispDmEnumConditionItems(itemList, '案内方法', DmInvitationInitSelectDivMap, 'dmSendTypeDiv');

          // 対象期間
          if (info.dmDataExportCondition.dataExportTargetPeriodStDate && info.dmDataExportCondition.dataExportTargetPeriodEdDate) {
            const targetPeriodStDate = this.formatJapanEra(info.dmDataExportCondition.dataExportTargetPeriodStDate);
            const targetPeriodEdDate = this.formatJapanEra(info.dmDataExportCondition.dataExportTargetPeriodEdDate);
            this._conditionItems.push({ label: '対象期間', value: `${targetPeriodStDate} ～ ${targetPeriodEdDate}` });
          }

          // 抽出対象
          if (info.dmDataExportCondition.dmExtractTableDivEnumName) {
            this._conditionItems.push({ label: '抽出対象', value: info.dmDataExportCondition.dmExtractTableDivEnumName });
          }

          // DM案内可否
          const dmSendDivProperty = info.dmDataExportCondition.dmExtractTableDiv === DmExtractTableDiv.Customer ?
            'customerInfo.customerMgtInfo.dmSendDiv' : 'vehicleInfo.vehicleManagementInfo.dmSendDiv';
          const dmSendDivItems = this.getDmConditionItems(itemList, dmSendDivProperty);
          if (!_isEmpty(dmSendDivItems)) {
            let dmSendDiv = '全て';
            switch (dmSendDivItems[0].dmExtractConditionValue) {
              case DmSendDiv.Send:
                dmSendDiv = 'DM案内可能な' + info.dmDataExportCondition.dmExtractTableDivEnumName;
                break;
              case DmSendDiv.NoSend:
                dmSendDiv = 'DM案内不可な' + info.dmDataExportCondition.dmExtractTableDivEnumName;
                break;
            }

            this._conditionItems.push({ label: 'DM案内可否', value: dmSendDiv });
          }

          // 顧客フリガナ（あいまい検索）
          this.dispDmConditionItems(itemList, '顧客フリガナ', 'customerInfo.customerNameKana1', 'ct');

          // 顧客フリガナ（範囲検索）
          this.dispDmRangeConditionItem(itemList, '顧客フリガナ', 'customerInfo.customerNameKana1');

          // 顧客担当者
          this.dispDmCodeConditionItems(itemList, itemNames, '顧客担当者', 'customerInfo.customerMgtInfo.receptPicCode');

          // 個人・法人
          this.dispDmConditionItems(itemList, '個人・法人', 'customerInfo.privCorpDivEnumName');

          // LINE
          const snsContactEnableItems = this.getDmConditionItems(itemList, 'snsPotentialCustomer.snsContactEnable');
          const snsFollowStatusDivItems = this.getDmConditionItems(itemList, 'snsPotentialCustomer.snsFollowStatusDiv');
          if (!_isEmpty(snsFollowStatusDivItems)) {
            if (!_isEmpty(snsContactEnableItems)) {
              this._conditionItems.push({ label: 'LINE', value: '友だち' });
            } else {
              this._conditionItems.push({ label: 'LINE', value: '友だち未登録' });
            }
          }

          // 顧客コード
          this.dispDmConditionItems(itemList, '顧客コード', 'customerInfo.customerCode', 'ct');

          // 顧客コード（範囲）
          this.dispDmRangeConditionItem(itemList, '顧客コード', 'customerInfo.customerCode');

          // 顧客サブコード
          this.dispDmRangeConditionItem(itemList, '顧客サブコード', 'customerInfo.customerSub_code');

          // 郵便番号
          this.dispDmConditionItems(itemList, '郵便番号', 'customerInfo.postalCode');

          // 顧客住所
          this.dispDmConditionItems(itemList, '顧客住所', 'customerInfo.customerAddressStateCity');

          // 推定保有台数
          this.dispDmConditionItems(itemList, '推定保有台数', 'customerInfo.corpCustomerInfo.estimatePossesVcleCntDivEnumName');

          // 性別
          this.dispDmConditionItems(itemList, '性別', 'customerInfo.privCustomerInfo.sexDiv');

          // 年齢
          this.dispDmRangeConditionItem(itemList, '年齢', 'customerInfo.privCustomerInfo.birthDay', false, '歳');

          // 会員番号
          this.dispDmConditionItems(itemList, '会員番号', 'customerInfo.memberNumber');

          // 顧客備考
          for (let index = 1; index <= 20; index++) {
            const label = `顧客備考${index}`;
            const property = `customerInfo.customerMgtInfo.customerVehicleRemarksContent${index}`;
            this.dispDmConditionItems(itemList, label, property, 'ct');
            this.dispDmConditionItems(itemList, label, property, 'eq');
          }

          // 顧客管理組織
          this.dispDmConditionItems(itemList, '顧客管理組織', 'customerInfo.customerMgtInfo.customerManageOrganizationCodeName');

          // 顧客ラベル
          this.dispDmLabelConditionItems(itemList, '顧客ラベル', 'customerInfo.labelNameList', 'customerInfo.labelConditionList');

          // クーポン
          this.dispDmTicketConditionItems(itemList, tickets, 'クーポン', 'customerTicket.ticketCode');

          // クーポン対象期間
          this.dispDmStartEndConditionItem(itemList, 'クーポン対象期間', 'customerTicket.applyStartDate', 'customerTicket.applyEndDate', true);

          // クーポン発行日
          this.dispDmConditionItems(itemList, 'クーポン発行日', 'customerTicket.ticketIssueDate');

          // クーポン（利用可能クーポン無し）
          this.dispDmConditionItems(itemList, 'クーポン', 'customerTicket.customerTicketCount');

          // 点検区分
          const vehicleCheckDivItems = this.getDmConditionItems(itemList, 'vehicleInfo.vehicleCheckCycleInfoList.vehicleCheckDivEnumName');
          if (!_isEmpty(vehicleCheckDivItems)) {
            const vehicleCheckDivArray = [];

            _forEach(vehicleCheckDivItems, item => {
              vehicleCheckDivArray.push(item.dmExtractConditionValue.substring(2));
            });

            const nameConcat = StringUtils.concatWith(', ', ...vehicleCheckDivArray);
            this._conditionItems.push({ label: '点検区分', value: nameConcat });
          }

          // 車検満期日
          this.dispDmRangeConditionItem(itemList, '車検満期日', 'vehicleInfo.vehicleinspcertifinfo.vcleInspDueDate', true);

          // 前回点検日
          this.dispDmRangeConditionItem(itemList, '前回点検日', 'vehicleInfo.vehicleCheckHistoryInfo.lastTimeCheckDate', true);

          // 自動車検査登録事務所
          this.dispDmCodeConditionItems(itemList, itemNames, '自動車検査登録事務所', 'vehicleInfo.vehicleInspCertifInfo.vcleInspRegistOfficeCd');

          // 仮登録車両
          const numPlateSeriesSpecifNumItem = this.getDmConditionItems(itemList, 'vehicleInfo.vehicleInspCertifInfo.numPlateSeriesSpecifNum');
          if (_isEmpty(numPlateSeriesSpecifNumItem)) {
            this._conditionItems.push({ label: '仮登録車両', value: '含めない' });
          }

          // 分類番号
          this.dispDmConditionItems(itemList, '分類番号', 'vehicleInfo.vehicleInspCertifInfo.numPlateClassNum');

          // プレートNo.
          this.dispDmConditionItems(itemList, 'プレートNo.', 'vehicleInfo.vehicleInspCertifInfo.numPlateSeriesSpecifNum', 'eq');

          // 号車
          this.dispDmConditionItems(itemList, '号車', 'vehicleInfo.vehicleManagementInfo.vcleAddInfo2');

          // 自動車の追加情報
          this.dispDmConditionItems(itemList, '自動車の追加情報', 'vehicleInfo.vehicleManagementInfo.vcleAddInfo3');

          // 自動車種別
          const vehicleCategoryList = codeDivMap[CodeDivGenre.VehicleCategoryCd];
          this.dispDmCodeDivConditionItems(itemList, vehicleCategoryList, '自動車種別', 'vehicleInfo.vehicleInspCertifInfo.vehicleCategoryCd');

          // 走行距離
          this.dispDmRangeConditionItem(itemList, '走行距離', 'vehicleInfo.vehicleStateInfo.vehicleMileage', false, 'km');

          // 月平均走行距離
          this.dispDmRangeConditionItem(itemList, '月平均走行距離', 'vehicleInfo.vehicleStateInfo.monthAveVehicleMileage', false, 'km');

          // 排気量
          this.dispDmRangeConditionItem(itemList, '排気量', 'vehicleInfo.vehicleSpecificationInfo.ttlDisplacement', false, 'L');

          // メーカー
          this.dispDmConditionItems(itemList, 'メーカー', 'vehicleInfo.vehicleInspCertifInfo.vehicleName');

          // 車種
          this.dispDmConditionItems(itemList, '車種', 'vehicleInfo.vehicleSpecificationInfo.vehicleModelFixFullWName');

          // 型式
          this.dispDmConditionItems(itemList, '型式', 'vehicleInfo.vehicleInspCertifInfo.vehicleInspCertifModel', 'px');
          this.dispDmConditionItems(itemList, '型式', 'vehicleInfo.vehicleInspCertifInfo.vehicleInspCertifModel', 'ct');

          // 車台番号
          this.dispDmRangeConditionItem(itemList, '車台番号', 'vehicleInfo.vehicleInspCertifInfo.frameNumber');

          // 初度登録年月
          this.dispDmRangeConditionItem(itemList, '初度登録年月', 'vehicleInfo.vehicleInspCertifInfo.firstRegistYearMonth', true);

          // 登録年月日/交付年月日
          this.dispDmRangeConditionItem(itemList, '登録年月日/交付年月日', 'vehicleInfo.vehicleInspCertifInfo.vehicleRegistDate', true);

          // 自家用・事業用
          this.dispDmConditionItems(itemList, '自家用・事業用', 'vehicleInfo.vehicleInspCertifInfo.privateBusinessName');

          // 車検満期日入力
          this.dispDmConditionItems(itemList, '車検満期日入力', 'vehicleInfo.vcleInspDueDateNoSearch');

          // プレートNo.入力
          this.dispDmConditionItems(itemList, 'プレートNo.入力', 'vehicleInfo.numPlateSeriesSpecifNumNoSearch');

          // 車両備考
          for (let index = 1; index <= 20; index++) {
            const label = `車両備考${index}`;
            const property = `vehicleInfo.vehicleManagementInfo.customerVehicleRemarksContent${index}`;
            this.dispDmConditionItems(itemList, label, property, 'ct');
            this.dispDmConditionItems(itemList, label, property, 'eq');
          }

          // OBD検査
          this.dispDmConditionItems(itemList, 'OBD検査', 'vehicleInfo.vehicleInspCertifInfo.obdInspTargetDivEnumName');

          // 車両管理組織
          this.dispDmConditionItems(itemList, '車両管理組織', 'vehicleInfo.vehicleManagementInfo.vehicleMgtOrgName');

          // 車両ラベル
          this.dispDmLabelConditionItems(itemList, '車両ラベル', 'vehicleInfo.labelNameList', 'vehicleInfo.labelConditionList');

          // 料金ランク
          this.dispDmFeeRankConditionItems(itemList, feeRanks, '料金ランク', 'vehicleInfo.vehicleMaintFeeCalcInfo.vehicleMaintFeeRankCode');

          // メンテナンスパック


          // 最終納品日
          this.dispDmRangeConditionItem(itemList, '最終納品日', 'sfSlipHistoryHeader.shippingDate', true);

          // 最終DM発行日
          this.dispDmRangeConditionItem(itemList, '最終DM発行日', 'dmSendHistory.sendDateTime', true);
        }
      );

    }
  }

  /**
   * DM抽出条件項目を表示します。
   * @param itemList DM抽出条件項目リスト
   * @param label 項目ラベル
   * @param property 項目プロパティ
   * @param operator 項目演算子
   */
  private dispDmConditionItems(itemList: IDmExtractConditionItem[], label: string, property: string, operator?: string) {
    const items = this.getDmConditionItems(itemList, property, operator);

    if (!_isEmpty(items)) {
      const nameArray = _map(items, item => item.dmExtractConditionValue);
      let nameConcat = StringUtils.concatWith(', ', ...nameArray);

      if (operator && operator === 'ct') {
        nameConcat += '（あいまい検索）';
      } else if (property === 'vehicleInfo.vehicleInspCertifInfo.numPlateClassNum') {
        nameConcat += 'ナンバー';
      } else if (property === 'vehicleInfo.vcleInspDueDateNoSearch') {
        nameConcat = '未入力';
      } else if (property === 'vehicleInfo.numPlateSeriesSpecifNumNoSearch') {
        nameConcat = '未入力';
      } else if (property === 'customerInfo.privCustomerInfo.sexDiv') {
        nameConcat = SexDivMap[nameConcat];
      } else if (property === 'customerTicket.ticketIssueDate') {
        nameConcat = this.formatJapanEra(nameConcat) + '以降';
      } else if (property === 'customerTicket.customerTicketCount') {
        nameConcat = '利用可能クーポン無し';
      }

      this._conditionItems.push({ label: label, value: nameConcat });
    }
  }

  /**
   * DM抽出条件項目（Enum）を表示します。
   * @param itemList DM抽出条件項目リスト
   * @param label 項目ラベル
   * @param map EnumのMap
   * @param property 項目プロパティ
   * @param operator 項目演算子
   */
  private dispDmEnumConditionItems(itemList: IDmExtractConditionItem[], label: string, map: any, property: string, operator?: string) {
    const items = this.getDmConditionItems(itemList, property, operator);

    if (!_isEmpty(items)) {
      const nameArray = [];
      _forEach(items, item => {
        const name = map[item.dmExtractConditionValue];
        if (name) {
          nameArray.push(name);
        }
      });

      if (!_isEmpty(nameArray)) {
        let nameConcat = StringUtils.concatWith(', ', ...nameArray);

        this._conditionItems.push({ label: label, value: nameConcat });
      }
    }
  }

  /**
   * DM抽出条件項目（範囲）を表示します。
   * @param itemList DM抽出条件項目リスト
   * @param label 項目ラベル
   * @param startProperty 開始項目プロパティ
   * @param endProperty 終了項目プロパティ
   * @param isDateItem 日付項目かどうか
   * @param unit 単位
   */
  private dispDmStartEndConditionItem(
    itemList: IDmExtractConditionItem[], label: string, startProperty: string, endProperty: string, isDateItem = false, unit?: string
  ) {
    const geItems = this.getDmConditionItems(itemList, startProperty);
    const leItems = this.getDmConditionItems(itemList, endProperty);

    if (!_isEmpty(geItems) || !_isEmpty(leItems)) {
      let geText = !_isEmpty(geItems) ? geItems[0].dmExtractConditionValue : '';
      let leText = !_isEmpty(leItems) ? leItems[0].dmExtractConditionValue : '';

      if (isDateItem) {
        geText = this.formatJapanEra(geText);
        leText = this.formatJapanEra(leText);
      }

      if (unit) {
        geText += unit;
        leText += unit;
      }

      this._conditionItems.push({ label: label, value: `${geText} ～ ${leText}` });
    }
  }

  /**
   * DM抽出条件項目（範囲）を表示します。
   * @param itemList DM抽出条件項目リスト
   * @param label 項目ラベル
   * @param property 項目プロパティ
   * @param isDateItem 日付項目かどうか
   * @param unit 単位
   */
  private dispDmRangeConditionItem(
    itemList: IDmExtractConditionItem[], label: string, property: string, isDateItem = false, unit?: string
  ) {
    const geItems = this.getDmConditionItems(itemList, property, 'ge');
    const leItems = this.getDmConditionItems(itemList, property, 'le');

    if (!_isEmpty(geItems) || !_isEmpty(leItems)) {
      let geText = !_isEmpty(geItems) ? geItems[0].dmExtractConditionValue : '';
      let leText = !_isEmpty(leItems) ? leItems[0].dmExtractConditionValue : '';

      if (isDateItem) {
        if (property === 'vehicleInfo.vehicleInspCertifInfo.firstRegistYearMonth') {
          geText = this.formatJapanEra(geText, true);
          leText = this.formatJapanEra(leText, true);
        } else {
          geText = this.formatJapanEra(geText);
          leText = this.formatJapanEra(leText);
        }
      } else {
        if (property === 'customerInfo.privCustomerInfo.birthDay') {
          const todayYear = DateTimeUtils.getYear(DateTimeUtils.today());
          let start = '';
          let end = '';
          if (leText) {
            const startYear = todayYear - DateTimeUtils.getYear(DateTimeUtils.parseDate(leText));
            start = startYear.toString();
          }
          if (geText) {
            const endYear = todayYear - DateTimeUtils.getYear(DateTimeUtils.parseDate(geText)) - 1;
            end = endYear.toString();
          }
          geText = start;
          leText = end;
        } else if (property === 'vehicleInfo.vehicleStateInfo.vehicleMileage') {
          if (geText) {
            geText = NumberUtils.numberToCommaString(Number(geText));
          }
          if (leText) {
            leText = NumberUtils.numberToCommaString(Number(leText));
          }
        } else if (property === 'vehicleInfo.vehicleStateInfo.monthAveVehicleMileage') {
          if (geText) {
            geText = NumberUtils.numberToCommaString(Number(geText));
          }
          if (leText) {
            leText = NumberUtils.numberToCommaString(Number(leText));
          }
        }

        if (unit) {
          geText += unit;
          leText += unit;
        }
      }

      this._conditionItems.push({ label: label, value: `${geText} ～ ${leText}` });
    }
  }

  /**
   * DM抽出条件項目（コード）を表示します。
   * @param itemList DM抽出条件項目リスト
   * @param dataList 取得データリスト
   * @param label 項目ラベル
   * @param property 項目プロパティ
   * @param operator 項目演算子
   */
  private dispDmCodeConditionItems(
    itemList: IDmExtractConditionItem[],
    dataList: { property: string, name: string }[],
    label: string,
    property: string,
    operator?: string
  ) {
    const items = this.getDmConditionItems(itemList, property, operator);
    const datas = _filter(dataList, res => res.property === property);

    if (!_isEmpty(datas)) {
      const nameArray = _map(datas, data => data.name);
      let nameConcat = StringUtils.concatWith(', ', ...nameArray);

      if (property === 'customerInfo.customerMgtInfo.receptPicCode') {
        nameConcat = items[0].dmExtractConditionValue + '　' + nameConcat;
      }

      this._conditionItems.push({ label: label, value: nameConcat });
    }
  }

  /**
   * DM抽出条件項目（コード区分）を表示します。
   * @param itemList DM抽出条件項目リスト
   * @param codeDivList コード区分リスト
   * @param label 項目ラベル
   * @param property 項目プロパティ
   * @param operator 項目演算子
   */
  private dispDmCodeDivConditionItems(
    itemList: IDmExtractConditionItem[],
    codeDivList: FrontDivisionBody[],
    label: string,
    property: string,
    operator?: string
  ) {
    const items = this.getDmConditionItems(itemList, property, operator);

    if (!_isEmpty(items)) {
      const nameArray = [];
      _forEach(items, item => {
        const findItem = _find(codeDivList, codeDiv => codeDiv.code.toString() === item.dmExtractConditionValue);
        if (findItem) {
          nameArray.push(findItem.name);
        }
      });
      const nameConcat = StringUtils.concatWith(', ', ...nameArray);
      this._conditionItems.push({ label: label, value: nameConcat });
    }
  }

  /**
   * DM抽出条件項目（料金ランク）を表示します。
   * @param itemList DM抽出条件項目リスト
   * @param feeRankList 料金ランクリスト
   * @param label 項目ラベル
   * @param property 項目プロパティ
   * @param operator 項目演算子
   */
  private dispDmFeeRankConditionItems(
    itemList: IDmExtractConditionItem[],
    feeRankList: IVehicleMaintFeeRankRef[],
    label: string,
    property: string,
    operator?: string
  ) {
    const items = this.getDmConditionItems(itemList, property, operator);

    if (!_isEmpty(items)) {
      const nameArray = [];
      _forEach(items, item => {
        const codeArray = item.dmExtractConditionValue.split(',');

        _forEach(codeArray, code => {
          const findItem = _find(feeRankList, feeRank => feeRank.vehicleMaintFeeRankCode.toString() === code);
          if (findItem) {
            nameArray.push(findItem.vehicleMaintFeeRankName);
          }
        });
      });
      const nameConcat = StringUtils.concatWith(', ', ...nameArray);
      this._conditionItems.push({ label: label, value: nameConcat });
    }
  }

  /**
   * DM抽出条件項目（クーポン）を表示します。
   * @param itemList DM抽出条件項目リスト
   * @param ticketList チケットリスト
   * @param label 項目ラベル
   * @param property 項目プロパティ
   * @param operator 項目演算子
   */
  private dispDmTicketConditionItems(
    itemList: IDmExtractConditionItem[],
    ticketList: ITicketSetting[],
    label: string,
    property: string,
    operator?: string
  ) {
    const items = this.getDmConditionItems(itemList, property, operator);

    if (!_isEmpty(items)) {
      const nameArray = [];
      _forEach(items, item => {
        const codeArray = item.dmExtractConditionValue.split(',');

        _forEach(codeArray, code => {
          const findItem = _find(ticketList, ticket => ticket.ticketCode.toString() === code);
          if (findItem) {
            nameArray.push(findItem.ticketName);
          }
        });
      });
      const nameConcat = StringUtils.concatWith(', ', ...nameArray);
      this._conditionItems.push({ label: label, value: nameConcat });
    }
  }

  /**
   * DM抽出条件項目（ラベル）を表示します。
   * @param itemList DM抽出条件項目リスト
   * @param label 項目ラベル
   * @param labelProperty ラベル項目プロパティ
   * @param labelConditionProperty ラベル条件プロパティ
   */
  private dispDmLabelConditionItems(
    itemList: IDmExtractConditionItem[],
    label: string,
    labelProperty: string,
    labelConditionProperty: string
  ) {
    const labelItems = this.getDmConditionItems(itemList, labelProperty);
    const labelConditions = this.getDmConditionItems(itemList, labelConditionProperty);

    if (!_isEmpty(labelItems) && !_isEmpty(labelConditions)) {
      let dispValue = '';

      _forEach(labelConditions, (condition, i) => {
        const index = i + 1;
        const filterLabels: string[] = [];

        _forEach(labelItems, item => {
          const findText = `${index}：`;
          if (item.dmExtractConditionValue.indexOf(findText) === 0) {
            filterLabels.push(item.dmExtractConditionValue.substring(findText.length));
          }
        });

        if (!_isEmpty(filterLabels)) {
          const dispLabel = StringUtils.concatWith(', ', ...filterLabels);

          let dispCondition = '';
          switch (condition.dmExtractConditionValue) {
            case '0':
              dispCondition = 'いずれか';
              break;
            case '1':
              dispCondition = 'すべて';
              break;
            case '2':
              dispCondition = '含めない';
              break;
          }

          dispValue += dispLabel + '　' + dispCondition + '<br>';
        }
      });

      if (dispValue) {
        this._conditionItems.push({ label: label, value: dispValue });
      }
    }
  }

  /**
   * DMデータ出力条件項目を取得します。
   * @param itemList DMデータ出力条件リスト
   * @param property プロパティ
   * @param operator 演算子
   * @returns DMデータ出力条件項目
   */
  private getDmConditionItems(itemList: IDmExtractConditionItem[], property: string, operator?: string): IDmExtractConditionItem[] {
    return _filter(itemList, item => {
      if (item.dmExtractConditionProperty === property) {
        if (operator) {
          if (item.dmExtractConditionOperator === operator) {
            return true;
          }
        } else {
          return true;
        }
      }

      return false;
    });
  }

  /**
   * DM抽出メニューを取得します。
   * @param menuCode メニューコード
   * @returns DM抽出メニュー名称
   */
  private fetchDmExtractMenu(menuCode: number): Observable<string> {
    if (!menuCode) {
      return RxOf(null);
    }
    return this.dmExtractMenuResource.getById<IDmExtractMenu>(menuCode.toString()).pipe(
      map(response => {
        return response ? response.dmExtractMenuName : '';
      }),
      catchError(() => {
        return RxOf(null);
      })
    );
  }

  /**
   * チケット設定を取得します。
   * @param itemList DMデータ出力条件リスト
   * @returns チケット設定
   */
  private fetchTicketSetting(itemList: IDmExtractConditionItem[]) {
    if (!_isEmpty(itemList)) {
      const ticketItems = this.getDmConditionItems(itemList, 'customerTicket.ticketCode');

      if (!_isEmpty(ticketItems)) {
        const ticketCodeList = [];

        _forEach(ticketItems, item => {
          const codeArray = item.dmExtractConditionValue.split(',');
          ticketCodeList.push(...codeArray);
        });

        const conditions = [
          { key: 'ticketCode', value: ticketCodeList, type: BlConditionType.In }
        ];

        return this.ticketSettingResource.search<ITicketSetting>({ conditions }).pipe(
          map(res => res && res.searchResultList ? res.searchResultList : []),
          catchError(() => {
            return RxOf([]);
          })
        );
      }
    }

    return RxOf([]);
  }

  /**
   * コード区分リストMapを取得します。
   * @param itemList DMデータ出力条件リスト
   * @returns コード区分リストMap
   */
  private fetchCodeDivMap(itemList: IDmExtractConditionItem[]): Observable<{ [key: string]: FrontDivisionBody[] }> {
    if (!_isEmpty(itemList)) {
      const codeDivGenres = [];

      const vehicleCategoryItems = this.getDmConditionItems(itemList, 'vehicleInfo.vehicleInspCertifInfo.vehicleCategoryCd');
      if (!_isEmpty(vehicleCategoryItems)) {
        codeDivGenres.push(CodeDivGenre.VehicleCategoryCd);
      }

      if (!_isEmpty(codeDivGenres)) {
        return this.divisionResourceService.fetchTransformFrontDivision(codeDivGenres).pipe(
          map(codeDivList => {
            return codeDivList ? codeDivList : {};
          }),
          catchError(() => {
            return RxOf({});
          })
        );
      }
    }

    return RxOf({});
  }

  /**
   * 料金ランクリストを取得します。
   * @param itemList DMデータ出力条件リスト
   * @returns 料金ランクリスト
   */
  private fetchVehicleMaintFeeRank(itemList: IDmExtractConditionItem[]): Observable<IVehicleMaintFeeRankRef[]> {
    if (!_isEmpty(itemList)) {
      const vehicleMaintFeeRankItems = this.getDmConditionItems(itemList, 'vehicleInfo.vehicleMaintFeeCalcInfo.vehicleMaintFeeRankCode');

      if (!_isEmpty(vehicleMaintFeeRankItems)) {

        return this.vehicleMgtSettingResource.getById<IVehicleMgtSetting>(CompanyConst.ORGANIZATION_CODE_ALL_COMPANY).pipe(
          mergeMap(setting => {
            const feeRankUseDiv = setting && setting.feeRankUseDiv ? setting.feeRankUseDiv : FeeRankUseDiv.Standard;

            // 検索条件
            const params = {
              conditions: [
                { key: 'feeRankUseDiv', value: feeRankUseDiv, type: BlConditionType.Equal },
                { key: 'logicalDeleteDiv', value: LogicalDeleteDiv.Valid, type: BlConditionType.Equal },
              ],
              sortFields: [
                { field: 'vehicleMaintFeeRankDispOdr', desc: false },
                { field: 'vehicleMaintFeeRankCode', desc: false }
              ]
            };

            return this.vehicleMaintFeeRankRefResource.getAll<IVehicleMaintFeeRankRef>(params, { consistent: false }).pipe(
              map(res => res && res.searchResultList ? res.searchResultList : []),
              catchError(() => {
                return RxOf([]);
              })
            );
          })
        );
      }
    }

    return RxOf([]);
  }

  /**
   * DMデータ出力条件リストの名称リストを取得します。
   * @param itemList DMデータ出力条件リスト
   * @returns DMデータ出力条件の取得名称リスト
   */
  private fetchDmConditionItemNames(itemList: IDmExtractConditionItem[]): Observable<{ property: string, name: string }[]> {
    const valueObservables = [];

    if (!_isEmpty(itemList)) {
      // 顧客担当者
      const receptPicCodeItems = this.getDmConditionItems(itemList, 'customerInfo.customerMgtInfo.receptPicCode');
      if (!_isEmpty(receptPicCodeItems)) {
        valueObservables.push(this.getEmployeeName(receptPicCodeItems[0].dmExtractConditionValue).pipe(
          map(response => {
            return { property: 'customerInfo.customerMgtInfo.receptPicCode', name: response };
          })
        ));
      }

      // 自動車検査登録事務所
      const vcleInspRegistOfficeCdItems = this.getDmConditionItems(itemList, 'vehicleInfo.vehicleInspCertifInfo.vcleInspRegistOfficeCd');
      if (!_isEmpty(vcleInspRegistOfficeCdItems)) {
        _forEach(vcleInspRegistOfficeCdItems, item => {
          valueObservables.push(this.getTransportBranchName(item.dmExtractConditionValue).pipe(
            map(response => {
              return { property: 'vehicleInfo.vehicleInspCertifInfo.vcleInspRegistOfficeCd', name: response };
            })
          ));
        });
      }

    }

    if (!_isEmpty(valueObservables)) {
      return RxForkJoin(...valueObservables);
    } else {
      return RxOf([]);
    }
  }

  /**
   * 組織名を取得します。
   * @param organizationCode 組織コード
   * @returns 組織名
   */
  private getOrganizationName(organizationCode: string): Observable<string> {
    if (!organizationCode) {
      return RxOf('');
    }

    return this.organizationInformationResourceService.getCurrentOrganization(organizationCode).pipe(
      map(response => {
        if (response && response.organizationName) {
          return response.organizationName;
        } else {
          return '';
        }
      }),
      catchError(() => {
        return RxOf('');
      })
    );
  }

  /**
   * 従業員名を取得します。
   * @param employeeCode 従業員コード
   * @returns 従業員名
   */
  private getEmployeeName(employeeCode: string): Observable<string> {
    const id = CommonConst.COMPANY_MGT_CODE_OWN_COMPANY + '_' + employeeCode;
    return this.employeeResource.getById<IEmployee>(id).pipe(
      map(response => {
        return response ? response.employeeName : '';
      }),
      catchError(() => {
        return RxOf('');
      })
    );
  }

  /**
   * 自動車検査登録事務所名称を取得します。
   * @param code 自動車検査登録事務所コード
   * @returns 自動車検査登録事務所名称
   */
  private getTransportBranchName(code: string): Observable<string> {
    return this.transportBranchNameSettingResourceService.searchByVcleInspRegistOffice(Number.parseInt(code)).pipe(
      map(responses => {
        return !_isEmpty(responses) ? responses[0].transportBranchName : '';
      }),
      catchError(() => {
        return RxOf('');
      })
    );
  }

  /**
   * 日付データを和暦表示に変換します。
   * @param date 日付データ
   * @param isYearMonthNumber 年月（数字）かどうか
   * @returns 和暦表示日付
   */
  private formatJapanEra(date: string, isYearMonthNumber = false) {
    try {
      if (!date) {
        return '';
      }

      if (isYearMonthNumber) {
        return DateTimeUtils.format(Number.parseInt(date + '01'), DateTimeOutput.YM, DateTimePadding.SPACE, DateSeparator.JP, DateEra.JP);
      } else {
        return DateTimeUtils.format(date, DateTimeOutput.YMD, DateTimePadding.SPACE, DateSeparator.JP, DateEra.JP);
      }
    } catch {
      return '';
    }
  }

}
