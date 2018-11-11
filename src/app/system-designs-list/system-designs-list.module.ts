import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SystemDesignsListPage } from './system-designs-list.page';

const routes: Routes = [
  {
    path: '',
    component: SystemDesignsListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SystemDesignsListPage]
})
export class SystemDesignsListPageModule {}
