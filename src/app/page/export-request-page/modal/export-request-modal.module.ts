import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlNgCommonModule } from '@blcloud/bl-ng-common';
import { BlNgUiComponentModule } from '@blcloud/bl-ng-ui-component';
import { ExportRequestConfirmComponent } from './export-request-confirm/export-request-confirm.component';

/**
 * データ出力モーダルモジュール
 */
@NgModule({
  imports: [
    CommonModule,
    BlNgCommonModule,
    BlNgUiComponentModule,
  ],
  exports: [
    ExportRequestConfirmComponent
  ],
  declarations: [
    ExportRequestConfirmComponent
  ],
  entryComponents: [
    ExportRequestConfirmComponent
  ],
})
export class ExportRequestModalModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ExportRequestModalModule,
      providers: [
      ]
    };
  }
}
