import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { of as RxOf } from 'rxjs/observable/of';
import { isEmpty as _isEmpty } from 'lodash';

import { DateTimeUtils, DateTimeOutput } from "@blcloud/bl-common";
import { ProductCode } from "@blcloud/bl-datamodel/enum/common/product-code";
import { DataExportStatusDiv } from "@blcloud/bl-datamodel/enum/output/data-export-status-div";
import { OpeHistoryKindDiv } from '@blcloud/bl-datamodel/enum/bizcmn/ope-history-kind-div';
import { OperationContentDiv } from '@blcloud/bl-datamodel/enum/bizcmn/operation-content-div';
import { LogicalDeleteDiv } from '@blcloud/bl-datamodel/enum/common/logical-delete-div';
import { FunctionCategoryDiv } from '@blcloud/bl-datamodel/enum/bizcmn/function-category-div';
import { OpeDiv } from '@blcloud/bl-datamodel/enum/bizcmn/ope-div';
import { IGenericDataExportInfo, IOperationHistoryLog, IOpeHistory } from '@blcloud/bl-datamodel';
import { GenericDataExportInfoResource, OperationHistoryLogResource, OpeHistoryResource } from '@blcloud/bl-ng-resource';
import { BlApiSearchCondition, BlApiConditionHelper, BlListResponseBody } from '@blcloud/bl-ng-common';
import { LoginResourceService } from '@blcloud/bl-ng-share-module';

import { ISearchCondition, ISearchResult } from './export-history-page.interface';
import { PAGE_ID } from './export-history-page.const';

/**
 * データ出力履歴ページサービスクラス
 */
@Injectable()
export class ExportHistoryPageService {
  constructor(
    private resource: GenericDataExportInfoResource,
    private loginResourceService: LoginResourceService,
    private operationHistoryLogResource: OperationHistoryLogResource,
    private opeHistoryResource: OpeHistoryResource
  ) {
  }

  /**
   * ログインユーザー所属組織コードを取得します。
   * @returns ログインユーザー所属組織コード
   */
  getLoginUserOrganizationCode(): Observable<string> {
    return this.loginResourceService.getLoginUserEmployeeBindModel().pipe(
      map(loginUser => {
        return loginUser.organizationCode;
      })
    );
  }

  /**
   * 署名付きダウンロードURLを取得します。
   * @param data 汎用データ出力情報
   * @returns 署名付きダウンロードURL
   */
  getSignedDownloadUrl(data: IGenericDataExportInfo): Observable<string> {
    return this.resource.put<string>(data, { entityOptions: { exPath: 'signedurl' } });
  }

  /**
   * ダウンロード操作履歴ログを登録
   * @param fileName ファイル名
   */
  postDownloadOperationHistoryLog(fileName: string) {
    const operationHistoryLog: IOperationHistoryLog = {
      productCode: ProductCode.Common,
      pageId: PAGE_ID,
      opeHistoryFunctionName: 'データダウンロード',
      opeHistoryKindDiv: OpeHistoryKindDiv.Record,
      operationContentDiv: OperationContentDiv.DataDownload,
      opeHistoryMessageList: [`『${fileName}』をダウンロードしました。`],
    };

    this.operationHistoryLogResource.post<IOperationHistoryLog>(operationHistoryLog).pipe(
      catchError(() => {
        return RxOf(null);
      })
    ).subscribe();
  }

  /**
   * ダウンロード操作履歴ログを登録（部品商）
   * @param fileName ファイル名
   */
  postDownloadOperationHistoryLogPm(fileName: string) {
    this.loginResourceService.getLoginUserEmployeeBindModel().pipe(
      mergeMap(loginUser => {
        const entity: IOpeHistory = {
          productCode: ProductCode.Partsman,
          logicalDeleteDiv: LogicalDeleteDiv.Valid,
          functionCategoryDiv: FunctionCategoryDiv.Entry,
          blTenantId: loginUser.blTenantId,
          organizationCode: loginUser.organizationCode,
          organizationName: loginUser.organizationName,
          createEmployeeCode: loginUser.employeeCode,
          createEmployeeName: loginUser.employeeName,
          opeHistoryFunctionName: 'データダウンロード',
          opeDiv: OpeDiv.DataDownload,
          opeHistoryDtlValueList: [`出力ファイル：${fileName}`]
        };

        return this.opeHistoryResource.post<IOpeHistory>(entity);
      }),
      catchError(() => {
        return RxOf(null);
      })
    ).subscribe();
  }

