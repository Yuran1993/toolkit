import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlogScreenComponent } from './inlog-screen.component';

describe('InlogScreenComponent', () => {
  let component: InlogScreenComponent;
  let fixture: ComponentFixture<InlogScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlogScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlogScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
