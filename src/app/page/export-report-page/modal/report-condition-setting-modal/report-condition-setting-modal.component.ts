import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { finalize, mergeMap, delay } from 'rxjs/operators';
import { GridOptions, RowEvent } from 'ag-grid';
import { tap } from 'rxjs/operators';
import { orderBy as _orderBy, concat as _concat, assign as _assign } from 'lodash';

import {
  AbstractBlModal,
  BlDialogService,
  BlReferenceGridComponent,
  BlReferenceGridOperationMenu,
  ModalButtonType,
  ModalOption,
  ModalReason,
  ModalSize,
  BlModalService,
} from '@blcloud/bl-ng-ui-component';
import { IAccountGenericSettingSubID, ILoginUserEmployeeBindModel, AccountGenericSettingSubIDDef } from '@blcloud/bl-datamodel';
import { LoginResourceService } from '@blcloud/bl-ng-share-module';

import {
  ReportConditionSettingDetailModalComponent
} from '../report-condition-setting-detail-modal/report-condition-setting-detail-modal.component';
import {
  IReportConditionSettingDetailModal,
  ReportConditionSettingDetailModalMode,
} from '../report-condition-setting-detail-modal/report-condition-setting-detail-modal.interface';
import { FavoriteConditionService } from '../../service/favorite-condition.service';
import { DispOrderSettingComponent } from '../disp-order-setting/disp-order-setting.component';
import { IDispOrderSetting } from '../disp-order-setting/disp-order-setting.interface';
import {
  IReportConditionSettingModal,
  IReportConditionSettingModalTable,
  IReportConditionSettingModalResponse,
} from './report-condition-setting-modal.interface';
import { ColumnDefs } from './report-condition-setting-modal.const';

/**
 * 帳票条件設定モーダルラベルガイド
 */
@Component({
  templateUrl: 'report-condition-setting-modal.component.html',
  styleUrls: ['report-condition-setting-modal.component.scss'],
})
export class ReportConditionSettingModalComponent extends AbstractBlModal {
  ModalButtonType: typeof ModalButtonType = ModalButtonType;
  @ViewChild('grid') grid: BlReferenceGridComponent;

  /** モーダルタイトル */
  title = 'よく使う条件';

  /** グリッド設定 */
  gridOptions: GridOptions = {};

  /** 帳票条件設定モーダル */
  data: IReportConditionSettingModal;
  /** 帳票条件設定モーダルテーブル */
  tableData: IReportConditionSettingModalTable[] = [];
  /** ログイン利用者従業員結合モデル */
  loginUser: ILoginUserEmployeeBindModel;
  /** 選択行 */
  selectedRow: IReportConditionSettingModalTable;
  /** 帳票条件設定モーダル出力 */
  result: IReportConditionSettingModalResponse = {};

  /**
   * @param service よく使う条件サービス
   * @param loginResourceService ログイン管理リソースサービス
   * @param dialogService ダイアログ管理サービス
   * @param modalService モーダル管理サービス
   */
  constructor(
    private service: FavoriteConditionService,
    private loginResourceService: LoginResourceService,
    private dialogService: BlDialogService,
    private modalService: BlModalService
  ) {
    super();
  }

  defaultOption(): ModalOption {
    return {
      size: ModalSize.Large,
    };
  }

  getResults(): IReportConditionSettingModalResponse {
    return this.result;
  }

  onShown() {
    this.showLoading();
    // ログイン情報を取得する
    this.loginResourceService
      .getLoginUserEmployeeBindModel()
      .pipe(
        finalize(() => this.hideLoading()),
        mergeMap((loginUser) => {
          // 自組織を設定
          this.loginUser = loginUser;
          return this.reload();
        })
      )
      .subscribe(() => {});
  }

  /**
   * モーダル終了前処理
   * @param reason 終了理由
   */
  dismiss(reason: ModalReason) {
    // 決定
    if (reason === ModalReason.Done) {
      if (this.selectedRow) {
        this.result.accountGenericSettingSubID = this.selectedRow.accountGenericSettingSubID;
      }
    }
    this.emitDismissEvent(reason);
  }

  onReadyGrid() {
    this.grid.setColumnDefs(ColumnDefs);
  }

  /**
   * 行選択イベントハンドラ
   * @param rowData
   */
  onSelectedRow(rowData: RowEvent) {
    this.selectedRow = rowData.data;
  }

