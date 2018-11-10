import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogOutPage } from './log-out.page';

describe('LogOutPage', () => {
  let component: LogOutPage;
  let fixture: ComponentFixture<LogOutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogOutPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogOutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
