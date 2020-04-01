import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphiqueComponent } from './graphique.component';

describe('GraphiqueComponent', () => {
  let component: GraphiqueComponent;
  let fixture: ComponentFixture<GraphiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
