import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemDesignsListPage } from './system-designs-list.page';

describe('SystemDesignsListPage', () => {
  let component: SystemDesignsListPage;
  let fixture: ComponentFixture<SystemDesignsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemDesignsListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemDesignsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
