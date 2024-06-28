import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlNgCommonModule } from '@blcloud/bl-ng-common';
import { BlNgUiComponentModule } from '@blcloud/bl-ng-ui-component';
import {
  EmployeeResource,
  VehicleMgtSettingResource,
  VehicleMaintFeeRankRefResource,
  DmExtractMenuResource,
  TicketSettingResource
} from '@blcloud/bl-ng-resource';
import {
  OrganizationInformationResourceService,
  TransportBranchNameSettingResourceService,
  DivisionResourceService
} from '@blcloud/bl-ng-share-module';
import { ExportConditionModalComponent } from './export-condition/export-condition-modal.component';

/**
 * データ出力履歴モーダルモジュール
 */
@NgModule({
  imports: [
    CommonModule,
    BlNgCommonModule,
    BlNgUiComponentModule,
  ],
  exports: [
    ExportConditionModalComponent
  ],
  declarations: [
    ExportConditionModalComponent
  ],
  entryComponents: [
    ExportConditionModalComponent
  ],
})
export class ExportHistoryModalModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ExportHistoryModalModule,
      providers: [
        EmployeeResource,
        VehicleMgtSettingResource,
        VehicleMaintFeeRankRefResource,
        OrganizationInformationResourceService,
        TransportBranchNameSettingResourceService,
        DivisionResourceService,
        DmExtractMenuResource,
        TicketSettingResource,
      ]
    };
  }
}
