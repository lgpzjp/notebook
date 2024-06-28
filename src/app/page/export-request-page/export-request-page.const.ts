import { ContractConst } from '@blcloud/bl-datamodel/const/contract';
import { IExportGroupItem, IExportMenuItem } from './export-request-page.interface';
import { ExportCustomerVehiclePanelComponent } from './panel/customer-vehicle/export-customer-vehicle-panel.component';
import { ExportSfSalesSlipPanelComponent } from './panel/sf-sales-slip/export-sf-sales-slip-panel.component';
import { ExportPmSalesSlipPanelComponent } from './panel/pm-sales-slip/export-pm-sales-slip-panel.component';
import { ExportGlassCustomerPanelComponent } from './panel/glass-customer/export-glass-customer-panel.component';
import { ExportGlassSettingInfoPanelComponent } from './panel/glass-setting-info/export-glass-setting-info-panel.component';
import { ExportGlassSalesSlipPanelComponent } from './panel/glass-sales-slip/export-glass-sales-slip-panel.component';
import { ExportGlassDepositPanelComponent } from './panel/glass-deposit/export-glass-deposit-panel.component';
import { ExportGlassPaymentPanelComponent } from './panel/glass-payment/export-glass-payment-panel.component';
import { ExportGlassPurchaseSlipPanelComponent } from './panel/glass-purchase-slip/export-glass-purchase-slip-panel.component';

/** 出力グループID定義 */
export const ExportGroupId = {
  Maintenance: '1',
  Partsman: '2',
  Glass: '3',
};

/** 出力グループ項目定義 */
export const ExportGroupItems: IExportGroupItem[] = [
  {
    id: ExportGroupId.Maintenance,
    label: '整備',
  },
  {
    id: ExportGroupId.Partsman,
    label: '部品商',
  },
  {
    id: ExportGroupId.Glass,
    label: '硝子商',
  },
];

/** 出力メニューID定義 */
export const ExportMenuId = {
  CustomerVehicle: '1',
  SfSalesSlip: '2',
  PmSalesSlip: '3',
  GlassSalesSlip: '4',
  GlassDeposit: '5',
  GlassCustomer: '6',
  GlassSettingInfo: '7',
  GlassPurchaseSlip: '8',
  GlassPayment: '9',
};

/** 出力メニュー項目定義 */
export const ExportMenuItems: IExportMenuItem[] = [
  {
    id: ExportMenuId.CustomerVehicle,
    label: '顧客車両',
    exportGroupId: ExportGroupId.Maintenance,
    path: ExportMenuId.CustomerVehicle,
    component: ExportCustomerVehiclePanelComponent,
    requiredServiceIds: [ContractConst.SERVICEID_OPT_MAINTENANCE_BASE],
  },
  {
    id: ExportMenuId.SfSalesSlip,
    label: '売上伝票',
    exportGroupId: ExportGroupId.Maintenance,
    path: ExportMenuId.SfSalesSlip,
    component: ExportSfSalesSlipPanelComponent,
    requiredServiceIds: [ContractConst.SERVICEID_OPT_MAINTENANCE_BASE],
  },
  {
    id: ExportMenuId.PmSalesSlip,
    label: '売上伝票',
    exportGroupId: ExportGroupId.Partsman,
    path: ExportMenuId.PmSalesSlip,
    component: ExportPmSalesSlipPanelComponent,
    requiredServiceIds: [ContractConst.SERVICEID_OPT_PMC_PMSALESDATA_OUTPUT],
  },
  {
    id: ExportMenuId.GlassSalesSlip,
    label: '売上伝票情報',
    exportGroupId: ExportGroupId.Glass,
    path: ExportMenuId.GlassSalesSlip,
    component: ExportGlassSalesSlipPanelComponent,
    requiredServiceIds: [ContractConst.SERVICEID_OPT_GLASS_BASE],
  },
  {
    id: ExportMenuId.GlassDeposit,
    label: '入金情報',
    exportGroupId: ExportGroupId.Glass,
    path: ExportMenuId.GlassDeposit,
    component: ExportGlassDepositPanelComponent,
    requiredServiceIds: [ContractConst.SERVICEID_OPT_GLASS_BASE],
  },
    {
    id: ExportMenuId.GlassCustomer,
    label: '取引先情報',
    exportGroupId: ExportGroupId.Glass,
    path: ExportMenuId.GlassCustomer,
    component: ExportGlassCustomerPanelComponent,
    requiredServiceIds: [ContractConst.SERVICEID_OPT_GLASS_BASE],
  },
  {
    id: ExportMenuId.GlassSettingInfo,
    label: '設定情報',
    exportGroupId: ExportGroupId.Glass,
    path: ExportMenuId.GlassSettingInfo,
    component: ExportGlassSettingInfoPanelComponent,
    requiredServiceIds: [ContractConst.SERVICEID_OPT_GLASS_BASE],
  },
  {
    id: ExportMenuId.GlassPurchaseSlip,
    label: '仕入伝票情報',
    exportGroupId: ExportGroupId.Glass,
    path: ExportMenuId.GlassPurchaseSlip,
    component: ExportGlassPurchaseSlipPanelComponent,
    requiredServiceIds: [ContractConst.SERVICEID_OPT_GLASS_BASE],
  },
  {
    id: ExportMenuId.GlassPayment,
    label: '出金情報',
    exportGroupId: ExportGroupId.Glass,
    path: ExportMenuId.GlassPayment,
    component: ExportGlassPaymentPanelComponent,
    requiredServiceIds: [ContractConst.SERVICEID_OPT_GLASS_BASE],
  }
];
