import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewExperiencesListPage } from './interview-experiences-list.page';

describe('InterviewExperiencesListPage', () => {
  let component: InterviewExperiencesListPage;
  let fixture: ComponentFixture<InterviewExperiencesListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewExperiencesListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewExperiencesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
