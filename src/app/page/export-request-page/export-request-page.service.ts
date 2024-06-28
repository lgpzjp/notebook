import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { forEach as _forEach, isNil as _isNil, every as _every, some as _some, find as _find, filter as _filter } from 'lodash';

import { LoginResourceService } from '@blcloud/bl-ng-share-module';

import { IExportGroupItem, IExportMenuItem } from './export-request-page.interface';
import { ExportGroupItems, ExportMenuItems } from './export-request-page.const';

/**
 * データ出力リクエストサービスクラス
 */
 @Injectable()
export class ExportRequestPageService {
  constructor(
    private loginResourceService: LoginResourceService,
  ) {}

  /**
   * すべての出力メニュー項目リストを取得します。
   * @returns すべての出力メニュー項目リスト
   */
  getAllExportMenuItems(): Observable<IExportMenuItem[]> {
    return this.loginResourceService.getAllServiceAvailabilityInfo().pipe(
      map(availabilityInfos => {
        const items: IExportMenuItem[] = [];

        // 有効サービスでフィルタ
        _forEach(ExportMenuItems, item => {
          let availability = true;

          if (!_isNil(item.requiredServiceIds)) {
            availability = _every(item.requiredServiceIds, id =>
              _some(availabilityInfos, info => info.serviceId === id && info.serviceAvailableFlag === true));
          }

          if (availability) {
            if (!_isNil(item.serviceIds)) {
              availability = _some(item.serviceIds, id =>
                _some(availabilityInfos, info => info.serviceId === id && info.serviceAvailableFlag === true));
            }
          }

          if (availability) {
            if (!_isNil(item.notServiceId)) {
              availability = !_some(item.notServiceId, id =>
                _some(availabilityInfos, info => info.serviceId === id && info.serviceAvailableFlag === true));
            }
          }

          if (availability) {
            items.push({
              id: item.id,
              label: item.label,
              exportGroupId: item.exportGroupId,
              path: item.path,
              active: false,
            });
          }
        });

        return items;
      })
    );
  }

  /**
   * 出力グループ項目リストを取得します。
   * @param allExportMenuItems すべての出力メニュー項目リスト
   * @returns 出力グループ項目リスト
   */
  getExportGroupItems(allExportMenuItems: IExportMenuItem[]): IExportGroupItem[] {
    const items: IExportGroupItem[] = [];

    _forEach(allExportMenuItems, exportMenuItem => {
      // メインメニュー項目リストにまだ追加されていない場合
      if (_every(items, item => item.id !== exportMenuItem.exportGroupId)) {
        // メインメニュー項目定義から該当する項目を追加
        const mainMenuItem = _find(ExportGroupItems, item => item.id === exportMenuItem.exportGroupId);
        if (mainMenuItem) {
          items.push(mainMenuItem);
        }
      }
    });

    return items;
  }

  /**
   * 出力メニュー項目リストを取得します。
   * @param allExportMenuItems すべての出力メニュー項目リスト
   * @param exportGroupId 出力グループID
   * @returns 出力メニュー項目リスト
   */
  getExportMenuItems(allExportMenuItems: IExportMenuItem[], exportGroupId: string): IExportMenuItem[] {
    return _filter(allExportMenuItems, exportMenuItem => exportMenuItem.exportGroupId === exportGroupId);
  }



}
