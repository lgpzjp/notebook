import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';
import { BlApiErrorInfo, BlConditionType, HttpStatus } from '@blcloud/bl-ng-common';
import { LogicalDeleteDiv } from '@blcloud/bl-datamodel/enum/common/logical-delete-div';
import { of as ObservableOf } from 'rxjs/observable/of';
import {
  ICodeDivNameMgtBody,
  ICustomerInfo,
  IEmployee,
} from '@blcloud/bl-datamodel';
import {
  isEmpty as _isEmpty,
  isNil as _isNil, find as _find,
} from 'lodash';
import {
  CodeDivNameMgtBodyResource,
  CustomerInfoResource,
  EmployeeResource,
} from '@blcloud/bl-ng-resource';
import { CommonConst } from '@blcloud/bl-datamodel/const/common';

/**
 * 売上データ出力サービス
 */
@Injectable()
export class ExportGlassSalesSlipPanelService {
  /**
   * コンストラクタ
   * @param codeDivNameMgtBodyResource コード区分名称管理明細リソース
   * @param customerInfoResource 顧客情報リソース
   */
  constructor(
    private customerInfoResource: CustomerInfoResource,
    private codeDivNameMgtBodyResource: CodeDivNameMgtBodyResource,
    private employeeResource: EmployeeResource,
  ) { }

  /**
   * 顧客情報を取得します。
   * @param customerCode 顧客コード
   * @returns 顧客情報
   */
  getCustomerInfo(customerCode: number): Observable<ICustomerInfo> {
    const conditions = [
      { key: 'logicalDeleteDiv', type: BlConditionType.Equal, value: LogicalDeleteDiv.Valid },
      { key: 'customerCode', type: BlConditionType.Equal, value: customerCode },
    ];

    return this.customerInfoResource.getAll<ICustomerInfo>({
      conditions: conditions
    }).pipe(
      map(response => !_isEmpty(response) ? response.searchResultList[0] : null)
    );
  }

  /**
   * 区分マスタを取得します。
   * @param cdDivClassCd コード・区分分類コード
   * @param cdDivCd コード・区分コード
   * @returns 区分マスタ
   */
  getDivision(cdDivClassCd: string, cdDivCd: number): Observable<ICodeDivNameMgtBody> {
    const conditions = [
      { key: 'logicalDeleteDiv', type: BlConditionType.Equal, value: LogicalDeleteDiv.Valid },
      { key: 'cdDivClassCd', type: BlConditionType.Equal, value: cdDivClassCd },
      { key: 'cdDivCd', type: BlConditionType.Equal, value: cdDivCd },
    ];
    return this.codeDivNameMgtBodyResource.search<ICodeDivNameMgtBody>({ conditions: conditions }).pipe(
      map(response => {
        if (!_isNil(response)) {
          const division: ICodeDivNameMgtBody = _find(response.searchResultList, item => item.cdDivCd.toString() === cdDivCd.toString()
            && item.logicalDeleteDiv.toString() === LogicalDeleteDiv.Valid.toString()
          );
          return division;
        } else {
          return null;
        }
      })
    );
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
      employeeCode: employeeCode
    };

    const id = this.employeeResource.getIdString(entity);

    return this.employeeResource.getById<IEmployee>(id).pipe(
      map(response => response && response.logicalDeleteDiv === LogicalDeleteDiv.Valid ? response : null),
      catchError((error: BlApiErrorInfo) => {
        if (error.status === HttpStatus.NotFound) {
          return ObservableOf(null);
        } else {
          throw error;
        }
      })
    );
  }
}
