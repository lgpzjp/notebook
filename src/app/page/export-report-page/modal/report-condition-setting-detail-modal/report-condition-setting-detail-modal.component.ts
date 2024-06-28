import { Component } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { finalize, delay } from 'rxjs/operators';
import { defer as _defer, isEmpty as _isEmpty, cloneDeep as _cloneDeep, isNil as _isNil } from 'lodash';

import { DateTimeUtils } from '@blcloud/bl-common';
import { AbstractBlModal, ModalButtonType, ModalReason, BlDialogService } from '@blcloud/bl-ng-ui-component';
import { LoginResourceService } from '@blcloud/bl-ng-share-module';
import { IAccountGenericSettingSubID, ILoginUserEmployeeBindModel } from '@blcloud/bl-datamodel';

import {
  IReportConditionSettingDetailModal,
  ReportConditionSettingDetailModalMode,
  ReportConditionSettingUserDiv,
} from './report-condition-setting-detail-modal.interface';
import { FavoriteConditionService } from '../../service/favorite-condition.service';
import { IFavoriteCondition } from '../../service/favorite-condition.interface';

/**
 * 帳票条件設定詳細モーダル
 */
@Component({
  templateUrl: 'report-condition-setting-detail-modal.component.html',
  styleUrls: ['report-condition-setting-detail-modal.component.scss'],
})
export class ReportConditionSettingDetailModalComponent extends AbstractBlModal {
  footerButtonType: ModalButtonType = ModalButtonType.OkCancel;
  data: IReportConditionSettingDetailModal;

  /** モーダルタイトル */
  title = 'よく使う条件の保存';

  /** 抽出条件名称 */
  conditionName = '';

  /** ログイン利用者従業員結合モデル */
  loginUser: ILoginUserEmployeeBindModel;

  /** アカウント別汎用設定(サブID有) */
  result: IAccountGenericSettingSubID;

  /** 決定ボタン非活性フラグ */
  isDisableOkButton = false;
  /** 更新ボタン非活性フラグ */
  isDisableAnyButton = false;

  readonly ReportConditionSettingUserDiv = ReportConditionSettingUserDiv;

  reportConditionSettingUserDiv = ReportConditionSettingUserDiv.Common;

  readonly reportConditionSettingUserDivArray = [
    { code: ReportConditionSettingUserDiv.Common, name: '共有' },
    { code: ReportConditionSettingUserDiv.Individual, name: '個人' },
  ];

  readonly ReportConditionSettingDetailModalMode = ReportConditionSettingDetailModalMode;

  /**
   * @param service よく使う条件サービス
   * @param loginResourceService ログイン管理リソースサービス
   * @param dialogService ダイアログ管理サービス
   */
  constructor(
    public service: FavoriteConditionService,
    private loginResourceService: LoginResourceService,
    private dialogService: BlDialogService
  ) {
    super();
  }

  getResults(): IAccountGenericSettingSubID {
    return this.result;
  }

  onShown() {
    if (this.data && this.data.conditionName && this.data.accountGenericSettingSubID) {
      this.conditionName = this.data.conditionName;
    }
    // ログイン情報を取得する
    this.loginResourceService.getLoginUserEmployeeBindModel().subscribe((loginUser) => {
      // 自組織を設定
      this.loginUser = loginUser;
    });
    this.updateButtunEnable();
  }

  /**
   * モーダル終了前処理
   * @param reason 終了理由
   */
  dismiss(reason: ModalReason) {
    // 決定
    if (reason === ModalReason.Done || reason === ModalReason.Any) {
      _defer(() => {
        if (_isEmpty(this.conditionName)) {
          return;
        }
        let observable$;
        let message = '';
        if (this.data.mode === ReportConditionSettingDetailModalMode.Add && reason === ModalReason.Done) {
          // 設定の保存
          const settingInfoData: IFavoriteCondition = {
            conditionName: this.conditionName,
            reportCondition: this.data.reportCondition,
            updateDateTime: DateTimeUtils.formatIso(DateTimeUtils.now()),
          };
          const json = JSON.stringify(settingInfoData);
          const accountGenericSettingSubID = <IAccountGenericSettingSubID>{
            blTenantId: this.loginUser.blTenantId,
            blUserId: this.reportConditionSettingUserDiv === ReportConditionSettingUserDiv.Common ? '0' : this.loginUser.blUserId,
            pageId: this.data.pageId,
            settingDataId: this.data.settingDataId,
            settingDataSubId: UUID.UUID(),
            settingInfoDataJson: json,
          };
          observable$ = this.service.postFavoriteCondition(accountGenericSettingSubID);
          message = 'よく使う条件を登録します。よろしいですか？';
        } else {
          // 設定の編集
          const accountGenericSettingSubID = _cloneDeep(this.data.accountGenericSettingSubID);
          const settingInfoData: IFavoriteCondition = {
            conditionName: this.conditionName,
            reportCondition: this.data.reportCondition,
            updateDateTime: DateTimeUtils.formatIso(DateTimeUtils.now()),
          };

          const dataStr = JSON.stringify(settingInfoData);
          accountGenericSettingSubID.settingInfoDataJson = dataStr;
          observable$ = this.service.putFavoriteCondition(accountGenericSettingSubID);
          message = 'よく使う条件を変更します。よろしいですか？';
        }

        // ダイアログで確認をして作成、更新を行う
        this.dialogService.confirm(message).subscribe((dialogRef) => {
          dialogRef.hide();
          if (dialogRef.reason === ModalReason.Done) {
            this.showLoading();
            observable$
              .pipe(
                delay(2000),
                finalize(() => this.hideLoading())
              )
              .subscribe((res) => {
                this.result = res;
                this.emitDismissEvent(reason);
              });
          }
        });
      });
    } else {
      this.emitDismissEvent(reason);
    }
  }

  /**
   * 抽出条件名称変更イベントハンドラ
   * @param event
   */
  onChangeConditionName(event: string) {
    this.conditionName = event;
    this.updateButtunEnable();
  }

  onChangeReportConditionSettingUserDiv(event) {
    this.reportConditionSettingUserDiv = event;
  }

  /**
   * 抽出条件名称変更
   * @param conditionName
   */
  updateButtunEnable() {
    this.isDisableOkButton = _isEmpty(this.conditionName);
    this.isDisableAnyButton = _isEmpty(this.conditionName) || _isNil(this.data.accountGenericSettingSubID);
  }
}
