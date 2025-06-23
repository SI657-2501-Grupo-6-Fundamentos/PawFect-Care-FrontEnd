import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentManagementComponent } from './treatment-management.component';

describe('TreatmentManagementComponent', () => {
  let component: TreatmentManagementComponent;
  let fixture: ComponentFixture<TreatmentManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatmentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
