import { Component, Injector, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of as RxOf } from 'rxjs/observable/of';
import { isEmpty as _isEmpty, first as _first, isNil as _isNil } from 'lodash';

import { DateTimeUtils, DateTimeOutput, DateTimePadding, DateSeparator, DateEra } from '@blcloud/bl-common';
import { IGenericPrintCondition } from '@blcloud/bl-datamodel';
import { MPContractStatusArray } from '@blcloud/bl-datamodel/enum/vehicle/m-p-contract-status';
import { ContractConst } from '@blcloud/bl-datamodel/const/contract';

import { AbstractExportReportPanel } from '../abstract-export-report-panel.component';
import {
  IMaintePackPanelPartsCondition,
  IMaintePackPanelPartsConditionShown,
} from '../../panel-parts/mainte-pack-panel-parts/mainte-pack-panel-parts.interface';
import {
  ICustomerPanelPartsCondition,
  ICustomerPanelPartsConditionShown,
} from '../../panel-parts/customer-panel-parts/customer-panel-parts.interface';
import { LoginResourceService } from '@blcloud/bl-ng-share-module';

/**
 * メンテナンスパック契約一覧抽出条件インターフェース
 */
export interface IMaintePackContractListPanelCondition {
  maintePackCondition?: IMaintePackPanelPartsCondition;
  customerCondition?: ICustomerPanelPartsCondition;
  sortDiv?: string;
}

/**
 * メンテナンスパック契約一覧コンポーネント
 */
@Component({
  selector: 'app-mainte-pack-contract-list-panel',
  templateUrl: 'mainte-pack-contract-list-panel.component.html',
  styleUrls: ['mainte-pack-contract-list-panel.component.scss'],
})
export class MaintePackContractListPanelComponent extends AbstractExportReportPanel implements OnInit {
  /** メンテナンスパック検索条件 */
  maintePackCondition: IMaintePackPanelPartsCondition = {};
  /** メンテナンスパック検索条件表示設定 */
  maintePackConditionShown: IMaintePackPanelPartsConditionShown = {
    /** 契約日 */
    contractDate: true,
    /** 契約開始日 */
    contractStartDate: true,
    /** 契約終了日 */
    contractEndDate: true,
    /** 契約番号 */
    mpContractNo: true,
    /** メンテナンスパックコード配列 */
    mpCodeList: true,
    /** 契約状況配列 */
    mpContractStatus: true,
    /** 契約従業員 */
    contractEmployee: true,
    /** メンテナンスパック預り金 オプションにより可変 */
    mpDepositUnreceive: false,
    /** 契約メモ */
    contractNote: true,
    /** 点検サイクル不一致フラグ */
    mismatchCheckCycleFlag: true,
  };
  /** 顧客検索条件 */
  customerCondition: ICustomerPanelPartsCondition = {};
  /** 顧客検索条件表示設定 */
  readonly customerConditionShown: ICustomerPanelPartsConditionShown = {
    /** 顧客カナ */
    customerNameKana: true,
    /** 顧客コード */
    customerCode: true,
    /** 顧客サブコード */
    customerSub_code: true,
    /** 顧客担当者 */
    receptPicName: true,
  };
  /** ソート */
  sortDiv = '0';

  /** MP契約ステータス */
  readonly MPContractStatusArray = MPContractStatusArray;

  /** ソート */
  SortItems = [
    { code: '0', name: 'パック順' },
    { code: '1', name: '契約日順' },
    { code: '2', name: '顧客コード順' },
    { code: '3', name: '顧客サブコード順' },
    { code: '4', name: '契約番号順' },
  ];

  /** メンテナンスパック（預り金管理）サービス有効 */
  isAvailableDeposit = false;

  /** 設定識別ID */
  settingDataId = 'mpContractCondition';

