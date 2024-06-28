import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NgModuleFactoryLoader } from '@angular/core';
import { BlNgCommonModule, BlAppContext, BlNgModuleLoader } from '@blcloud/bl-ng-common';
import { BlNgUiComponentModule, BlCurrencyPipe } from '@blcloud/bl-ng-ui-component';
import {
  BlCodeGuideModule,
  BlGroupCodeGuideModule,
  BlNgShareCommonModule,
  ExportPatternModalModule,
  ItemMakerNameGuideModule,
  ItemMiddleClassGuideModule,
  WarehouseGuideModule
} from '@blcloud/bl-ng-share-module';
import { CustomerGuideModule, SupplierGuideModule } from '@blcloud/bl-ng-vehicle-customer-module';
import { environment } from '../environments/environment';
import { config } from '../configs/config';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExportPageModule } from './page/export-page/export-page.module';
import { SnotifyModule } from 'ng-snotify';
import { ExportRequestModalModule } from './page/export-request-page/modal/export-request-modal.module';
import { ExportHistoryModalModule } from './page/export-history-page/modal/export-history-modal.module';
import { ExportReportModalModule } from './page/export-report-page/modal/export-report-modal.module';

/**
 * アプリケーションモジュール
 */
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SnotifyModule.forRoot(),
    BlNgCommonModule.forRoot(),
    BlNgUiComponentModule.forRoot(),
    BlNgShareCommonModule.forRoot(),
    AppRoutingModule,
    ExportPageModule,
    ExportHistoryModalModule.forRoot(),
    ExportRequestModalModule.forRoot(),
    ExportPatternModalModule.forRoot(),
    ExportReportModalModule.forRoot(),
    CustomerGuideModule.forRoot(),
    ItemMakerNameGuideModule.forRoot(),
    ItemMiddleClassGuideModule.forRoot(),
    BlGroupCodeGuideModule.forRoot(),
    BlCodeGuideModule.forRoot(),
    SupplierGuideModule.forRoot(),
    WarehouseGuideModule.forRoot(),
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    Title,
    { provide: NgModuleFactoryLoader, useClass: BlNgModuleLoader },
    BlCurrencyPipe,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  /**
   * コンストラクタ
   * @param context コンテキスト
   */
  constructor(context: BlAppContext) {
    // 設定を保持
    context.environment = environment;
    context.config = config;
  }
}
