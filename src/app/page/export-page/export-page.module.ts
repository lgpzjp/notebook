import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BlNgUiComponentModule,
} from '@blcloud/bl-ng-ui-component';
import {
  BlNgShareCommonModule,
  OrganizationComboBoxModule,
  OrganizationGuideModule
} from '@blcloud/bl-ng-share-module';
import { ExportPageRoutingModule } from './export-page-routing.module';
import { RangeOrganizationModule } from './../../feature/range-organization/range-organization.module';
import { ExportPageComponent } from './export-page.component';
import { ExportCustomerVehicleComponent } from './../../feature/export-customer-vehicle/export-customer-vehicle.component';
import { ExportSlipComponent } from './../../feature/export-slip/export-slip.component';
import { ExportCustomerVehicleService } from './../../feature/export-customer-vehicle/export-customer-vehicle.service';
import { ExportSlipService } from './../../feature/export-slip/export-slip.service';
import { ExportHistoryComponent } from './../../feature/export-history/export-history.component';
import { ExportHistoryService } from './../../feature/export-history/export-history.service';
import { ExportPageService } from './export-page.service';
import { ExportPatternInfoResource } from '@blcloud/bl-ng-resource';
import { ExportConditionInfoResource } from '@blcloud/bl-ng-resource';
import { GenericExportInstructionResource } from '@blcloud/bl-ng-resource';
import { StockMgtSettingResource } from '@blcloud/bl-ng-resource';
import { OperationHistoryLogResource } from '@blcloud/bl-ng-resource';
import { DownloadModalComponent } from '../../shared/modal/download-modal/download-modal.component';
import { DetailCustomerConditionComponent } from './components/detail-customer-condition/detail-customer-condition.component';
import { DatePickerConditionComponent } from './components/date-picker-condition/date-picker-condition.component';
import { ExportPatternSelectorComponent } from './components/export-pattern-selector/export-pattern-selector.component';
import { DetailSlipConditionComponent } from './components/detail-slip-condition/detail-slip-condition.component';
import { ExportSalesSlipComponent } from './../../feature/export-sales-slip/export-sales-slip.component';
import { ExportSalesSlipService } from './../../feature/export-sales-slip/export-sales-slip.service';
import { ExportGlassSalesSlipComponent } from './../../feature/export-glass-sales-slip/export-glass-sales-slip.component';
import { ExportGlassSalesSlipService } from './../../feature/export-glass-sales-slip/export-glass-sales-slip.service';
import { ExportGlassDepositComponent } from './../../feature/export-glass-deposit/export-glass-deposit.component';
import { ExportGlassDepositService } from './../../feature/export-glass-deposit/export-glass-deposit.service';
import { ExportGlassCustomerComponent } from './../../feature/export-glass-customer/export-glass-customer.component';
import { ExportGlassCustomerService } from './../../feature/export-glass-customer/export-glass-customer.service';
import { DetailSalesSlipConditionComponent } from './components/detail-sales-slip-condition/detail-sales-slip-condition.component';
import {
  DetailGlassSalesSlipConditionComponent
} from './components/detail-glass-sales-slip-condition/detail-glass-sales-slip-condition.component';
import {
  DetailGlassDepositConditionComponent
} from './components/detail-glass-deposit-condition/detail-glass-deposit-condition.component';
import {
  DetailGlassCustomerConditionComponent
} from './components/detail-glass-customer-condition/detail-glass-customer-condition.component';
import { ExportCreditComponent } from './../../feature/export-credit/export-credit.component';
import { ExportCreditService } from './../../feature/export-credit/export-credit.service';
import { DetailCreditConditionComponent } from './components/detail-credit-condition/detail-credit-condition.component';
import { ExportPurchaseSlipComponent } from '../../feature/export-purchase-slip/export-purchase-slip.component';
import { ExportPurchaseSlipService } from '../../feature/export-purchase-slip/export-purchase-slip.service';
import {
  DetailPurchaseSlipConditionComponent
} from './components/detail-purchase-slip-condition/detail-purchase-slip-condition.component';
import { ExportDebtComponent } from './../../feature/export-debt/export-debt.component';
import { ExportDebtService } from './../../feature/export-debt/export-debt.service';
import { DetailDebtConditionComponent } from './components/detail-debt-condition/detail-debt-condition.component';
import { ExportStockComponent } from './../../feature/export-stock/export-stock.component';
import { ExportStockService } from './../../feature/export-stock/export-stock.service';
import { DetailStockConditionComponent } from './components/detail-stock-condition/detail-stock-condition.component';
import { ExportStockMoveSlipComponent } from '../../feature/export-stock-move-slip/export-stock-move-slip.component';
import { ExportStockMoveSlipService } from '../../feature/export-stock-move-slip/export-stock-move-slip.service';
import {
  DetailStockMoveSlipConditionComponent
} from './components/detail-stock-move-slip-condition/detail-stock-move-slip-condition.component';
import { ExportCustomerSlipComponent } from '../../feature/export-customer-slip/export-customer-slip.component';
import { ExportCustomerSlipService } from '../../feature/export-customer-slip/export-customer-slip.service';
import {
  DetailCustomerSlipConditionComponent
} from './components/detail-customer-slip-condition/detail-customer-slip-condition.component';
import { ExportRecycleCustomerComponent } from '../../feature/export-recycle-customer/export-recycle-customer.component';
import { ExportRecycleCustomerService } from '../../feature/export-recycle-customer/export-recycle-customer.service';
import {
  DetailRecycleCustomerConditionComponent
} from './components/detail-recycle-customer-condition/detail-recycle-customer-condition.component';
import { ExportVehicleMgtComponent } from '../../feature/export-vehicle-mgt/export-vehicle-mgt.component';
import { ExportVehicleMgtService } from '../../feature/export-vehicle-mgt/export-vehicle-mgt.service';
import { DetailVehicleMgtConditionComponent } from './components/detail-vehicle-mgt-condition/detail-vehicle-mgt-condition.component';
import { ExportGlassSettingInfoComponent } from '../../feature/export-glass-setting-info/export-glass-setting-info.component';
import { ExportGlassSettingInfoService } from '../../feature/export-glass-setting-info/export-glass-setting-info.service';

