import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemDesignInterviewsListPage } from './system-design-interviews-list.page';

describe('SystemDesignInterviewsListPage', () => {
  let component: SystemDesignInterviewsListPage;
  let fixture: ComponentFixture<SystemDesignInterviewsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemDesignInterviewsListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemDesignInterviewsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
