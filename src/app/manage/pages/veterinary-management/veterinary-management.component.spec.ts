import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeterinaryManagementComponent } from './veterinary-management.component';

describe('VeterinaryManagementComponent', () => {
  let component: VeterinaryManagementComponent;
  let fixture: ComponentFixture<VeterinaryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeterinaryManagementComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VeterinaryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