@NgModule({
  imports: [
    CommonModule,
    BlNgUiComponentModule,
    BlNgShareCommonModule,
    OrganizationComboBoxModule.forRoot(),
    OrganizationGuideModule.forRoot(),
    ExportPageRoutingModule,
    RangeOrganizationModule,
  ],
  declarations: [
    ExportPageComponent,
    ExportCustomerVehicleComponent,
    ExportSlipComponent,
    ExportHistoryComponent,
    ExportSalesSlipComponent,
    ExportGlassSalesSlipComponent,
    ExportGlassDepositComponent,
    ExportGlassCustomerComponent,
    ExportCreditComponent,
    ExportPurchaseSlipComponent,
    ExportDebtComponent,
    ExportStockMoveSlipComponent,
    ExportCustomerSlipComponent,
    ExportVehicleMgtComponent,
    ExportStockComponent,
    DownloadModalComponent,
    DetailCustomerConditionComponent,
    DatePickerConditionComponent,
    ExportPatternSelectorComponent,
    DetailSlipConditionComponent,
    DetailSalesSlipConditionComponent,
    DetailGlassSalesSlipConditionComponent,
    DetailGlassDepositConditionComponent,
    DetailGlassCustomerConditionComponent,
    DetailCreditConditionComponent,
    DetailPurchaseSlipConditionComponent,
    DetailDebtConditionComponent,
    DetailStockConditionComponent,
    DetailStockMoveSlipConditionComponent,
    DetailCustomerSlipConditionComponent,
    DetailVehicleMgtConditionComponent,
    ExportRecycleCustomerComponent,
    DetailRecycleCustomerConditionComponent,
    ExportGlassSettingInfoComponent,
  ],
  entryComponents: [
    DownloadModalComponent,
    DetailCustomerConditionComponent,
    DatePickerConditionComponent,
    ExportPatternSelectorComponent,
    DetailSlipConditionComponent,
    DetailSalesSlipConditionComponent,
    DetailGlassSalesSlipConditionComponent,
    DetailGlassDepositConditionComponent,
    DetailGlassCustomerConditionComponent,
    DetailCreditConditionComponent,
    DetailPurchaseSlipConditionComponent,
    DetailDebtConditionComponent,
    DetailStockConditionComponent,
    DetailStockMoveSlipConditionComponent,
    DetailCustomerSlipConditionComponent,
    DetailVehicleMgtConditionComponent,
    DetailRecycleCustomerConditionComponent,
  ],
  providers: [
    ExportCustomerVehicleService,
    ExportSlipService,
    ExportHistoryService,
    ExportSalesSlipService,
    ExportGlassSalesSlipService,
    ExportGlassDepositService,
    ExportGlassCustomerService,
    ExportCreditService,
    ExportPurchaseSlipService,
    ExportDebtService,
    ExportStockMoveSlipService,
    ExportCustomerSlipService,
    ExportVehicleMgtService,
    ExportStockService,
    ExportPageService,
    ExportPatternInfoResource,
    ExportConditionInfoResource,
    StockMgtSettingResource,
    OperationHistoryLogResource,
    ExportRecycleCustomerService,
    ExportGlassSettingInfoService,
    GenericExportInstructionResource,
  ]
})
export class ExportPageModule {
}
