import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticManagementComponent } from './diagnostic-management.component';

describe('DiagnosticManagementComponent', () => {
  let component: DiagnosticManagementComponent;
  let fixture: ComponentFixture<DiagnosticManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagnosticManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
