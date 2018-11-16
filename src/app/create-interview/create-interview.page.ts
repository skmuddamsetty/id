import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Interview, InterviewId } from './../models/interview.model';
import { DataService } from './../services/data.service';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

@Component({
  selector: 'app-create-interview',
  templateUrl: './create-interview.page.html',
  styleUrls: ['./create-interview.page.scss']
})
export class CreateInterviewPage implements OnInit {
  myForm: FormGroup;
  currentuid = '';
  interviewsCollection: AngularFirestoreCollection<Interview>;
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private readonly afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.authService.getCurrentUser() != null) {
      this.currentuid = this.authService.getCurrentUser().uid;
    }
  }

  onProceed() {
    const interview: Interview = {
      title: this.myForm.value.title,
      company: this.myForm.value.company,
      createUserId: this.currentuid
    };
    this.insertInterview(interview);
  }

  insertInterview(interview: Interview) {
    this.interviewsCollection = this.afs.collection('interviews');
    this.interviewsCollection.add(interview).then(res => {
      const interviewId: InterviewId = {
        createUserId: this.currentuid,
        id: res.id,
        title: '',
        company: ''
      };
      this.dataService.setInterviewId(interviewId);
      this.router.navigate(['/post-interview-experience']);
    });
  }

  private initForm() {
    const title = null;
    const company = null;
    this.myForm = new FormGroup({
      title: new FormControl(title, Validators.required),
      company: new FormControl(company, Validators.required)
    });
  }
}
