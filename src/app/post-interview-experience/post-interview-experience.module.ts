import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PostInterviewExperiencePage } from './post-interview-experience.page';

const routes: Routes = [
  {
    path: '',
    component: PostInterviewExperiencePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PostInterviewExperiencePage]
})
export class PostInterviewExperiencePageModule {}
