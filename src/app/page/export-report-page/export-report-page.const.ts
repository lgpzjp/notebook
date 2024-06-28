import { ContractConst } from '@blcloud/bl-datamodel/const/contract';
import { IExportGroupItem, IExportMenuItem } from './export-report-page.interface';
import { MaintePackContractListPanelComponent } from './panel/mainte-pack-contract-list/mainte-pack-contract-list-panel.component';
import {
  MaintePackCancelContractListPanelComponent
} from './panel/mainte-pack-cancel-contract-list/mainte-pack-cancel-contract-list-panel.component';

/** 出力グループID定義 */
export const ExportGroupId = {
  MaintenancePack: 'maintenancepack',
};

/** 出力グループ項目定義 */
export const ExportGroupItems: IExportGroupItem[] = [
  {
    id: ExportGroupId.MaintenancePack,
    label: 'メンテナンスパック',
  },
];

/** 出力メニューID定義 */
export const ExportMenuId = {
  Contract: 'contract',
  CancelContract: 'cancelcontract',
};

/** 出力メニュー項目定義 */
export const ExportMenuItems: IExportMenuItem[] = [
  {
    id: ExportMenuId.Contract,
    label: '契約一覧',
    exportGroupId: ExportGroupId.MaintenancePack,
    path: ExportMenuId.Contract,
    component: MaintePackContractListPanelComponent,
    requiredServiceIds: [ContractConst.SERVICEID_OPT_MAINTENANCE_BASE],
  },
  {
    id: ExportMenuId.CancelContract,
    label: '解約一覧',
    exportGroupId: ExportGroupId.MaintenancePack,
    path: ExportMenuId.CancelContract,
    component: MaintePackCancelContractListPanelComponent,
    requiredServiceIds: [ContractConst.SERVICEID_OPT_MAINTENANCE_BASE],
  },
];
