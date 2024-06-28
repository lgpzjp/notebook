export interface IRowInTablePatternInfo {
  exportInfoDivEnumName: string;
  exportPatternCode: string;
  exportInfoDiv: string;
  exportPattern: IDropDownInput[];
  exportWorkTypeDiv: string;
}

export interface IDropDownInput {
  code: string;
  name: string;
}

export interface ExportPatternSelected {
  exportPatternValue: string | number;
}

export interface ExportPatternSelectorOnSave {
  key: string | number;
  value: ExportPatternSelected;
}