  constructor(injector: Injector, private loginResourceService: LoginResourceService) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.initCondition();
    this.loginResourceService.isAvailableService(ContractConst.SERVICEID_OPT_MAC_MAINTE_PACK_DEPOSIT_MGT).subscribe((res) => {
      this.isAvailableDeposit = res;
      this.maintePackConditionShown.mpDepositUnreceive = res;
    });
  }

  /**
   * @override
   */
  protected initCondition(): void {
    const today = DateTimeUtils.formatIso(DateTimeUtils.today());
    this.maintePackCondition = {
      contractDateStart: today,
      contractDateEnd: today,
      mpCodeList: [],
    };
    this.customerCondition = {};
    this.sortDiv = '0';
  }

  /**
   * @override
   */
  protected validate(): Observable<any> {
    return RxOf(null);
  }

  /**
   * クエリパラメータを生成します。
   */
  protected makeGenericPrintConditionList(): IGenericPrintCondition[] {
    const condition = [
      // ソート
      {
        itemnID: 'sort',
        extractConditionString: this.sortDiv,
      },
    ];

    if (!_isEmpty(this.organizationCodeList) && !(_first(this.organizationCodeList) === '0')) {
      // 組織
      condition.push({
        itemnID: 'outputTargetOrgCodeList',
        extractConditionString: this.organizationCodeList.toString(),
      });
    }

    // MPコード
    if (!_isEmpty(this.maintePackCondition.mpCodeList)) {
      condition.push({
        itemnID: 'mpCode',
        extractConditionString: this.maintePackCondition.mpCodeList.toString(),
      });
    } else {
      // 全組織
      condition.push({
        itemnID: 'mpCode',
        extractConditionString: '0',
      });
    }

    // 契約日
    if (!this.isEmptyDate(this.maintePackCondition.contractDateStart)) {
      condition.push({
        itemnID: 'contractDateStart',
        extractConditionString: DateTimeUtils.format(
          DateTimeUtils.parseDate(this.maintePackCondition.contractDateStart),
          DateTimeOutput.YMD,
          DateTimePadding.ZERO,
          DateSeparator.NONE,
          DateEra.AD
        ),
      });
    }
    if (!this.isEmptyDate(this.maintePackCondition.contractDateEnd)) {
      condition.push({
        itemnID: 'contractDateEnd',
        extractConditionString: DateTimeUtils.format(
          DateTimeUtils.parseDate(this.maintePackCondition.contractDateEnd),
          DateTimeOutput.YMD,
          DateTimePadding.ZERO,
          DateSeparator.NONE,
          DateEra.AD
        ),
      });
    }
    // 契約開始日
    if (!this.isEmptyDate(this.maintePackCondition.contractStartDateStart)) {
      condition.push({
        itemnID: 'contractStartDateStart',
        extractConditionString: DateTimeUtils.format(
          DateTimeUtils.parseDate(this.maintePackCondition.contractStartDateStart),
          DateTimeOutput.YMD,
          DateTimePadding.ZERO,
          DateSeparator.NONE,
          DateEra.AD
        ),
      });
    }
    if (!this.isEmptyDate(this.maintePackCondition.contractStartDateEnd)) {
      condition.push({
        itemnID: 'contractStartDateEnd',
        extractConditionString: DateTimeUtils.format(
          DateTimeUtils.parseDate(this.maintePackCondition.contractStartDateEnd),
          DateTimeOutput.YMD,
          DateTimePadding.ZERO,
          DateSeparator.NONE,
          DateEra.AD
        ),
      });
    }
    // 契約終了日
    if (!this.isEmptyDate(this.maintePackCondition.contractEndDateStart)) {
      condition.push({
        itemnID: 'contractEndDateStart',
        extractConditionString: DateTimeUtils.format(
          DateTimeUtils.parseDate(this.maintePackCondition.contractEndDateStart),
          DateTimeOutput.YMD,
          DateTimePadding.ZERO,
          DateSeparator.NONE,
          DateEra.AD
        ),
      });
    }
    if (!this.isEmptyDate(this.maintePackCondition.contractEndDateEnd)) {
      condition.push({
        itemnID: 'contractEndDateEnd',
        extractConditionString: DateTimeUtils.format(
          DateTimeUtils.parseDate(this.maintePackCondition.contractEndDateEnd),
          DateTimeOutput.YMD,
          DateTimePadding.ZERO,
          DateSeparator.NONE,
          DateEra.AD
        ),
      });
    }

    // 契約番号
    if (!_isEmpty(this.maintePackCondition.mpContractNoStart)) {
      condition.push({
        itemnID: 'mpContractNoStart',
        extractConditionString: this.maintePackCondition.mpContractNoStart,
      });
    }
    if (!_isEmpty(this.maintePackCondition.mpContractNoEnd)) {
      condition.push({
        itemnID: 'mpContractNoEnd',
        extractConditionString: this.maintePackCondition.mpContractNoEnd,
      });
    }

    // MP契約ステータス
    if (!_isEmpty(this.maintePackCondition.mpContractStatusList)) {
      condition.push({
        itemnID: 'mpContractStatus',
        extractConditionString: this.maintePackCondition.mpContractStatusList.toString(),
      });
    } else {
      // 全選択
      condition.push({
        itemnID: 'mpContractStatus',
        extractConditionString: this.MPContractStatusArray.map((s) => s.value).toString(),
      });
    }

    // 契約従業員
    const employeeList = [];
    if (this.maintePackCondition.contractEmployeeCode1) {
      employeeList.push(this.maintePackCondition.contractEmployeeCode1);
    }
    if (this.maintePackCondition.contractEmployeeCode2) {
      employeeList.push(this.maintePackCondition.contractEmployeeCode2);
    }
    if (!_isEmpty(employeeList)) {
      condition.push({
        itemnID: 'contractEmployeeCodeList',
        extractConditionString: employeeList.toString(),
      });
    }

    // MP預り金御入金額フラグ
    if (this.maintePackCondition.mpDepositUnreceive && this.isAvailableDeposit) {
      condition.push({
        itemnID: 'mpDepositUnreceiveFlag',
        extractConditionString: this.maintePackCondition.mpDepositUnreceive.toString(),
      });
    }

    // 契約メモ
    if (!_isEmpty(this.maintePackCondition.contractNote)) {
      condition.push({
        itemnID: 'contractNote',
        extractConditionString: this.maintePackCondition.contractNote,
      });
    }

    // 点検サイクル不一致
    if (this.maintePackCondition.mismatchInspectionCycleFlag) {
      condition.push({
        itemnID: 'mismatchInspectionCycleFlag',
        extractConditionString: this.maintePackCondition.mismatchInspectionCycleFlag.toString(),
      });
    }
    if (this.maintePackCondition.mismatchLegalOrNewCarCycleFlag) {
      condition.push({
        itemnID: 'mismatchLegalCycleFlag',
        extractConditionString: this.maintePackCondition.mismatchLegalOrNewCarCycleFlag.toString(),
      });
      condition.push({
        itemnID: 'mismatchNewCarCycleFlag',
        extractConditionString: this.maintePackCondition.mismatchLegalOrNewCarCycleFlag.toString(),
      });
    }

    // 顧客名称カナ
    if (!_isEmpty(this.customerCondition.customerNameKanaStart)) {
      condition.push({
        itemnID: 'customerNameKanaStart',
        extractConditionString: this.customerCondition.customerNameKanaStart,
      });
    }
    if (!_isEmpty(this.customerCondition.customerNameKanaEnd)) {
      condition.push({
        itemnID: 'customerNameKanaEnd',
        extractConditionString: this.customerCondition.customerNameKanaEnd,
      });
    }
    // 顧客コード
    if (this.customerCondition.customerCodeStart) {
      condition.push({
        itemnID: 'customerCodeStart',
        extractConditionString: this.customerCondition.customerCodeStart.toString(),
      });
    }
    if (this.customerCondition.customerCodeEnd) {
      condition.push({
        itemnID: 'customerCodeEnd',
        extractConditionString: this.customerCondition.customerCodeEnd.toString(),
      });
    }

    // 顧客サブコード
    if (!_isEmpty(this.customerCondition.customerSub_codeStart)) {
      condition.push({
        itemnID: 'customerSubCodeStart',
        extractConditionString: this.customerCondition.customerSub_codeStart,
      });
    }
    if (!_isEmpty(this.customerCondition.customerSub_codeEnd)) {
      condition.push({
        itemnID: 'customerSubCodeEnd',
        extractConditionString: this.customerCondition.customerSub_codeEnd,
      });
    }

    // 顧客担当リスト
    const receptPic = [];
    if (this.customerCondition.receptPicCode1) {
      receptPic.push(this.customerCondition.receptPicCode1);
    }
    if (this.customerCondition.receptPicCode2) {
      receptPic.push(this.customerCondition.receptPicCode2);
    }
    if (!_isEmpty(receptPic)) {
      condition.push({
        itemnID: 'receptPicCodeList',
        extractConditionString: receptPic.toString(),
      });
    }

    return condition;
  }

  /**
   * @override
   */
  protected makeReportIdList(): string[] {
    return ['R-Vehicle-0070', 'R-Vehicle-0071'];
  }

  /**
   * @override
   */
  protected handleParsedQuery(condition: IMaintePackContractListPanelCondition) {
    if (_isNil(condition)) {
      return;
    }
    if (!_isNil(condition.maintePackCondition)) {
      this.maintePackCondition = condition.maintePackCondition;
    }
    if (!_isNil(condition.customerCondition)) {
      this.customerCondition = condition.customerCondition;
    }
    if (!_isNil(condition.sortDiv)) {
      this.sortDiv = condition.sortDiv;
    }
  }

  /**
   * よく使う条件読込イベントハンドラ
   * @param condition 抽出条件
   */
  onLoadFavoriteCondition(condition: IMaintePackContractListPanelCondition) {
    this.customerCondition = condition.customerCondition;
    this.maintePackCondition = condition.maintePackCondition;
    this.sortDiv = condition.sortDiv;
  }

  get reportCondition(): IMaintePackContractListPanelCondition {
    return {
      customerCondition: this.customerCondition,
      maintePackCondition: this.maintePackCondition,
      sortDiv: this.sortDiv,
    };
  }

  /**
   * 日付が空か判定
   * @param date 日付
   * @returns 判定結果
   */
  private isEmptyDate(date: string): boolean {
    return _isEmpty(date) || date === DateTimeUtils.initial.iso8601.date;
  }
}
