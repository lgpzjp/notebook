import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlAuthGuard } from '@blcloud/bl-ng-common';
import { ExportRequestPageComponent } from './export-request-page.component';
import { ExportMenuItems } from './export-request-page.const';

const routes: Routes = [
  {
    path: '',
    component: ExportRequestPageComponent,
    canActivate: [BlAuthGuard],
    children: ExportMenuItems
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportRequestPageRoutingModule {}
