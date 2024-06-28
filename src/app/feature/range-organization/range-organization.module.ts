import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BlNgCommonModule } from '@blcloud/bl-ng-common';
import {
  OrganizationInformationResource,
} from '@blcloud/bl-ng-resource';
import { BlInputModule, BlSelectModule } from '@blcloud/bl-ng-ui-component';
import { RangeOrganizationComponent } from './range-organization.component';
import { RangeOrganizationService } from './range-organization.service';

/**
 * 組織 個別/範囲指定切り替えモジュール
 */
@NgModule({
  imports: [
    CommonModule,
    BlNgCommonModule,
    BlInputModule,
    BlSelectModule,
  ],
  exports: [
    RangeOrganizationComponent,
  ],
  declarations: [
    RangeOrganizationComponent,
  ],
  providers: [
    RangeOrganizationService,
    OrganizationInformationResource
  ],
})
export class RangeOrganizationModule { }
