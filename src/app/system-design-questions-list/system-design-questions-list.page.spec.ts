import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemDesignQuestionsListPage } from './system-design-questions-list.page';

describe('SystemDesignQuestionsListPage', () => {
  let component: SystemDesignQuestionsListPage;
  let fixture: ComponentFixture<SystemDesignQuestionsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemDesignQuestionsListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemDesignQuestionsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
