import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ILoginUserEmployeeBindModel } from '@blcloud/bl-datamodel';
import { LoginResourceService } from '@blcloud/bl-ng-share-module';

/**
 * 帳票出力サービスクラス
 */
@Injectable()
export class ExportReportPanelContainerService {
  constructor(private loginResourceService: LoginResourceService) {}

  /**
   * ログインユーザー情報を取得します。
   * @returns ログインユーザー情報
   */
  getLoginUserInfo(): Observable<ILoginUserEmployeeBindModel> {
    return this.loginResourceService.getLoginUserEmployeeBindModel();
  }
}
