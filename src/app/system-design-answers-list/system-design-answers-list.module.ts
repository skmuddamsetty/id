import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SystemDesignAnswersListPage } from './system-design-answers-list.page';

const routes: Routes = [
  {
    path: '',
    component: SystemDesignAnswersListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SystemDesignAnswersListPage]
})
export class SystemDesignAnswersListPageModule {}
