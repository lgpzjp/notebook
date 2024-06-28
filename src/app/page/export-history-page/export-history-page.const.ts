import { ColDef } from "ag-grid";
import { DateEra, DateSeparator, DateTimeOutput, DateTimePadding, DateTimeUtils } from "@blcloud/bl-common";
import { ButtonCellEditorComponent, ButtonCellRendererComponent, TooltipCellComponent } from "@blcloud/bl-ng-ui-component";
import { PageId, PageName } from '@blcloud/bl-ng-share-module';

/** 画面ID */
export const PAGE_ID = PageId.DataExportHistory;

/** 画面タイトル */
export const PAGE_TITLE = PageName[PageId.DataExportHistory];

/** グリッドサイズパターン */
export const PageSizePatterns = [50, 100, 150, 200];

/** 検索最大件数 */
export const SEARCH_MAX_COUNT = 1000;

/** 自動更新のローカルストレージキー */
export const AUTO_UPDATE_STORAGE_KEY = 'export-history-auto-update';

/** 自動更新デフォルト設定 */
export const AutoUpdateDefaultSetting = {
  /** 自動更新の有効可否 */
  enable: true,
};

/** メッセージ定義 */
export const Message = {
  /** 検索件数オーバー */
  OverSearchCount: '検索結果が' + SEARCH_MAX_COUNT + '件を超えています。<br>' + SEARCH_MAX_COUNT + '件以下となるように検索条件を指定してください。',
  /** 条件未入力 */
  EmptyCondition: '検索内容を入力してください。',
  /** 該当なし */
  NotFound: '該当する候補が見つかりません。内容を確認し再検索してください。',
  /** ダウンロード失敗 */
  FailDownload: 'ダウンロードに失敗しました。再度お試しください。'
};

/** デフォルト列定義 */
export const DefaultColumns = <ColDef[]>[
  {
    headerName: '出力開始日時',
    field: 'dataExportReserveDateTime',
    width: 180,
    minWidth: 180,
    maxWidth: 180,
    valueFormatter: formatDateTime
  },
  {
    headerName: '出力完了日時',
    field: 'dataExportEndDateTime',
    width: 180,
    minWidth: 180,
    maxWidth: 180,
    valueFormatter: formatDateTime
  },
  {
    headerName: '出力状況',
    field: 'dataExportStatusDivEnumName',
    width: 140,
    minWidth: 140,
  },
  {
    headerName: 'ダウンロード',
    field: 'downloadButtonInfo',
    width: 140,
    minWidth: 140,
    maxWidth: 140,
    align: 'center',
    cellRendererFramework: ButtonCellRendererComponent,
    cellEditorFramework: ButtonCellEditorComponent,
  },
  {
    headerName: '抽出条件',
    field: 'conditionButtonInfo',
    width: 140,
    minWidth: 140,
    maxWidth: 140,
    align: 'center',
    cellRendererFramework: ButtonCellRendererComponent,
    cellEditorFramework: ButtonCellEditorComponent,
  },
  {
    headerName: '出力ファイル名',
    field: 'fileNameToolTipInfo',
    width: 250,
    minWidth: 250,
    cellRendererFramework: TooltipCellComponent,
  },
  {
    headerName: '出力件数',
    field: 'totalCount',
    width: 80,
    minWidth: 80,
    align: 'right'
  },
  {
    headerName: '容量',
    field: 'fileSize',
    width: 80,
    minWidth: 80,
    align: 'right',
    valueFormatter: formatFileSize
  },
  {
    headerName: '出力ユーザー',
    field: 'employeeName',
    width: 160,
    minWidth: 160,
  },
  {
    headerName: 'エラー内容',
    field: 'errorToolTipInfo',
    width: 160,
    minWidth: 160,
    cellRendererFramework: TooltipCellComponent,
  },
];

function formatFileSize(param: any) {
  if (param && param.value) {
    let sizes = ['バイト', 'KB', 'MB', 'GB'];
    if (param.value == 0) return '0 バイト';
    let i = Math.floor(Math.log( param.value ) / Math.log(1024));
    const base = 100; // 小数点以下2桁まで表示するための値
    return Math.round(param.value / Math.pow(1024, i) * base) / base + ' ' + sizes[i];
  }
  return '';
}

function formatDateTime(param: any) {
  if (param && param.value) {
    const dateTime = DateTimeUtils.parseDate(param.value);
    return DateTimeUtils.format(dateTime, DateTimeOutput.YMD_LT, DateTimePadding.ZERO, DateSeparator.JP, DateEra.JP);
  }
  return '';
}
