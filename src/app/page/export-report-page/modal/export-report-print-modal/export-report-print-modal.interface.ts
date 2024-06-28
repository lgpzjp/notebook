import { IGenericPrintModalData } from '@blcloud/bl-ng-share-module';

/**
 * 拡張汎用印刷条件
 */
export interface IGenericPrintModalDataEx extends IGenericPrintModalData {
  /** 帳票ID配列 */
  reportIdList?: string[];
}
