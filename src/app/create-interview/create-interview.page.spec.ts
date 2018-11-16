import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInterviewPage } from './create-interview.page';

describe('CreateInterviewPage', () => {
  let component: CreateInterviewPage;
  let fixture: ComponentFixture<CreateInterviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateInterviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInterviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
