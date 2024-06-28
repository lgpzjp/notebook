import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap';

import { BlNgCommonModule } from '@blcloud/bl-ng-common';
import { BlNgUiComponentModule } from '@blcloud/bl-ng-ui-component';
import {
  GenericExportInstructionResource,
  OperationHistoryLogResource,
  OpeHistoryResource,
  CodeDivNameMgtBodyResource,
  EmployeeResource
} from '@blcloud/bl-ng-resource';
import { BlNgShareCommonModule, LoginResourceService, OrganizationComboBoxModule } from '@blcloud/bl-ng-share-module';

import { ExportRequestPageRoutingModule } from './export-request-page-routing.module';
import { ExportRequestPageComponent } from './export-request-page.component';
import { ExportRequestPageService } from './export-request-page.service';
import { ExportPanelContainerComponent } from './container/export-panel-container.component';
import { ExportPanelContainerService } from './container/export-panel-container.service';
import { ExportRequestModalModule } from './modal/export-request-modal.module';
import { ExportInputInputModule } from '../../shared/input/export-input.module';
import { ExportCustomerVehiclePanelComponent } from './panel/customer-vehicle/export-customer-vehicle-panel.component';
import { ExportSfSalesSlipPanelComponent } from './panel/sf-sales-slip/export-sf-sales-slip-panel.component';
import { ExportPmSalesSlipPanelComponent } from './panel/pm-sales-slip/export-pm-sales-slip-panel.component';
import { ExportGlassCustomerPanelComponent } from './panel/glass-customer/export-glass-customer-panel.component';
import { RangeOrganizationService } from '../../shared/input/range-organization/range-organization.service';
import { ExportGlassSettingInfoPanelComponent } from './panel/glass-setting-info/export-glass-setting-info-panel.component';
import { ExportGlassSalesSlipPanelComponent } from './panel/glass-sales-slip/export-glass-sales-slip-panel.component';
import { ExportGlassDepositPanelComponent } from './panel/glass-deposit/export-glass-deposit-panel.component';
import { ExportGlassPurchaseSlipPanelComponent } from './panel/glass-purchase-slip/export-glass-purchase-slip-panel.component';
import { ExportGlassPaymentPanelComponent } from './panel/glass-payment/export-glass-payment-panel.component';
import { ExportGlassSalesSlipPanelService } from './panel/glass-sales-slip/export-glass-sales-slip-panel.service';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule.forRoot(),
    BlNgCommonModule,
    BlNgUiComponentModule,
    BlNgShareCommonModule,
    ExportRequestPageRoutingModule,
    ExportInputInputModule,
    ExportRequestModalModule,
    OrganizationComboBoxModule.forRoot(),
  ],
  declarations: [
    ExportRequestPageComponent,
    ExportPanelContainerComponent,
    ExportCustomerVehiclePanelComponent,
    ExportSfSalesSlipPanelComponent,
    ExportPmSalesSlipPanelComponent,
    ExportGlassCustomerPanelComponent,
    ExportGlassSettingInfoPanelComponent,
    ExportGlassSalesSlipPanelComponent,
    ExportGlassDepositPanelComponent,
    ExportGlassPurchaseSlipPanelComponent,
    ExportGlassPaymentPanelComponent
  ],
  providers: [
    ExportRequestPageService,
    ExportPanelContainerService,
    ExportGlassSalesSlipPanelService,
    CodeDivNameMgtBodyResource,
    EmployeeResource,
    GenericExportInstructionResource,
    OperationHistoryLogResource,
    OpeHistoryResource,
    LoginResourceService,
    RangeOrganizationService
  ],
})
export class ExportRequestPageModule {
}
