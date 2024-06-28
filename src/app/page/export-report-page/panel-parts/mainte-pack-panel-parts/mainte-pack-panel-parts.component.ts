import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { of as ObservableOf } from 'rxjs/observable/of';
import { isNil as _isNil, defer as _defer, isEmpty as _isEmpty } from 'lodash';
import { _throw as ObservableThrow } from 'rxjs/observable/throw';

import { EmployeeResource } from '@blcloud/bl-ng-resource';
import { EmployeeGuideComponent, EmployeeDiv } from '@blcloud/bl-ng-share-module';
import { BlApiErrorInfo, HttpStatus } from '@blcloud/bl-ng-common';
import { IMaintePackName, IEmployee } from '@blcloud/bl-datamodel';
import { MPContractStatusArray } from '@blcloud/bl-datamodel/enum/vehicle/m-p-contract-status';
import { CommonConst } from '@blcloud/bl-datamodel/const/common';
import { LogicalDeleteDiv } from '@blcloud/bl-datamodel/enum/common/logical-delete-div';
import { MaintePackNameResource } from '@blcloud/bl-ng-resource';
import { BlModalService, ModalReason } from '@blcloud/bl-ng-ui-component';

import { IMaintePackPanelPartsCondition, IMaintePackPanelPartsConditionShown } from './mainte-pack-panel-parts.interface';

/**
 * メンテナンスパックコンポーネント
 */
@Component({
  selector: 'app-mainte-pack-panel-parts',
  templateUrl: 'mainte-pack-panel-parts.component.html',
  styleUrls: ['mainte-pack-panel-parts.component.scss'],
  providers: [MaintePackNameResource, EmployeeResource],
})
export class MaintePackPanelPartsComponent implements OnInit {
  @Input() condition: IMaintePackPanelPartsCondition = {};
  @Input() conditionShown: IMaintePackPanelPartsConditionShown = {};
  @Input() mpContractStatusArray: {
    value: string;
    text: string;
  }[] = MPContractStatusArray;

  /** メンテナンスパック名称配列 */
  maintePackNameList: IMaintePackName[] = [];

  /** 出力拠点 */
  readonly OutputOrgArray = [
    { text: '契約拠点', value: 'contractOrgOutputFlag' },
    { text: '解約拠点', value: 'cancelOrgOutputFlag' },
  ];

  constructor(
    private maintePackNameResource: MaintePackNameResource,
    private modalService: BlModalService,
    private employeeResource: EmployeeResource
  ) {}

  ngOnInit() {
    this.maintePackNameResource.getAll().subscribe((res) => {
      this.maintePackNameList = res ? res.searchResultList : [];
    });
  }

  /**
   * MPコード変更イベントハンドラ
   * @param event
   */
  onChangeMpCodeList(event) {
    this.condition.mpCodeList = event;
  }

  /**
   * MP契約ステータス変更イベントハンドラ
   * @param event
   */
  onChangeMpContractStatusList(event) {
    this.condition.mpContractStatusList = event;
  }

  /**
   * 従業員コード変更イベントハンドラ
   * @param employeeCode 従業員コード
   */
  onChangeEmployeeCode(employeeCode: string, index: number) {
    if (_isEmpty(employeeCode)) {
      this.setEmployeeCondition({ employeeCode: '', employeeName: '' }, index);
      return;
    }

    const beforeInfo = {
      employeeCode: index === 0 ? this.condition.contractEmployeeCode1 : this.condition.contractEmployeeCode2,
      employeeName: index === 0 ? this.condition.contractEmployeeName1 : this.condition.contractEmployeeName2,
    };

    // 一旦入力された値で更新しておく
    this.setEmployeeCondition({ employeeCode: employeeCode, employeeName: employeeCode }, index);

    // 元の従業員コードと同じ場合は元に戻す
    if (employeeCode === beforeInfo.employeeCode) {
      this.setEmployeeCondition(beforeInfo, index);
      return;
    }

    // 該当する従業員情報がなければ元に戻す
    this.getEmployee(employeeCode).subscribe((response) => {
      if (!_isNil(response)) {
        this.setEmployeeCondition(response, index);
      } else {
        this.setEmployeeCondition(beforeInfo, index);
      }
    });
  }

  /**
   * 従業員ガイドクリックイベントハンドラ
   */
  onClickEmployeeGuide(index: number) {
    const activeElement = document.activeElement;

    const option = {
      data: {
        employeeCode: index === 0 ? this.condition.contractEmployeeCode1 : this.condition.contractEmployeeCode2,
        employeeDivs: [EmployeeDiv.All],
      },
    };

    this.modalService.show(EmployeeGuideComponent, option).subscribe((modalRef) => {
      if (modalRef.reason === ModalReason.Done) {
        const result = modalRef.getResults();
        this.setEmployeeCondition(result, index);
      }
      modalRef.hide(activeElement);
    });
  }

  /**
   * 出力拠点変更イベントハンドラ
   */
  onChangeOutputOrgArray(event) {
    this.condition.contractOrgOutputFlag = event.includes('contractOrgOutputFlag');
    this.condition.cancelOrgOutputFlag = event.includes('cancelOrgOutputFlag');
  }

  /**
   * 点検サイクル不一致フラグイベントハンドラ
   */
  onChangeMismatchCheckCycleFlagArray(event) {
    this.condition.mismatchInspectionCycleFlag = event.includes('mismatchInspectionCycleFlag');
    this.condition.mismatchLegalOrNewCarCycleFlag = event.includes('mismatchLegalOrNewCarCycleFlag');
  }

  /**
   * 検索条件に従業員情報をセットします。
   * @param propertyName プロパティ名
   * @param info 従業員情報
   */
  private setEmployeeCondition(info: IEmployee, index: number) {
    _defer(() => {
      if (index === 0) {
        this.condition.contractEmployeeCode1 = info.employeeCode;
        this.condition.contractEmployeeName1 = info.employeeName;
      } else {
        this.condition.contractEmployeeCode2 = info.employeeCode;
        this.condition.contractEmployeeName2 = info.employeeName;
      }
    });
  }

  /**
   * 従業員マスタを取得します。
   * @param employeeCode 従業員コード
   * @returns 従業員マスタ
   */
  getEmployee(employeeCode: string): Observable<IEmployee> {
    if (!employeeCode) {
      return ObservableOf(null);
    }

    const entity: IEmployee = {
      companyMgtCode: CommonConst.COMPANY_MGT_CODE_OWN_COMPANY,
      employeeCode: employeeCode,
    };

    const id = this.employeeResource.getIdString(entity);

    return this.employeeResource.getById<IEmployee>(id).pipe(
      map((response) => (response && response.logicalDeleteDiv === LogicalDeleteDiv.Valid ? response : null)),
      catchError((error: BlApiErrorInfo) => {
        if (error.status === HttpStatus.NotFound) {
          return ObservableOf(null);
        } else {
          return ObservableThrow(error);
        }
      })
    );
  }

  getOutputOrgValues() {
    return [
      this.condition.contractOrgOutputFlag ? 'contractOrgOutputFlag' : undefined,
      this.condition.cancelOrgOutputFlag ? 'cancelOrgOutputFlag' : undefined,
    ];
  }

  getMismatchCheckCycleFlag() {
    return [
      this.condition.mismatchInspectionCycleFlag ? 'mismatchInspectionCycleFlag' : undefined,
      this.condition.mismatchLegalOrNewCarCycleFlag ? 'mismatchLegalOrNewCarCycleFlag' : undefined,
    ];
  }
}
