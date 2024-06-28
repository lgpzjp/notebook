import { Injectable, Injector } from '@angular/core';
import { isNil as _isNil } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { of as ObservableOf } from 'rxjs/observable/of';

import { IReportLayoutSetting } from '@blcloud/bl-datamodel';
import { BlConditionType } from '@blcloud/bl-ng-common';
import { IGenericPrintModalDataEx } from './export-report-print-modal.interface';
import { GenericPrintService } from '@blcloud/bl-ng-share-module';

/**
 * 帳票印刷モーダルサービス
 */
@Injectable()
export class ExportReportPrintModalService extends GenericPrintService {
  /**
   * コンストラクタ
   * @param injector Injector
   */
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * @override
   * 帳票IDを検索条件に追加して帳票レイアウト設定リストを取得する
   */
  searchReportLayoutSettingList(data: IGenericPrintModalDataEx): Observable<IReportLayoutSetting[]> {
    // 起動パラメータで帳票リストを指定されている
    if (!_isNil(data.reportLayoutSettingList)) {
      return ObservableOf(data.reportLayoutSettingList);
    } else {
      const conditions = [
        { key: 'pageId', value: data.pageId, type: BlConditionType.Equal },
        { key: 'reportId', value: data.reportIdList, type: BlConditionType.In },
      ];
      const sortFields = [{ field: 'reportId', desc: false }];

      if (!_isNil(data.reportUseCode)) {
        conditions.push({ key: 'reportUseCode', value: `${data.reportUseCode}`, type: BlConditionType.Equal });
      }

      return this.reportLayoutSettingResource.getAll<IReportLayoutSetting>({ conditions, sortFields }).pipe(
        map((response) => {
          return response ? response.searchResultList : [];
        })
      );
    }
  }
}
