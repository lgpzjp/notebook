import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { isEmpty as _isEmpty, forEach as _forEach } from 'lodash';

import { LocalStorageUtils } from '@blcloud/bl-common';
import { LogicalDeleteDiv } from '@blcloud/bl-datamodel/enum/common/logical-delete-div';
import { ExportInfoTabDiv } from '@blcloud/bl-datamodel/enum/output/export-info-tab-div';
import { IExportPatternInfo, ILoginUserEmployeeBindModel } from '@blcloud/bl-datamodel';
import { ExportPatternInfoResource } from '@blcloud/bl-ng-resource';
import { BlApiSearchCondition, BlApiConditionHelper } from '@blcloud/bl-ng-common';
import { LoginResourceService } from '@blcloud/bl-ng-share-module';

import { ExportPatternSelectorOnSave } from '../../export-page/components/export-pattern-selector/export-pattern-selector.define';

/**
 * データ出力サービスクラス
 */
 @Injectable()
export class ExportPanelContainerService {
  constructor(
    private loginResourceService: LoginResourceService,
    private exportPatternInfoResource: ExportPatternInfoResource
  ) {}

  /**
   * ログインユーザー情報を取得します。
   * @returns ログインユーザー情報
   */
  getLoginUserInfo(): Observable<ILoginUserEmployeeBindModel> {
    return this.loginResourceService.getLoginUserEmployeeBindModel();
  }

  /**
   * 出力パターン情報を取得します。
   * @param exportInfoTabDiv 出力情報タブ区分
   * @param exportInfoDiv 出力情報区分
   * @param exportWorkTypeDiv 出力作業タイプ区分
   * @returns 出力パターン情報
   */
  getExportPatternInfo(exportInfoTabDiv: string, exportInfoDiv: string, exportWorkTypeDiv: string): Observable<IExportPatternInfo[]> {

    const andCondition = [
      BlApiConditionHelper.makeCondStrEqual('logicalDeleteDiv', LogicalDeleteDiv.Valid),
      BlApiConditionHelper.makeCondStrEqual('exportInfoTabDiv', exportInfoTabDiv),
    ];

    if (!_isEmpty(exportInfoDiv)) {
      andCondition.push(
        BlApiConditionHelper.makeCondStrEqual('exportInfoDiv', exportInfoDiv),
      );
    }

    if (!_isEmpty(exportWorkTypeDiv)) {
      andCondition.push(
        BlApiConditionHelper.makeCondStrEqual('exportWorkTypeDiv', exportWorkTypeDiv),
      );
    }

    const conditions = new BlApiSearchCondition();
    conditions.addCondition(
      BlApiConditionHelper.makeCondAnd(...andCondition)
    );

    const sortFields = [
      {
        field: 'exportPatternCode',
        desc: false,
      }
    ];
    return this.exportPatternInfoResource.getAll<IExportPatternInfo>({ conditions, sortFields }).pipe(
      map(res => res && res.searchResultList ? res.searchResultList : [])
    );
  }

  /**
   * ローカルストレージから出力パターン選択情報を取得します。
   * @param blTenantId テナントID
   * @param blUserId ユーザーID
   * @param exportInfoTabDiv 出力情報タブ区分
   * @returns 出力パターン選択情報
   */
  getExportPatternLocalStorage(blTenantId: string, blUserId: string, exportInfoTabDiv: string): any {
    const storageKey = this.getExportPatternStorageKey(blTenantId, blUserId, exportInfoTabDiv);
    let exportPatterns = LocalStorageUtils.get(storageKey);
    if (!exportPatterns) {
      exportPatterns = {};
    }

    // 旧ストレージを反映
    const oldStorageKey = this.getExportPatternOldStorageKey(blTenantId, blUserId, exportInfoTabDiv);
    if (oldStorageKey) {
      const oldData = JSON.parse(localStorage.getItem(oldStorageKey));
      if (oldData) {
        _forEach(oldData.data, (item: ExportPatternSelectorOnSave) => {
          exportPatterns[item.key] = item.value.exportPatternValue;
        });

        // 新ストレージに保存して旧ストレージを削除
        LocalStorageUtils.save(storageKey, exportPatterns);
        localStorage.removeItem(oldStorageKey);
      }
    }

    return exportPatterns;
  }

