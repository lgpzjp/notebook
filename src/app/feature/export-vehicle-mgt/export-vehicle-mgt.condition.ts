import {
  isUndefined as _isUndefined,
  isEmpty as _isEmpty,
} from 'lodash';
import {
  BlSearchCondition,
  BlConditionType,
  BlSearchConditionManager,
  BlApiQueryParams,
  BlSearchConditionGroup,
  BlSearchConditionDef,
} from '@blcloud/bl-ng-common';
import { DateTimeUtils } from '@blcloud/bl-common';
import { VehicleTargetPeriodDiv } from '@blcloud/bl-datamodel/enum/vehicle/vehicle-target-period-div';

/**
 * 車両管理出力条件
 */
class ExportVehicleMgtCondition extends BlSearchCondition {
  /** @override */
  public setValue(v: any): void {
    if (_isUndefined(v)) {
      super.clear();
    } else {
      super.setValue(v);
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
 * 項目（le ge）設定
 */
abstract class DateCondition extends BlSearchCondition {
  /** 開始日 */
  protected dateS: BlSearchCondition;

  /** 終了日 */
  protected dateE: BlSearchCondition;

  constructor(def: BlSearchConditionDef) {
    super(def);

    this.dateS = new BlSearchCondition(def);
    this.dateE = new BlSearchCondition(def);

    this.dateS.setType(BlConditionType.GreaterThanEqual);
    this.dateE.setType(BlConditionType.LessThanEqual);
  }

  /**
   * 開始日を取得する
   * @return 開始日
   */
  public getValueS(): string | number | (string | number)[] {
    return this.dateS.getValue();
  }

  /**
   * 終了日を取得する
   * @return 終了日
   */
  public getValueE(): string | number | (string | number)[] {
    return this.dateE.getValue();
  }

  /**
   * 開始日の検索条件を取得する
   * @return 開始日コンディション
   */
  public getConditionS(): BlSearchCondition {
    return this.dateS;
  }

  /**
   * 終了日の検索条件を取得する
   * @return 終了日コンディション
   */
  public getConditionE(): BlSearchCondition {
    return this.dateE;
  }

  /**
   * 検索条件を初期化する
   */
  public clear(): void {
    this.dateS.clear();
    this.dateE.clear();
  }

  /**
   * 日付設定
   * @param s 開始日
   * @param e 終了日
   */
  abstract setDate(s: string, e: string): void;
}

/**
 * 項目（eq）設定
 */
abstract class DateEqCondition extends BlSearchCondition {
  /** 項目（eq） */
  protected dateS: BlSearchCondition;

  constructor(def: BlSearchConditionDef) {
    super(def);
    this.dateS = new BlSearchCondition(def);
    this.dateS.setType(BlConditionType.Equal);
  }

  /**
   * 項目（eq）を取得する
   * @return 項目（eq）
   */
  public getValueS(): string | number | (string | number)[] {
    return this.dateS.getValue();
  }

  /**
   * 項目（eq）の検索条件を取得する
   * @return 項目（eq）コンディション
   */
  public getConditionS(): BlSearchCondition {
    return this.dateS;
  }

  /**
   * 検索条件を初期化する
   */
  public clear(): void {
    this.dateS.clear();
  }

  /**
   * 項目（eq）設定
   * @param s 項目（eq）
   */
  abstract setValue(s: string): void;
}

/**
 * 項目（ct）設定
 */
abstract class DateCtCondition extends BlSearchCondition {
  /** 項目 */
  protected dateS: BlSearchCondition;

  constructor(def: BlSearchConditionDef) {
    super(def);
    this.dateS = new BlSearchCondition(def);
    this.dateS.setType(BlConditionType.Match);
  }

  /**
   * 項目を取得する
   * @return 項目
   */
  public getValueS(): string | number | (string | number)[] {
    return this.dateS.getValue();
  }

  /**
   * 項目の検索条件を取得する
   * @return 項目コンディション
   */
  public getConditionS(): BlSearchCondition {
    return this.dateS;
  }

  /**
   * 検索条件を初期化する
   */
  public clear(): void {
    this.dateS.clear();
  }

  /**
   * 項目設定
   * @param s 項目
   */
  abstract setValue(s: string): void;
}


/**
 *  伝票日付のパラメータを管理
 */
class SlipStandardDate extends DateCondition {
  static readonly KEY = 'slipStandardDate';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: SlipStandardDate.KEY });
    }
  }

  /**
   * 日付設定
   * @param s 開始日
   * @param e 終了日
   */
  public setDate(s: string, e: string): void {
    this.dateS.setValue((_isEmpty(s) || DateTimeUtils.initial.iso8601.date === s) ? undefined : s);
    this.dateE.setValue((_isEmpty(e) || DateTimeUtils.initial.iso8601.date === e) ? undefined : e);
  }

  /**
   * 日付設定をクリア
   */
  public clearDate(): void {
    this.dateS.clear();
    this.dateE.clear();
  }
}

