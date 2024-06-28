export interface IExportGlassSettingInfoPanelConditionInput {
  /** 出力パターンコード */
  exportPatternCode: string;
  /** プロダクトコード */
  productCode: string;
  /** ヘッダ選択 */
  outPutHeaderDiv: string;
}


/**
 * 『出力内容』の配列情報
 */
export const ExportSettingInfoPanelDivArray: Array<{ value: string, text: string }> = [
  { value: '91', text: '硝子結合' },
  { value: '92', text: '接着剤' },
  { value: '93', text: '車種メモ' },
  { value: '94', text: '硝子メモ' }
];
