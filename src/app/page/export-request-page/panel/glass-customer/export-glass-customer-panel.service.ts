import { Injectable } from '@angular/core';
import { ICustomerInfo } from '@blcloud/bl-datamodel';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { BlConditionType } from '@blcloud/bl-ng-common';
import { LogicalDeleteDiv } from '@blcloud/bl-datamodel/enum/common/logical-delete-div';
import { CustomerInfoResource } from '@blcloud/bl-ng-resource';
import { isEmpty as _isEmpty } from 'lodash';

/**
 * 顧客一覧表印刷表サービス
 */
@Injectable()
export class ExportGlassCustomerPanelService {
  /**
   * コンストラクタ
   * @param customerInfoResource 顧客情報リソース
   */
  constructor(
    private customerInfoResource: CustomerInfoResource
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
}