  /**
   * 表示順位設定ボタンクリックイベントハンドラ
   */
  onClickOrderButton() {
    const dispOrderSetting: IDispOrderSetting = {
      items: this.tableData.filter((data) => data.accountGenericSettingSubID.blUserId !== '0'),
      field: 'conditionName',
    };
    this.modalService.show(DispOrderSettingComponent, { data: { dispOrderSetting } }).subscribe((ref) => {
      ref.hide();
      if (ref.reason === ModalReason.Done) {
        const result: IReportConditionSettingModalTable[] = ref.getResults();
        const entities = result.map((entity, index) => {
          const json = this.service.extractSettingJsonFromAccountGenericSetting(entity.accountGenericSettingSubID);
          if (json) {
            json.positiveInteger = index + 1;
            const jsonString = JSON.stringify(json);
            entity.accountGenericSettingSubID.settingInfoDataJson = jsonString;
            return entity;
          }
        });
        const accountGenericSettingSubIDList = entities.map((e) => e.accountGenericSettingSubID);
        this.showLoading();
        this.service
          .putFavoriteConditionList(accountGenericSettingSubIDList)
          .pipe(
            delay(2000),
            finalize(() => this.hideLoading())
          )
          .subscribe(() => {
            this.reload().subscribe();
          });
      }
    });
  }

  /**
   * グリッドの再読み込み
   * @returns
   */
  private reload(): Observable<IAccountGenericSettingSubID[]> {
    return this.service.getFavoriteConditionList(this.loginUser.blUserId, this.data.pageId, this.data.settingDataId).pipe(
      tap((res) => {
        if (res) {
          this.tableData = this.convertToTableData(res);
          this.setGridData(this.tableData);
        }
      })
    );
  }

  /**
   * グリッドデータのセット
   */
  private setGridData(tableData: IReportConditionSettingModalTable[]) {
    const menu = [
      {
        items: [
          {
            text: '編集',
            click: (_event, item) => {
              const data: IReportConditionSettingDetailModal = {
                mode: ReportConditionSettingDetailModalMode.Edit,
                accountGenericSettingSubID: item.accountGenericSettingSubID,
                reportCondition: item.reportCondition,
                conditionName: item.conditionName,
              };
              this.modalService.show(ReportConditionSettingDetailModalComponent, { data }).subscribe((ref) => {
                ref.hide();
                if (ref.reason === ModalReason.Done) {
                  this.reload().subscribe();
                  const result: IAccountGenericSettingSubID = ref.getResults();
                  const settingInfoDataJson = this.service.extractSettingJsonFromAccountGenericSetting(result);
                  const updatedId = AccountGenericSettingSubIDDef.getIdString(result);
                  const inputId = AccountGenericSettingSubIDDef.getIdString(this.data.accountGenericSettingSubID);
                  if (settingInfoDataJson) {
                    item.conditionName = settingInfoDataJson.conditionName;
                    // 選択中のデータの名称を更新
                    if (updatedId === inputId) {
                      this.result.accountGenericSettingSubID = result;
                    }
                  }
                }
              });
            },
          },
          {
            text: '削除',
            click: (_event, item) => {
              this.dialogService.confirm('選択した設定を削除します。よろしいですか？').subscribe((dialogRef) => {
                dialogRef.hide();
                if (dialogRef.reason === ModalReason.Done) {
                  this.showLoading();
                  const setting: IAccountGenericSettingSubID = item.accountGenericSettingSubID;
                  this.service
                    .deleteFavoriteCondition(setting)
                    .pipe(
                      delay(2000),
                      finalize(() => this.hideLoading())
                    )
                    .subscribe(() => {
                      // 選択中のデータが削除された場合はフラグを立てる
                      const itemId = AccountGenericSettingSubIDDef.getIdString(item.accountGenericSettingSubID);
                      const inputId = AccountGenericSettingSubIDDef.getIdString(this.data.accountGenericSettingSubID);
                      if (itemId === inputId) {
                        this.result.deleted = true;
                        this.result.accountGenericSettingSubID = undefined;
                      }
                      // テーブルの更新
                      this.reload().subscribe();
                    });
                }
              });
            },
          },
        ],
      },
    ];
    const operationMenu: BlReferenceGridOperationMenu = {
      createMenu: (_rowData) => {
        return menu;
      },
    };
    if (tableData.length === 0) {
      this.grid.showNoRows();
    }
    this.grid.setData(tableData, operationMenu);
    this.grid.adjustSizeColumnToFit();
  }

  /**
   * テーブルデータへの変換
   * @param settingList アカウント別汎用設定(サブID有)
   * @returns
   */
  private convertToTableData(settingList: IAccountGenericSettingSubID[]): IReportConditionSettingModalTable[] {
    const tableData = settingList.map((setting) => {
      const json = this.service.extractSettingJsonFromAccountGenericSetting(setting);
      if (json) {
        return <IReportConditionSettingModalTable>_assign(json, { accountGenericSettingSubID: setting });
      }
    });
    // 個人用データは表示順位で並び替え、共有データは名称で並び替えて結合する
    const individualData = _orderBy(
      tableData.filter((data) => data.accountGenericSettingSubID.blUserId !== '0'),
      ['positiveInteger']
    );
    const commonData = _orderBy(
      tableData.filter((data) => data.accountGenericSettingSubID.blUserId === '0'),
      ['conditionName']
    );
    const sortedTable = _concat(individualData, commonData);
    return sortedTable;
  }
}