/**
 * 更新日付のパラメータを管理
 */
class UpdateDateTime extends DateCondition {
  static readonly KEY = 'updateDateTime';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: UpdateDateTime.KEY });
    }
  }

  /**
   * 日付設定
   * @param s 開始日
   * @param e 終了日
   */
  public setDate(s: string, e: string): void {
    this.dateS.setValue((_isEmpty(s) || DateTimeUtils.initial.iso8601.date === s) ? undefined : s);
    this.dateE.setValue((_isEmpty(e) || DateTimeUtils.initial.iso8601.date === e) ? undefined : e);
  }

  /**
   * 日付設定をクリア
   */
  public clearDate(): void {
    this.dateS.clear();
    this.dateE.clear();
  }
}

/**
 * テキスト出力パターンのコード一覧のパラメータを管理
 */
class ExportPatternCode extends ExportVehicleMgtCondition {
  static readonly KEY = 'exportPatternCodeList';
}

/**
 * プロダクトコード
 */
class ProductCodeCondition extends ExportVehicleMgtCondition {
  static readonly KEY = 'productCode';
}

/**
 * 出力内容を管理
 */
class VehicleExportContentCondition extends ExportVehicleMgtCondition {
  static readonly KEY = 'vehicleExportContent';
}

/**
 * 組織コードを管理
 */
class OrganizationCode extends ExportVehicleMgtCondition {
  static readonly KEY = 'organizationCode';
}

/**
 * clientSessionIdを管理
 */
class ClientSessionIdCondition extends ExportVehicleMgtCondition {
  static readonly KEY = 'clientSessionId';
}

/**
 * 得意先コードを管理
 */
class CustomerCode extends DateCondition {
  static readonly KEY = 'customerCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: CustomerCode.KEY });
    }
  }

  /**
   * 設定
   * @param s 開始
   * @param e 終了
   */
  public setDate(s: string, e: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
    this.dateE.setValue(_isEmpty(e) ? undefined : e);
  }
}

/**
 * 管理番号を管理
 */
class CustVcleManageGroupCode extends DateCtCondition {
  static readonly KEY = 'custVcleManageGroupCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: CustVcleManageGroupCode.KEY });
    }
  }

  /**
   * 品番設定
   * @param s 品番
   */
  public setValue(s: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
  }
}

/**
 * 型式を管理
 */
class FullModel extends DateCtCondition {
  static readonly KEY = 'fullModel';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: FullModel.KEY });
    }
  }

  /**
   * 品番設定
   * @param s 品番
   */
  public setValue(s: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
  }
}

/**
 * 車両備考を管理
 */
class VcleRemarksName extends DateCtCondition {
  static readonly KEY = 'vcleRemarksName';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: VcleRemarksName.KEY });
    }
  }

  /**
   * 品番設定
   * @param s 品番
   */
  public setValue(s: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
  }
}

/**
 * グループコードを管理
 */
class BlCdGroupCode  extends DateCondition {
  static readonly KEY = 'blCdGroupCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: BlCdGroupCode.KEY });
    }
  }

  /**
   * 設定
   * @param s 開始
   * @param e 終了
   */
  public setDate(s: string, e: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
    this.dateE.setValue(_isEmpty(e) ? undefined : e);
  }
}

/**
 * BLコードを管理
 */
class BlPrtsCd extends DateCondition {
  static readonly KEY = 'blPrtsCd';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: BlPrtsCd.KEY });
    }
  }

  /**
   * 設定
   * @param s 開始
   * @param e 終了
   */
  public setDate(s: string, e: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
    this.dateE.setValue(_isEmpty(e) ? undefined : e);
  }
}

/**
 * 品番を管理
 */
