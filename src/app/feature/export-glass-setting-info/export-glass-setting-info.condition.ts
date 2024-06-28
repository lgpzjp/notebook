import { isUndefined as _isUndefined } from 'lodash';
import {
  BlSearchCondition,
  BlConditionType,
  BlSearchConditionManager,
  BlApiQueryParams,
  BlSearchConditionGroup,
} from '@blcloud/bl-ng-common';

/** 硝子設定情報出力条件 */
class ExportGlassSettingInfoCondition extends BlSearchCondition {
  /** @override */
  public setValue(value: any): void {
    if (_isUndefined(value)) {
      super.clear();
    } else {
      super.setValue(value);
    }
  }

  /** @override */
  public setType(type: BlConditionType): void {
    if (_isUndefined(type)) {
      super.clear();
    } else {
      super.setType(type);
    }
  }
}

/**
 * プロダクトコード
 */
class ProductCodeCondition extends ExportGlassSettingInfoCondition {
  static readonly KEY = 'productCode';
}

/**
 * テキスト出力パターンコード配列
 */
class ExportPatternCodeListCondition extends ExportGlassSettingInfoCondition {
  static readonly KEY = 'exportPatternCodeList';
}

/**
 * ヘッダ行
 */
class OutPutHeaderDivCondition extends ExportGlassSettingInfoCondition {
  static readonly KEY = 'outPutHeaderDiv';
}

/**
 * クライアントセッションID
 */
class ClientSessionIdCondition extends ExportGlassSettingInfoCondition {
  static readonly KEY = 'clientSessionId';
}

/**
 * 硝子取引先情報出力条件を管理
 */
export class ExportGlassSettingInfoConditionManager extends BlSearchConditionManager {
  constructor() {
    super([
      { type: BlConditionType.In, key: ExportPatternCodeListCondition.KEY, classType: ExportPatternCodeListCondition },
      { key: OutPutHeaderDivCondition.KEY, classType: OutPutHeaderDivCondition },
      { type: BlConditionType.Equal, key: ProductCodeCondition.KEY, classType: ProductCodeCondition },
      { type: BlConditionType.Equal, key: ClientSessionIdCondition.KEY, classType: ClientSessionIdCondition },
    ]);
  }

  /**
   * 検索条件を初期化する
   */
  public clear(): void {
    this.conditionMap.forEach(condition => {
      condition.clear();
    });
  }

  /**
   * クエリ生成
   * @return BlApiQueryParams
   */
  public makeQueryParameter(): BlApiQueryParams {
    const apiQueryParameter = new BlApiQueryParams();
    const grp: BlSearchConditionGroup = this.and(
      ExportPatternCodeListCondition.KEY,
      OutPutHeaderDivCondition.KEY,
      ProductCodeCondition.KEY,
      ClientSessionIdCondition.KEY,
    );

    const kanas: BlSearchConditionGroup[] = new Array<BlSearchConditionGroup>();
    kanas.push(grp);
    apiQueryParameter.setConditionString(kanas[0].toConditionString());
    this.clear();
    return apiQueryParameter;
  }

  /**
   * テキスト出力情報の一覧を取得
   * @param exportPatternCodeList テキスト出力情報配列
   */
  public setExportPatternCodeList(exportPatternCodeList: string[]): void {
    (<ExportPatternCodeListCondition>(this.conditionMap.get(ExportPatternCodeListCondition.KEY))).setValue(exportPatternCodeList);
  }

  /**
   * ヘッダ行の設定
   * @param outPutHeaderDiv ヘッダ行
   */
  public setOutPutHeaderDiv(outPutHeaderDiv: string): void {
    (<OutPutHeaderDivCondition>(this.conditionMap.get(OutPutHeaderDivCondition.KEY))).setValue(outPutHeaderDiv)
  }

  /**
   * ユニークIdを設定
   * @param clientSessionId ユニークId
   */
  public setClientSessionId(clientSessionId: string): void {
    (<ClientSessionIdCondition>(this.conditionMap.get(ClientSessionIdCondition.KEY))).setValue(clientSessionId);
  }

  /**
   * プロダクトコード配列を設定する
   * @param productCodes プロダクトコード配列
   */
  public setProductCodes(productCodes: string): void {
    (<ProductCodeCondition>(this.conditionMap.get(ProductCodeCondition.KEY))).setValue(productCodes);
  }
}
