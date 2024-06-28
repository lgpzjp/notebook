import { BlTextInputComponent } from '@blcloud/bl-ng-ui-component';

/** 組織情報のinterface */
export interface IselectObject {
  selectType: number;
  focus: BlTextInputComponent;
  organizationCodeFrom: string;
  organizationCodeTo: string;
  organizationList: string[];
  allOrganizationCode: string[];
}

/** selectboxの値 */
export enum SelectTypeEnum {
  RANGE,
  INDIVIDUAL,
  ALL_ORGANAIZATION
}

export const selectTypeArray = [
  { code: SelectTypeEnum.RANGE, name: '範囲指定' },
  { code: SelectTypeEnum.INDIVIDUAL, name: '個別指定' },
  { code: SelectTypeEnum.ALL_ORGANAIZATION, name: '全組織' }
];