class SearchItemPartsNumber extends DateCtCondition {
  static readonly KEY = 'searchItemPartsNumber';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: SearchItemPartsNumber.KEY });
    }
  }

  /**
   * 品番設定
   * @param s 品番
   */
  public setValue(s: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
  }
}

/**
 * 品名を管理
 */
class SearchItemPartsName extends DateCtCondition {
  static readonly KEY = 'searchItemPartsName';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: SearchItemPartsName.KEY });
    }
  }

  /**
   * 品名設定
   * @param s 品名
   */
  public setValue(s: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
  }
}

/**
 * 在庫取寄を管理
 */
class VehicleStockBackorderDiv extends DateEqCondition {
  static readonly KEY = 'vehicleStockBackorderDiv';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: VehicleStockBackorderDiv.KEY });
    }
  }

  /**
   * 日付設定
   * @param s 開始日
   */
  public setValue(s: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
  }
}

/**
 * 倉庫コードを管理
 */
class WhCode extends DateCondition {
  static readonly KEY = 'whCode';

  constructor(def?: BlSearchConditionDef) {
    if (def) {
      super(def);
    } else {
      super({ key: WhCode.KEY });
    }
  }

  /**
   * 設定
   * @param s 開始
   * @param e 終了
   */
  public setDate(s: string, e: string): void {
    this.dateS.setValue(_isEmpty(s) ? undefined : s);
    this.dateE.setValue(_isEmpty(e) ? undefined : e);
  }
}

/**
 * 伝票情報出力条件を管理
 */