  /**
   * ローカルストレージに出力パターン選択情報を保存します。
   * @param blTenantId テナントID
   * @param blUserId ユーザーID
   * @param exportInfoTabDiv 出力情報タブ区分
   * @param exportPatterns 出力パターン選択情報
   */
  saveExportPatternLocalStorage(blTenantId: string, blUserId: string, exportInfoTabDiv: string, exportPatterns: any) {
    const storageKey = this.getExportPatternStorageKey(blTenantId, blUserId, exportInfoTabDiv);
    LocalStorageUtils.save(storageKey, exportPatterns);
  }

  /**
   * 出力パターンのストレージキーを取得します。
   * @param blTenantId テナントID
   * @param blUserId ユーザーID
   * @param exportInfoTabDiv 出力情報タブ区分
   * @returns 出力パターンのストレージキー
   */
  private getExportPatternStorageKey(blTenantId: string, blUserId: string, exportInfoTabDiv: string) {
    return 'exportPattern_' + blTenantId.toUpperCase() + '-' + blUserId + '-' + exportInfoTabDiv;
  }

  /**
   * 出力パターンの旧ストレージキーを取得します。
   * @param blTenantId テナントID
   * @param blUserId ユーザーID
   * @param exportInfoTabDiv 出力情報タブ区分
   * @returns 出力パターンの旧ストレージキー
   */
  private getExportPatternOldStorageKey(blTenantId: string, blUserId: string, exportInfoTabDiv: string) {
    const key = blTenantId.toUpperCase() + '_' + blUserId + '_';

    switch (exportInfoTabDiv) {
      case ExportInfoTabDiv.CustomerVehicle:
        return key + 'tableContentDefaultTab1';
      case ExportInfoTabDiv.Slip:
        return key + 'tableContentDefaultTab2';
      case ExportInfoTabDiv.WorkHistory:
        return key + 'tableContentDefaultTab3';
      case ExportInfoTabDiv.SalesSlip:
      case ExportInfoTabDiv.RecycleSalesSlip:
        return key + 'tableContentDefaultTab4';
      case ExportInfoTabDiv.Credit:
      case ExportInfoTabDiv.RecycleCredit:
        return key + 'tableContentDefaultTab5';
      case ExportInfoTabDiv.PurchaseSlip:
      case ExportInfoTabDiv.RecyclePurchaseSlip:
        return key + 'tableContentDefaultTab6';
      case ExportInfoTabDiv.Debt:
      case ExportInfoTabDiv.RecycleDebt:
        return key + 'tableContentDefaultTab7';
      case ExportInfoTabDiv.StockMoveSlip:
        return key + 'tableContentDefaultTab8';
      case ExportInfoTabDiv.Customer:
        return key + 'tableContentDefaultTab9';
      case ExportInfoTabDiv.VehicleMgt:
        return key + 'tableContentDefaultTab10';
      case ExportInfoTabDiv.Stock:
        return key + 'tableContentDefaultTab11';
      case ExportInfoTabDiv.GlassSalesSlip:
        return key + 'tableContentDefaultTab15';
      case ExportInfoTabDiv.GlassDeposit:
        return key + 'tableContentDefaultTab12';
      case ExportInfoTabDiv.GlassCustomer:
        return key + 'tableContentDefaultTab16';
      case ExportInfoTabDiv.GlassItem:
        return key + 'tableContentDefaultTab13';
      case ExportInfoTabDiv.GlassStock:
        return key + 'tableContentDefaultTab17';
      case ExportInfoTabDiv.RecycleCustomer:
        return key + 'tableContentDefaultTab14';
      default:
        return null;
    }
  }

}
