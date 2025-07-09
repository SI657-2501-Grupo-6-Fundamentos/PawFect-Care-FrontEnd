import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewListManagementComponent } from './review-list-management.component';

describe('ReviewListManagementComponent', () => {
  let component: ReviewListManagementComponent;
  let fixture: ComponentFixture<ReviewListManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewListManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewListManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