export class ExportVehicleMgtConditionManager extends BlSearchConditionManager {
  constructor(
  ) {
    super([
      { type: BlConditionType.In, key: ProductCodeCondition.KEY, classType: ProductCodeCondition },
      { type: BlConditionType.In, key: ExportPatternCode.KEY, classType: ExportPatternCode },
      { type: BlConditionType.Equal, key: VehicleExportContentCondition.KEY, classType: VehicleExportContentCondition },
      { key: SlipStandardDate.KEY, classType: SlipStandardDate },
      { key: UpdateDateTime.KEY, classType: UpdateDateTime },
      { type: BlConditionType.Equal, key: OrganizationCode.KEY, classType: OrganizationCode },
      { key: CustomerCode.KEY, classType: CustomerCode },
      { type: BlConditionType.Match, key: CustVcleManageGroupCode .KEY, classType: CustVcleManageGroupCode  },
      { type: BlConditionType.Match, key: FullModel.KEY, classType: FullModel },
      { type: BlConditionType.Match, key: VcleRemarksName.KEY, classType: VcleRemarksName },
      { key: BlCdGroupCode.KEY, classType: BlCdGroupCode },
      { key: BlPrtsCd.KEY, classType: BlPrtsCd },
      { type: BlConditionType.Match, key: SearchItemPartsNumber.KEY, classType: SearchItemPartsNumber },
      { type: BlConditionType.Match, key: SearchItemPartsName.KEY, classType: SearchItemPartsName },
      { type: BlConditionType.Equal, key: VehicleStockBackorderDiv.KEY, classType: VehicleStockBackorderDiv  },
      { key: WhCode.KEY, classType: WhCode },
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
      ProductCodeCondition.KEY,
      ExportPatternCode.KEY,
      VehicleExportContentCondition.KEY,
      OrganizationCode.KEY,
    );
    const slipStandardDate = <SlipStandardDate>(this.conditionMap.get(SlipStandardDate.KEY));
    if (slipStandardDate.getValueS()) {
      grp.addCondition(slipStandardDate.getConditionS());
    }
    if (slipStandardDate.getValueE()) {
      grp.addCondition(slipStandardDate.getConditionE());
    }
    const updateDateTime = <UpdateDateTime>(this.conditionMap.get(UpdateDateTime.KEY));
    if (updateDateTime.getValueS()) {
      grp.addCondition(updateDateTime.getConditionS());
    }
    if (updateDateTime.getValueE()) {
      grp.addCondition(updateDateTime.getConditionE());
    }
    const customerCode = <CustomerCode>(this.conditionMap.get(CustomerCode.KEY));
    if (customerCode.getValueS()) {
      grp.addCondition(customerCode.getConditionS());
    }
    if (customerCode.getValueE()) {
      grp.addCondition(customerCode.getConditionE());
    }
    const custVcleManageGroupCode = <CustVcleManageGroupCode>(this.conditionMap.get(CustVcleManageGroupCode.KEY));
    if (custVcleManageGroupCode.getValueS()) {
      grp.addCondition(custVcleManageGroupCode.getConditionS());
    }
    const fullModel = <FullModel>(this.conditionMap.get(FullModel.KEY));
    if (fullModel.getValueS()) {
      grp.addCondition(fullModel.getConditionS());
    }
    const vcleRemarksName = <VcleRemarksName>(this.conditionMap.get(VcleRemarksName.KEY));
    if (vcleRemarksName.getValueS()) {
      grp.addCondition(vcleRemarksName.getConditionS());
    }
    const blCdGroupCode = <BlCdGroupCode>(this.conditionMap.get(BlCdGroupCode.KEY));
    if (blCdGroupCode.getValueS()) {
      grp.addCondition(blCdGroupCode.getConditionS());
    }
    if (blCdGroupCode.getValueE()) {
      grp.addCondition(blCdGroupCode.getConditionE());
    }
    const blPrtsCd = <BlPrtsCd>(this.conditionMap.get(BlPrtsCd.KEY));
    if (blPrtsCd.getValueS()) {
      grp.addCondition(blPrtsCd.getConditionS());
    }
    if (blPrtsCd.getValueE()) {
      grp.addCondition(blPrtsCd.getConditionE());
    }
    const searchItemPartsNumber = <SearchItemPartsNumber>(this.conditionMap.get(SearchItemPartsNumber.KEY));
    if (searchItemPartsNumber.getValueS()) {
      grp.addCondition(searchItemPartsNumber.getConditionS());
    }
    const searchItemPartsName = <SearchItemPartsName>(this.conditionMap.get(SearchItemPartsName.KEY));
    if (searchItemPartsName.getValueS()) {
      grp.addCondition(searchItemPartsName.getConditionS());
    }
    const vehicleStockBackorderDiv = <VehicleStockBackorderDiv>(this.conditionMap.get(VehicleStockBackorderDiv.KEY));
    if (vehicleStockBackorderDiv.getValueS()) {
      grp.addCondition(vehicleStockBackorderDiv.getConditionS());
    }
    const whCode = <WhCode>(this.conditionMap.get(WhCode.KEY));
    if (whCode.getValueS()) {
      grp.addCondition(whCode.getConditionS());
    }
    if (whCode.getValueE()) {
      grp.addCondition(whCode.getConditionE());
    }
    grp.addCondition(this.conditionMap.get(ClientSessionIdCondition.KEY));
    const kanas: BlSearchConditionGroup[] = new Array<BlSearchConditionGroup>();
    kanas.push(grp);
    // グループ指定しながら文字列を作成する
    apiQueryParameter.setConditionString(kanas[0].toConditionString());
    return apiQueryParameter;
  }

  /**
   * テキスト出力情報の一覧を取得
   * @param v
   */
  public setExportPatternCode(v: string[]): void {
    (<ExportPatternCode>(this.conditionMap.get(ExportPatternCode.KEY))).setValue(v);
  }

 /**
 * 出力内容を設定
 * @param outputInfo
 */
  public setVehicleExportContent(v: string): void {
    (<VehicleExportContentCondition>(this.conditionMap.get(VehicleExportContentCondition.KEY))).setValue(v);
  }

  /**
  * 組織コードを設定
  * @param organizationCode
  */
  public setOrganizationCode(v: string): void {
    (<OrganizationCode>(this.conditionMap.get(OrganizationCode.KEY))).setValue(v);
  }

  /**
   * 得意先コードを設定
   * @param customerCodeStart 得意先コード開始
   * @param customerCodeEnd 得意先コード終了
   */
  public setCustomerCode(customerCodeStart: string, customerCodeEnd: string): void {
    (<CustomerCode>(this.conditionMap.get(CustomerCode.KEY))).setDate(customerCodeStart, customerCodeEnd);
}

  /**
   * 管理番号を設定
   * @param custVcleManageGroupCode
   */
  public setCustVcleManageGroupCode(v: string): void {
    (<CustVcleManageGroupCode>(this.conditionMap.get( CustVcleManageGroupCode.KEY))).setValue(v);
}

  /**
   * 型式を設定
   * @param fullModel
   */
  public setFullModel(fullModel: string): void {
    (<FullModel>(this.conditionMap.get( FullModel.KEY))).setValue(fullModel);
}

  /**
   * 車両備考を設定
   * @param vcleRemarksName
   */
  public setVcleRemarksName(vcleRemarksName: string): void {
    (<VcleRemarksName>(this.conditionMap.get( VcleRemarksName.KEY))).setValue(vcleRemarksName);
}

  /**
   * グループコードを設定
   * @param s
   * @param e
   */
  public setBlCdGroupCode(s: string, e: string): void {
      (<BlCdGroupCode>(this.conditionMap.get(BlCdGroupCode.KEY))).setDate(s, e);
  }

  /**
   * BLコードを設定
   * @param blPrtsCdStart BLコード開始
   * @param blPrtsCdEnd BLコード終了
   */
  public setBlPrtsCd(blPrtsCdStart: string, blPrtsCdEnd: string): void {
    if (blPrtsCdStart === '0' && blPrtsCdEnd === '0') {
      (<BlPrtsCd>(this.conditionMap.get(BlPrtsCd.KEY))).setDate(null, null);
    } else if (blPrtsCdEnd === '0') {
      (<BlPrtsCd>(this.conditionMap.get(BlPrtsCd.KEY))).setDate(blPrtsCdStart, null);
    } else if (blPrtsCdStart === '0') {
      (<BlPrtsCd>(this.conditionMap.get(BlPrtsCd.KEY))).setDate(null, blPrtsCdEnd);
    } else {
      (<BlPrtsCd>(this.conditionMap.get(BlPrtsCd.KEY))).setDate(blPrtsCdStart, blPrtsCdEnd);
    }
  }

    /**
   * 品番を設定
   * @param v
   */
  public setPartsNumber(v: string): void {
    (<SearchItemPartsNumber>(this.conditionMap.get( SearchItemPartsNumber.KEY))).setValue(v);
  }

  /**
   * 品名を設定
   * @param partsName
   */
  public setPartsName(partsName: string): void {
    (<SearchItemPartsName>(this.conditionMap.get(SearchItemPartsName.KEY))).setValue(partsName);
  }

  /**
   * 在庫取寄区を設定
   * @param vehicleStockBackorderDiv
   */
  public setVehicleStockBackorderDiv(vehicleStockBackorderDiv: string): void {
    (<VehicleStockBackorderDiv>(this.conditionMap.get(VehicleStockBackorderDiv.KEY))).setValue(vehicleStockBackorderDiv);
  }

  /**
   * 倉庫コードを設定
   * @param whCodeStart 倉庫コード開始
   * @param whCodeEnd 倉庫コード開始
   */
  public setWhCode(whCodeStart: string, whCodeEnd: string): void {
    (<WhCode>(this.conditionMap.get(WhCode.KEY))).setDate(whCodeStart, whCodeEnd);
  }

  /**
   * 日付の設定
   * @param startDate 開始日
   * @param endDate 終了日
   * @param targetPeriod 対象期間
   */
  public setDate(startDate: string, endDate: string, targetPeriod: string): void {
    if (targetPeriod === VehicleTargetPeriodDiv.UpdateDate) {
      (<UpdateDateTime>(this.conditionMap.get(UpdateDateTime.KEY))).setDate(startDate, endDate);
      (<SlipStandardDate>(this.conditionMap.get(SlipStandardDate.KEY))).clearDate();
    } else if (targetPeriod === VehicleTargetPeriodDiv.SlipDate) {
      (<SlipStandardDate>(this.conditionMap.get(SlipStandardDate.KEY))).setDate(startDate, endDate);
      (<UpdateDateTime>(this.conditionMap.get(UpdateDateTime.KEY))).clearDate();
    }
  }

  /**
   * プロダクトコード配列を設定する
   * @param productCodes プロダクトコード配列
   */
  public setProductCodes(productCodes: string[]): void {
    (<ProductCodeCondition>(this.conditionMap.get(ProductCodeCondition.KEY))).setValue(productCodes);
  }

  /**
   * ユニークIdを設定
   * @param a
   */
  public setClientSessionId(a: string): void {
    (<ClientSessionIdCondition>(this.conditionMap.get(ClientSessionIdCondition.KEY))).setValue(a);
  }
}
