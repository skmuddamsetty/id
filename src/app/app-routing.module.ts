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
  { path: 'view-interview', loadChildren: './view-interview/view-interview.module#ViewInterviewPageModule' },
  { path: 'view-answers', loadChildren: './view-answers/view-answers.module#ViewAnswersPageModule' },
  { path: 'technologies-list', loadChildren: './technologies-list/technologies-list.module#TechnologiesListPageModule' },
  { path: 'user-dashboard', loadChildren: './user-dashboard/user-dashboard.module#UserDashboardPageModule' },
  { path: 'edit-profile', loadChildren: './edit-profile/edit-profile.module#EditProfilePageModule' },
  { path: 'client-list', loadChildren: './client-list/client-list.module#ClientListPageModule' },
  { path: 'role-list', loadChildren: './role-list/role-list.module#RoleListPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
