import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Interview, InterviewId } from './../models/interview.model';
import { DataService } from './../services/data.service';
import {
  Validators,
  FormGroup,
  FormControl,
  FormArray,
  NgForm
} from '@angular/forms';
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
  technologiesForm: FormGroup;
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
      createUserId: this.currentuid,
      technologies: this.myForm.value.technologies
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
    const technologies = [];
    this.myForm = new FormGroup({
      title: new FormControl(title, Validators.required),
      company: new FormControl(company, Validators.required),
      technologies: new FormArray(technologies, Validators.required)
    });
  }

  onAddTechnology(ngForm: NgForm) {
    (<FormArray>this.myForm.get('technologies')).push(
      new FormControl(ngForm.value.technology, Validators.required)
    );
    ngForm.resetForm();
  }

  onDeleteTechnology(index: number) {
    (<FormArray>this.myForm.get('technologies')).removeAt(index);
  }
}
