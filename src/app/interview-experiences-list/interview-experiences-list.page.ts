import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interview-experiences-list',
  templateUrl: './interview-experiences-list.page.html',
  styleUrls: ['./interview-experiences-list.page.scss']
})
export class InterviewExperiencesListPage implements OnInit {
  constructor(public router: Router) {}

  ngOnInit() {}

  goBack() {
    this.router.navigate(['/home']);
  }
}
