import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlFormModule, BlModalModule, BlNgUiComponentModule } from '@blcloud/bl-ng-ui-component';
import { GenericPrintModule, GenericPrintService } from '@blcloud/bl-ng-share-module';
 import { AccountGenericSettingSubIDResource } from '@blcloud/bl-ng-resource';

import { ExportReportPrintModalComponent } from './export-report-print-modal/export-report-print-modal.component';
import { ExportReportPrintModalService } from './export-report-print-modal/export-report-print-modal.service';
import { ReportConditionSettingModalComponent } from './report-condition-setting-modal/report-condition-setting-modal.component';
import {
  ReportConditionSettingDetailModalComponent
} from './report-condition-setting-detail-modal/report-condition-setting-detail-modal.component';
import { FavoriteConditionService } from '../service/favorite-condition.service';
import {
  DispOrderSettingComponent
} from './disp-order-setting/disp-order-setting.component';

@NgModule({
  imports: [
    CommonModule,
    GenericPrintModule,
    BlFormModule,
    BlModalModule,
    BlNgUiComponentModule,
  ],
  exports: [
    ExportReportPrintModalComponent,
    ReportConditionSettingModalComponent,
    ReportConditionSettingDetailModalComponent,
    DispOrderSettingComponent,
  ],
  declarations: [
    ExportReportPrintModalComponent,
    ReportConditionSettingModalComponent,
    ReportConditionSettingDetailModalComponent,
    DispOrderSettingComponent,
  ],
  entryComponents: [
    ExportReportPrintModalComponent,
    ReportConditionSettingModalComponent,
    ReportConditionSettingDetailModalComponent,
    DispOrderSettingComponent,
  ],
  providers: [
    AccountGenericSettingSubIDResource,
    GenericPrintService,
    ExportReportPrintModalService,
    FavoriteConditionService,
  ],
})
export class ExportReportModalModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ExportReportModalModule,
      providers: [
        GenericPrintModule.forRoot().providers
      ]
    };
  }
}
