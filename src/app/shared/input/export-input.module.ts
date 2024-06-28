import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlInputModule, BlNgUiComponentModule, BlSelectModule } from '@blcloud/bl-ng-ui-component';
import { ExportDateRangeComponent } from './date-range/export-date-range.component';
import { ExportTextRangeComponent } from './text-range/export-text-range.component';
import { ExportTextGuideRangeComponent } from './text-guide-range/export-text-guide-range.component';
import { RangeOrganizationComponent } from './range-organization/range-organization.component';
import { RangeOrganizationService } from './range-organization/range-organization.service';
import { OrganizationInformationResource } from '@blcloud/bl-ng-resource';
import { BlNgCommonModule } from '@blcloud/bl-ng-common';

@NgModule({
  imports: [
    CommonModule,
    BlNgUiComponentModule,
    BlNgCommonModule,
    BlInputModule,
    BlSelectModule,
  ],
  declarations: [
    ExportDateRangeComponent,
    ExportTextRangeComponent,
    ExportTextGuideRangeComponent,
    RangeOrganizationComponent
  ],
  exports: [
    ExportDateRangeComponent,
    ExportTextRangeComponent,
    ExportTextGuideRangeComponent,
    RangeOrganizationComponent
  ],
  providers: [
    RangeOrganizationService,
    OrganizationInformationResource
  ],
})
export class ExportInputInputModule { }
