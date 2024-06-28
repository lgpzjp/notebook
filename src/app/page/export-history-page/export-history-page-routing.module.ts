import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlAuthGuard } from '@blcloud/bl-ng-common';
import { ExportHistoryPageComponent } from './export-history-page.component';

const routes: Routes = [
  {
    path: '',
    component: ExportHistoryPageComponent,
    canActivate: [BlAuthGuard],
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportHistoryPageRoutingModule {}
