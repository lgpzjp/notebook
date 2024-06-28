import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExportPageComponent } from './export-page.component';

/** ルーティング */

/**
 * SPA内部で遷移URL定義 START
 */
const routes: Routes = [
  {
    path: '',
    component: ExportPageComponent,
  },
];

/**
 * エントリーページルーティングモジュール
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportPageRoutingModule { }
