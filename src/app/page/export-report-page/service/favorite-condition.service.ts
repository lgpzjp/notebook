import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators';

import { BlApiHeaderKey } from '@blcloud/bl-ng-common';
import { BlConditionType } from '@blcloud/bl-ng-common';
import { IAccountGenericSettingSubID } from '@blcloud/bl-datamodel';
import { AccountGenericSettingSubIDResource } from '@blcloud/bl-ng-resource';
import { IFavoriteCondition } from './favorite-condition.interface';

/**
 * よく使う条件サービス
 */
@Injectable()
export class FavoriteConditionService {
  constructor(
    private accountGenericSettingSubIDResource: AccountGenericSettingSubIDResource
  ) {}

  /**
   * よく使う条件の取得
   * @param blUserID BL利用者ID
   * @param pageId 画面ID
   * @param settingDataId 設定識別ID
   * @returns
   */
  getFavoriteConditionList(blUserID: string, pageId: string, settingDataId: string): Observable<IAccountGenericSettingSubID[]> {
    // BL利用者IDはユーザー共通または個人のユーザーを取得
    const conditions = [
      { key: 'blUserID', value: ['0', blUserID], type: BlConditionType.In },
      { key: 'pageId', value: pageId, type: BlConditionType.Equal },
      { key: 'settingDataId', value: settingDataId, type: BlConditionType.Equal },
    ];

    return this.accountGenericSettingSubIDResource.getAll({ conditions }).map((response) => {
      return response ? response.searchResultList : [];
    });
  }

  /**
   * よく使う条件の更新
   * @param accountGenericSettingSubID アカウント別汎用設定(サブID有)
   */
  putFavoriteCondition(accountGenericSettingSubID: IAccountGenericSettingSubID): Observable<IAccountGenericSettingSubID> {
    return this.accountGenericSettingSubIDResource.putByEntity(accountGenericSettingSubID);
  }

  /**
   * よく使う条件の更新
   * @param accountGenericSettingSubID アカウント別汎用設定(サブID有)
   */
  putFavoriteConditionList(entities: IAccountGenericSettingSubID[]): Observable<any> {
    return this.accountGenericSettingSubIDResource.put<IAccountGenericSettingSubID>(entities);
  }

  /**
   * よく使う条件の登録
   * @param accountGenericSettingSubID アカウント別汎用設定(サブID有)
   */
  postFavoriteCondition(accountGenericSettingSubID: IAccountGenericSettingSubID): Observable<IAccountGenericSettingSubID> {
    return this.accountGenericSettingSubIDResource.post(accountGenericSettingSubID, { observe: 'response' }).pipe(
      mergeMap((response) => {
        const entityId = response.headers.get(BlApiHeaderKey.EntityId);
        return this.accountGenericSettingSubIDResource.getById(entityId);
      })
    );
  }

  /**
   * よく使う条件の削除
   * @param accountGenericSettingSubID アカウント別汎用設定(サブID有)
   * @returns
   */
  deleteFavoriteCondition(accountGenericSettingSubID: IAccountGenericSettingSubID): Observable<IAccountGenericSettingSubID> {
    return this.accountGenericSettingSubIDResource.deleteByEntity(accountGenericSettingSubID);
  }

  /**
   * アカウント別汎用設定(サブID有)からパースした設定情報JSONデータを抽出する
   * @param accountGenericSettingSubID アカウント別汎用設定(サブID有)
   * @returns
   */
  extractSettingJsonFromAccountGenericSetting(accountGenericSettingSubID: IAccountGenericSettingSubID): IFavoriteCondition {
    let result;
    try {
      result = JSON.parse(accountGenericSettingSubID.settingInfoDataJson);
    } catch {
      // 何もしない
    }
    return result;
  }
}
