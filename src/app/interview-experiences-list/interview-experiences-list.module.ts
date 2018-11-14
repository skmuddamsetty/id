import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InterviewExperiencesListPage } from './interview-experiences-list.page';

const routes: Routes = [
  {
    path: '',
    component: InterviewExperiencesListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InterviewExperiencesListPage]
})
export class InterviewExperiencesListPageModule {}
