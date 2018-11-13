import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SystemDesignQuestionsListPage } from './system-design-questions-list.page';

const routes: Routes = [
  {
    path: '',
    component: SystemDesignQuestionsListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [SystemDesignQuestionsListPage]
})
export class SystemDesignQuestionsListPageModule {}
