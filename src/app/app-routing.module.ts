import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContractConst } from '@blcloud/bl-datamodel/const/contract';
import { BlErrorGuard, BlAuthGuard } from '@blcloud/bl-ng-common';
import { ErrorComponent, ErrorDeactivateGuard, ServiceGuard, ContractGuard } from '@blcloud/bl-ng-share-module';

import { ExportPageComponent } from './page/export-page/export-page.component';

/** ルーティング */
const routes: Routes = [
  { path: 'error', component: ErrorComponent, canActivate: [BlErrorGuard], canDeactivate: [ErrorDeactivateGuard] },  // 共通エラー画面

  /**
   * 画面遷移(URL)の定義を追加する。START
   */
  {
    path: 'output',
    component: ExportPageComponent,
    canActivate: [BlAuthGuard, ContractGuard, ServiceGuard],
    data: {
      serviceId: [ContractConst.SERVICEID_OPT_CMN_GENERIC_DATA_OUTPUT]
    }
  },
  {
    path: 'request',
    loadChildren: './page/export-request-page/export-request-page.module#ExportRequestPageModule',
    canLoad: [BlAuthGuard, ContractGuard, ServiceGuard],
    data: {
      // ServiceGuard
      serviceId: [
        ContractConst.SERVICEID_OPT_CMN_GENERIC_DATA_OUTPUT,
      ],
    },
  },
  {
    path: 'history',
    loadChildren: './page/export-history-page/export-history-page.module#ExportHistoryPageModule',
    canLoad: [BlAuthGuard, ContractGuard, ServiceGuard],
    data: {
      // ServiceGuard
      serviceId: [
        ContractConst.SERVICEID_OPT_CMN_GENERIC_DATA_OUTPUT_LIST,
      ],
    },
  },
  {
    path: 'report',
    loadChildren: './page/export-report-page/export-report-page.module#ExportReportPageModule',
    // loadChildren: './page/export-history-page/export-history-page.module#ExportHistoryPageModule',
    canLoad: [BlAuthGuard, ContractGuard],
    data: {},
  },

  /**
   * 画面遷移(URL)の定義を追加する。END
   */
  {
    path: '**',
    redirectTo: 'output'
  },
];

/**
 * アプリケーションルーティングモジュール
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
