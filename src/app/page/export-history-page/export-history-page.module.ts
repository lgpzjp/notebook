import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';

import { GenericDataExportInfoResource, OperationHistoryLogResource, OpeHistoryResource } from '@blcloud/bl-ng-resource';
import { BlNgCommonModule } from '@blcloud/bl-ng-common';
import { BlNgUiComponentModule, ButtonCellRendererComponent, TooltipCellComponent } from '@blcloud/bl-ng-ui-component';
import {
  BlNgShareCommonModule, SearchConditionPanelModule, OrganizationComboBoxModule, OrganizationInformationResourceService,
  AutoUpdateModule, LoginResourceService
} from '@blcloud/bl-ng-share-module';

import { ExportHistoryPageRoutingModule } from './export-history-page-routing.module';
import { ExportHistoryPageComponent } from './export-history-page.component';
import { ExportHistoryPageService } from './export-history-page.service';
import { ExportHistoryModalModule } from './modal/export-history-modal.module';
import { ExportInputInputModule } from '../../shared/input/export-input.module';

@NgModule({
  imports: [
    CommonModule,
    BlNgCommonModule,
    BlNgUiComponentModule,
    BlNgShareCommonModule,
    ExportInputInputModule,
    SearchConditionPanelModule,
    OrganizationComboBoxModule.forRoot(),
    AutoUpdateModule.forRoot(),
    ExportHistoryPageRoutingModule,
    ExportHistoryModalModule,
    AgGridModule.withComponents([
      ButtonCellRendererComponent,
      TooltipCellComponent
    ]),
  ],
  declarations: [
    ExportHistoryPageComponent,
  ],
  providers: [
    ExportHistoryPageService,
    GenericDataExportInfoResource,
    OperationHistoryLogResource,
    OpeHistoryResource,
    OrganizationInformationResourceService,
    LoginResourceService
  ],
})
export class ExportHistoryPageModule {
}