  /**
   * 検索します。
   * @param condition 検索条件
   * @param pageSize ページサイズ
   * @param pageIndex ページインデックス
   * @returns 検索結果
   */
  search(condition: ISearchCondition, pageSize: number, pageIndex: number): Observable<BlListResponseBody<ISearchResult>> {
    // TODO: 汎用テキスト出力用のAPIに差し替え
    const searchParam = {
      conditions: this.createConditionParam(condition),
      // fields: this.createFieldParam(),
      sortFields: this.createSortParam(),
      size: pageSize,
      page: pageIndex,
    };

    return this.resource.search<IGenericDataExportInfo>(searchParam).pipe(
      map(response => {
        const result: BlListResponseBody<ISearchResult> = {
          totalCount: 0,
          searchResultList: []
        };

        if (response && !_isEmpty(response.searchResultList)) {
          result.totalCount = response.totalCount;
          result.searchResultList = this.convertSearchResultList(response.searchResultList);
        }

        return result;
      })
    );
  }

  /**
   * 抽出条件APIパラメータを作成します。
   * @param condition 抽出条件
   * @returns 抽出条件APIパラメータ
   */
  private createConditionParam(condition: ISearchCondition): BlApiSearchCondition {
    const baseConditions = [];

    // 組織
    baseConditions.push(
      BlApiConditionHelper.makeCondStrEqual('organizationCode', condition.organizationCode)
    );

    // 対象期間
    const startDateTime = DateTimeUtils.toDateTime(condition.exportDateStart);
    const endDateTimeNum = DateTimeUtils.parseDate(condition.exportDateEnd);
    const endDateTime = DateTimeUtils.format(DateTimeUtils.addDays(endDateTimeNum, 1), DateTimeOutput.YMD_LTS);
    baseConditions.push(
      BlApiConditionHelper.makeCondStrGreaterThanEqual('dataExportReserveDateTime', startDateTime)
    );
    baseConditions.push(
      BlApiConditionHelper.makeCondStrLessThan('dataExportReserveDateTime', endDateTime)
    );

    const apiCondition = new BlApiSearchCondition();
    apiCondition.addCondition(baseConditions);

    return apiCondition;
  }

  /**
   * 取得項目APIパラメータを作成します。
   * @returns 取得項目APIパラメータ
   */
  // private createFieldParam() {
  //   return [];
  // }

  /**
   * ソート条件APIパラメータを作成します。
   * @returns ソート条件APIパラメータ
   */
  private createSortParam() {
    return [
      { field: 'dataExportReserveDateTime', desc: true },
    ];
  }

  /**
   * 表示用データに変換します。
   * @param list 変換前リスト
   * @returns 変換後リスト
   */
  private convertSearchResultList(list: IGenericDataExportInfo[]): ISearchResult[] {
    return list.map(data => {
      const result = <ISearchResult>data;

      result.downloadButtonInfo = {
        value: '',
        caption: 'ダウンロード',
        classes: 'btn btn-default',
        disabled: data.dataExportStatusDiv !== DataExportStatusDiv.Completion
      };
      result.conditionButtonInfo = {
        value: '',
        caption: '抽出条件',
        classes: 'btn btn-default',
        disabled: false
      };
      result.fileNameToolTipInfo = {
        value: data.uploadFileName,
        tooltip: data.uploadFileName,
        placement: 'bottom'
      };
      result.errorToolTipInfo = {
        value: data.errorMessage,
        tooltip: data.errorMessage,
        placement: 'bottom'
      };

      return result;
    });
  }

}
