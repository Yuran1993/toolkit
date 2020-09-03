import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BayesCalcComponent } from './bayes-calc.component';

describe('BayesCalcComponent', () => {
  let component: BayesCalcComponent;
  let fixture: ComponentFixture<BayesCalcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BayesCalcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BayesCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
