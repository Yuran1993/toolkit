import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempToolComponent } from './temp-tool.component';

describe('TempToolComponent', () => {
  let component: TempToolComponent;
  let fixture: ComponentFixture<TempToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
