import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImperativeComponent } from './imperative.component';

describe('ImperativeComponent', () => {
  let component: ImperativeComponent;
  let fixture: ComponentFixture<ImperativeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImperativeComponent]
    });
    fixture = TestBed.createComponent(ImperativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
