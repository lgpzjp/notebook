import { Component, Injector, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of as RxOf } from 'rxjs/observable/of';
import { isEmpty as _isEmpty, first as _first, isNil as _isNil } from 'lodash';

import { DateTimeUtils, DateTimeOutput, DateTimePadding, DateSeparator, DateEra } from '@blcloud/bl-common';
import { IGenericPrintCondition } from '@blcloud/bl-datamodel';

import { AbstractExportReportPanel } from '../abstract-export-report-panel.component';
import {
  IMaintePackPanelPartsCondition,
  IMaintePackPanelPartsConditionShown,
} from '../../panel-parts/mainte-pack-panel-parts/mainte-pack-panel-parts.interface';
import {
  ICustomerPanelPartsCondition,
  ICustomerPanelPartsConditionShown,
} from '../../panel-parts/customer-panel-parts/customer-panel-parts.interface';

/**
 * メンテナンスパック解約一覧抽出条件インターフェース
 */
export interface IMaintePackCancelContractListPanel {
  maintePackCondition?: IMaintePackPanelPartsCondition;
  customerCondition?: ICustomerPanelPartsCondition;
  sortDiv?: string;
}

/**
 * メンテナンスパック解約一覧コンポーネント
 */
@Component({
  selector: 'app-mainte-pack-cancel-contract-list-panel',
  templateUrl: 'mainte-pack-cancel-contract-list-panel.component.html',
  styleUrls: ['mainte-pack-cancel-contract-list-panel.component.scss'],
})
export class MaintePackCancelContractListPanelComponent extends AbstractExportReportPanel implements OnInit {
  /** メンテナンスパック検索条件 */
  maintePackCondition: IMaintePackPanelPartsCondition = {};
  /** メンテナンスパック検索条件表示設定 */
  readonly maintePackConditionShown: IMaintePackPanelPartsConditionShown = {
    /** 解約日 */
    cancelDate: true,
    /** 契約番号 */
    mpContractNo: true,
    /** メンテナンスパックコード配列 */
    mpCodeList: true,
    /** 出力拠点 */
    outputOrg: true,
    /** 契約メモ */
    contractNote: true,
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

  readonly SortItems = [
    { code: '0', name: 'パック順' },
    { code: '1', name: '解約日順' },
    { code: '2', name: '顧客コード順' },
    { code: '3', name: '顧客サブコード順' },
    { code: '4', name: '契約番号順' },
  ];

  /** 設定識別ID */
  settingDataId = 'mpCancelContractCondition';

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.initCondition();
  }

  /**
   * @override
   */
  protected initCondition(): void {
    const today = DateTimeUtils.formatIso(DateTimeUtils.today());
    this.maintePackCondition = {
      contractOrgOutputFlag: true,
      cancelOrgOutputFlag: true,
      cancelDateStart: today,
      cancelDateEnd: today,
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
   * @override
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

    // 解約日
    if (!this.isEmptyDate(this.maintePackCondition.cancelDateStart)) {
      condition.push({
        itemnID: 'cancelDateStart',
        extractConditionString: DateTimeUtils.format(
          DateTimeUtils.parseDate(this.maintePackCondition.cancelDateStart),
          DateTimeOutput.YMD,
          DateTimePadding.ZERO,
          DateSeparator.NONE,
          DateEra.AD
        ),
      });
    }
    if (!this.isEmptyDate(this.maintePackCondition.cancelDateEnd)) {
      condition.push({
        itemnID: 'cancelDateEnd',
        extractConditionString: DateTimeUtils.format(
          DateTimeUtils.parseDate(this.maintePackCondition.cancelDateEnd),
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
    // 出力拠点
    if (this.maintePackCondition.contractOrgOutputFlag) {
      condition.push({
        itemnID: 'contractOrgOutputFlag',
        extractConditionString: this.maintePackCondition.contractOrgOutputFlag.toString(),
      });
    }
    if (this.maintePackCondition.cancelOrgOutputFlag) {
      condition.push({
        itemnID: 'cancelOrgOutputFlag',
        extractConditionString: this.maintePackCondition.cancelOrgOutputFlag.toString(),
      });
    }
    if (!this.maintePackCondition.contractOrgOutputFlag && !this.maintePackCondition.cancelOrgOutputFlag) {
      condition.push({
        itemnID: 'contractOrgOutputFlag',
        extractConditionString: 'true',
      });
      condition.push({
        itemnID: 'cancelOrgOutputFlag',
        extractConditionString: 'true',
      });
    }
    // 契約メモ
    if (!_isEmpty(this.maintePackCondition.contractNote)) {
      condition.push({
        itemnID: 'contractNote',
        extractConditionString: this.maintePackCondition.contractNote,
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
    return ['R-Vehicle-0080'];
  }

  /**
   * @override
   */
  protected handleParsedQuery(condition: IMaintePackCancelContractListPanel) {
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
  onLoadFavoriteCondition(condition: IMaintePackCancelContractListPanel) {
    this.customerCondition = condition.customerCondition;
    this.maintePackCondition = condition.maintePackCondition;
    this.sortDiv = condition.sortDiv;
  }

  get reportCondition(): IMaintePackCancelContractListPanel {
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
