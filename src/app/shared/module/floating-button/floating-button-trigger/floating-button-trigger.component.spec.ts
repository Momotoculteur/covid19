import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingButtonTriggerComponent } from './floating-button-trigger.component';

describe('FloatingButtonTriggerComponent', () => {
  let component: FloatingButtonTriggerComponent;
  let fixture: ComponentFixture<FloatingButtonTriggerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloatingButtonTriggerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatingButtonTriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
