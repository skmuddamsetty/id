import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: 'log-in', loadChildren: './log-in/log-in.module#LogInPageModule' },
  { path: 'log-out', loadChildren: './log-out/log-out.module#LogOutPageModule' },
  { path: 'system-designs-list', loadChildren: './system-designs-list/system-designs-list.module#SystemDesignsListPageModule' },
  { path: 'system-design-interviews-list', loadChildren: './system-design-interviews-list/system-design-interviews-list.module#SystemDesignInterviewsListPageModule' },
  { path: 'system-design-questions-list', loadChildren: './system-design-questions-list/system-design-questions-list.module#SystemDesignQuestionsListPageModule' },
  { path: 'system-design-answers-list', loadChildren: './system-design-answers-list/system-design-answers-list.module#SystemDesignAnswersListPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'interview-experiences-list', loadChildren: './interview-experiences-list/interview-experiences-list.module#InterviewExperiencesListPageModule' },
  { path: 'post-interview-experience', loadChildren: './post-interview-experience/post-interview-experience.module#PostInterviewExperiencePageModule' },
  { path: 'create-interview', loadChildren: './create-interview/create-interview.module#CreateInterviewPageModule' },
  { path: 'view-interview', loadChildren: './view-interview/view-interview.module#ViewInterviewPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
