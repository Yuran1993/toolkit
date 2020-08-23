import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbTestCalcComponent } from './ab-test-calc.component';

describe('AbTestCalcComponent', () => {
  let component: AbTestCalcComponent;
  let fixture: ComponentFixture<AbTestCalcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbTestCalcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbTestCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
