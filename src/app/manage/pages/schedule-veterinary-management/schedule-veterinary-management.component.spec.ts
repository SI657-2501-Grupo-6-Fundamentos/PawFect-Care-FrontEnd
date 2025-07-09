import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleVeterinaryManagementComponent } from './schedule-veterinary-management.component';

describe('ScheduleVeterinaryManagementComponent', () => {
  let component: ScheduleVeterinaryManagementComponent;
  let fixture: ComponentFixture<ScheduleVeterinaryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleVeterinaryManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleVeterinaryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
