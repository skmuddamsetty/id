import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologiesListPage } from './technologies-list.page';

describe('TechnologiesListPage', () => {
  let component: TechnologiesListPage;
  let fixture: ComponentFixture<TechnologiesListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnologiesListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnologiesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
