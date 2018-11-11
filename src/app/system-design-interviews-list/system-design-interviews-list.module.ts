import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SystemDesignInterviewsListPage } from './system-design-interviews-list.page';

const routes: Routes = [
  {
    path: '',
    component: SystemDesignInterviewsListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SystemDesignInterviewsListPage]
})
export class SystemDesignInterviewsListPageModule {}
