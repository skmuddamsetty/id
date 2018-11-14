import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-interview-experience',
  templateUrl: './post-interview-experience.page.html',
  styleUrls: ['./post-interview-experience.page.scss']
})
export class PostInterviewExperiencePage implements OnInit {
  constructor(public router: Router) {}

  ngOnInit() {}

  goBack() {
    this.router.navigate(['/home']);
  }
}
