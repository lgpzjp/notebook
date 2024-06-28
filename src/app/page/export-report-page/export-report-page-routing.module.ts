import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlAuthGuard } from '@blcloud/bl-ng-common';
import { ExportReportPageComponent } from './export-report-page.component';
import { ExportMenuItems } from './export-report-page.const';

const routes: Routes = [
  {
    path: '',
    component: ExportReportPageComponent,
    canActivate: [BlAuthGuard],
    children: ExportMenuItems
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportReportPageRoutingModule {}
