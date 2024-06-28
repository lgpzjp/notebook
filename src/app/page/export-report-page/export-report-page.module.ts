import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { BlNgCommonModule } from '@blcloud/bl-ng-common';
import { BlNgUiComponentModule } from '@blcloud/bl-ng-ui-component';
import { OperationHistoryLogResource, OpeHistoryResource, MaintePackNameResource } from '@blcloud/bl-ng-resource';
import { BlNgShareCommonModule, LoginResourceService, OrganizationComboBoxModule, GenericPrintModule } from '@blcloud/bl-ng-share-module';

import { ExportReportPageRoutingModule } from './export-report-page-routing.module';
import { ExportReportPageComponent } from './export-report-page.component';
import { ExportReportPageService } from './export-report-page.service';
import { ExportReportPanelContainerComponent } from './container/export-report-panel-container.component';
import { ExportReportPanelContainerService } from './container/export-report-panel-container.service';
import { ExportReportModalModule } from './modal/export-report-modal.module';
import { MaintePackContractListPanelComponent } from './panel/mainte-pack-contract-list/mainte-pack-contract-list-panel.component';
import {
  MaintePackCancelContractListPanelComponent
} from './panel/mainte-pack-cancel-contract-list/mainte-pack-cancel-contract-list-panel.component';

import { MaintePackPanelPartsComponent } from './panel-parts/mainte-pack-panel-parts/mainte-pack-panel-parts.component';
import { CustomerPanelPartsComponent } from './panel-parts/customer-panel-parts/customer-panel-parts.component';
import { FavoriteConditionService } from './service/favorite-condition.service';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule.forRoot(),
    BlNgCommonModule,
    BlNgUiComponentModule,
    BlNgShareCommonModule,
    ExportReportPageRoutingModule,
    ExportReportModalModule,
    OrganizationComboBoxModule.forRoot(),
    PdfViewerModule,
    GenericPrintModule,
  ],
  declarations: [
    ExportReportPageComponent,
    ExportReportPanelContainerComponent,
    MaintePackContractListPanelComponent,
    MaintePackCancelContractListPanelComponent,
    MaintePackPanelPartsComponent,
    CustomerPanelPartsComponent,
  ],
  providers: [
    ExportReportPageService,
    ExportReportPanelContainerService,
    FavoriteConditionService,
    OperationHistoryLogResource,
    OpeHistoryResource,
    LoginResourceService,
    MaintePackNameResource,
  ],
})
export class ExportReportPageModule {}
