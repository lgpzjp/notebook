import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { of as ObservableOf } from 'rxjs/observable/of';
import { isNil as _isNil, defer as _defer, isEmpty as _isEmpty } from 'lodash';
import { _throw as ObservableThrow } from 'rxjs/observable/throw';

import { EmployeeResource } from '@blcloud/bl-ng-resource';
import { BlModalService, ModalReason } from '@blcloud/bl-ng-ui-component';
import { EmployeeGuideComponent, EmployeeDiv } from '@blcloud/bl-ng-share-module';
import { BlApiErrorInfo, HttpStatus } from '@blcloud/bl-ng-common';
import { IMaintePackName, IEmployee } from '@blcloud/bl-datamodel';
import { MPContractStatusArray } from '@blcloud/bl-datamodel/enum/vehicle/m-p-contract-status';
import { CommonConst } from '@blcloud/bl-datamodel/const/common';
import { LogicalDeleteDiv } from '@blcloud/bl-datamodel/enum/common/logical-delete-div';

import { ICustomerPanelPartsCondition, ICustomerPanelPartsConditionShown } from './customer-panel-parts.interface';

/**
 * 顧客パネル部品コンポーネント
 */
@Component({
  selector: 'app-customer-panel-parts',
  templateUrl: 'customer-panel-parts.component.html',
  styleUrls: ['customer-panel-parts.component.scss'],
  providers: [EmployeeResource],
})
export class CustomerPanelPartsComponent {
  @Input() condition: ICustomerPanelPartsCondition = {};
  @Input() conditionShown: ICustomerPanelPartsConditionShown = {};

  /** メンテナンスパック名称配列 */
  maintePackNameList: IMaintePackName[] = [];

  /** MP契約ステータス */
  readonly MPContractStatusArray = MPContractStatusArray;

  constructor(private modalService: BlModalService, private employeeResource: EmployeeResource) {}

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
      employeeCode: index === 0 ? this.condition.receptPicCode1 : this.condition.receptPicCode2,
      employeeName: index === 0 ? this.condition.receptPicName1 : this.condition.receptPicName2,
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
        employeeCode: index === 0 ? this.condition.receptPicCode1 : this.condition.receptPicCode2,
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
   * 検索条件に従業員情報をセットします。
   * @param propertyName プロパティ名
   * @param info 従業員情報
   */
  private setEmployeeCondition(info: IEmployee, index: number) {
    _defer(() => {
      if (index === 0) {
        this.condition.receptPicCode1 = info.employeeCode;
        this.condition.receptPicName1 = info.employeeName;
      } else {
        this.condition.receptPicCode2 = info.employeeCode;
        this.condition.receptPicName2 = info.employeeName;
      }
    });
  }

  /**
   * 従業員マスタを取得します。
   * @param employeeCode 従業員コード
   * @returns 従業員マスタ
   */
  private getEmployee(employeeCode: string): Observable<IEmployee> {
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
}
