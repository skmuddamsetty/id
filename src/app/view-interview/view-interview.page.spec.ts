import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInterviewPage } from './view-interview.page';

describe('ViewInterviewPage', () => {
  let component: ViewInterviewPage;
  let fixture: ComponentFixture<ViewInterviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInterviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInterviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
