import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticListManagementComponent } from './diagnostic-list-management.component';

describe('DiagnosticListManagementComponent', () => {
  let component: DiagnosticListManagementComponent;
  let fixture: ComponentFixture<DiagnosticListManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticListManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagnosticListManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
