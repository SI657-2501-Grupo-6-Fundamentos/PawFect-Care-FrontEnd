import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeterinaryAppointmentsManagementComponent } from './veterinary-appointments-management.component';

describe('VeterinaryAppointmentsManagementComponent', () => {
  let component: VeterinaryAppointmentsManagementComponent;
  let fixture: ComponentFixture<VeterinaryAppointmentsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeterinaryAppointmentsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeterinaryAppointmentsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
