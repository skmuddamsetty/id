import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostInterviewExperiencePage } from './post-interview-experience.page';

describe('PostInterviewExperiencePage', () => {
  let component: PostInterviewExperiencePage;
  let fixture: ComponentFixture<PostInterviewExperiencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostInterviewExperiencePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostInterviewExperiencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
