import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleSizeCalcComponent } from './sample-size-calc.component';

describe('SampleSizeCalcComponent', () => {
  let component: SampleSizeCalcComponent;
  let fixture: ComponentFixture<SampleSizeCalcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleSizeCalcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleSizeCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
