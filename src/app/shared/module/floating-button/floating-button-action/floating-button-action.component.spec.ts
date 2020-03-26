import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingButtonActionComponent } from './floating-button-action.component';

describe('FloatingButtonActionComponent', () => {
  let component: FloatingButtonActionComponent;
  let fixture: ComponentFixture<FloatingButtonActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloatingButtonActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatingButtonActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
