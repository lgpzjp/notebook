import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PartialObserver } from 'rxjs/Observer';

import { IOrganizationInformation } from '@blcloud/bl-datamodel';
import { OrganizationInformationResourceService } from '@blcloud/bl-ng-share-module';

/**
 * 組織 個別/範囲指定切り替えサービス
 */
@Injectable()
export class RangeOrganizationService {
  constructor(
    public organizationInformationResourceService: OrganizationInformationResourceService,
  ) { }

  /**
   * 組織ガイドにてフォーカスアウト用のリソースを取得する
   */
  getOrganizationInnerResource(): {} {
    return {
      getById: (code: string) => {
        return Observable.create(
          (observer: PartialObserver<IOrganizationInformation>) => {
            this.organizationInformationResourceService.getByIdUseCache(code).subscribe(
              result => {
                if (!result) {
                  observer.error('該当データが存在しません。');
                } else {
                  observer.next(result);
                  observer.complete();
                }
              }
            );
          }
        );
      }
    };
  }

  /**
   * 組織情報を取得する
   * @param organizationCode 組織コード
   */
  getOrganizationInfo(organizationCode: string): Observable<IOrganizationInformation> {
    return this.organizationInformationResourceService.getByIdUseCache(organizationCode);
  }
}
